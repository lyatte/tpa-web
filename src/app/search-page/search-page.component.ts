import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit {

  constructor(private route: ActivatedRoute, private apollo: Apollo,
    private usr: HeroService) { }

  videos:[];

  playlist :[];

  channel:[];

  keyword;

  userLog;

  playlistThumbnail = {};

  pChannel = {};

  vidCount = {};

  upDate = "3";

  isNotSame = {};
  isSubscribed = {};

  

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.keyword = params.get('keyword')
      console.log(this.keyword)

      this.usr.getUser().subscribe( user => {
        this.apollo.watchQuery( {
          query: gql`
            query getChannelById($channel_id: String!){
              getChannelById(channel_id : $channel_id){
                channel_id,
                channel_premium,
                channel_subscribe
              }
            }
          `,
          variables: {
            channel_id: user.id
          }
        } ).valueChanges.subscribe( r => {
          this.userLog = r.data.getChannelById

          console.log("User : ", this.userLog)

          this.getVids("3", this.userLog.channel_premium)
          this.getPlaylist()
          this.getChannel()
        } )
      } )
      
      
    })

  }

  subscribe(chId, index){
    if(!this.isSubscribed[index]) {
      this.apollo.mutate( {
        mutation: gql`
          mutation addChannelSubscribe($channel_id: String!, $ch_subs: String!){
            addChannelSubscribe(channel_id: $channel_id, ch_subs: $ch_subs)
          }
        `,
        variables: {
          channel_id: this.userLog.channel_id,
          ch_subs: chId
        }
      } ).subscribe( r => {
        console.log(r)

        this.isSubscribed[index] = true;
      } )
    } 
    else {
      this.apollo.mutate( {
        mutation: gql`
          mutation unsubscribeChannel($channel_id: String!, $ch_subs: String!){
            unsubscribeChannel(channel_id: $channel_id, ch_subs: $ch_subs)
          }
        `,
        variables: {
          channel_id: this.userLog.channel_id,
          ch_subs: chId
        },
      } ).subscribe( r => {
        console.log(r)

        this.isSubscribed[index] = false;
      } )
    }
  }

  getViews(number): String{
    if(number<1000) return number;
    if(number<100000) return (number/1000).toFixed(1) + " k";
    if(number<1000000000) return (number/1000000).toFixed(1) + " m";
  }

  getDay(day, month, year): String{
    var date = day + (month*30) + (year*365);

    var todayDate = new Date();

    var today_day = todayDate.getDate();
    var today_month = (todayDate.getMonth()+1) * 30;
    var today_year = todayDate.getFullYear() * 365;

    var differences = (today_day + today_month + today_year) - date;

    if(differences == 0) return "today"
    else if(differences < 7) return differences + " day ago"
    else if(differences < 30) return Math.floor(differences/7) + " week ago"
    else if(differences < 365) return Math.floor(differences / 30) + " month ago"
    else return Math.floor(differences/365) + " year ago"
  }


  getVids(date, premium){
    this.apollo.watchQuery( {
      query: gql`
        query getSearchVideo($keyword: String!, $uploadDate: String!, $premium: String!){
          getSearchVideo(keyword: $keyword, uploadDate: $uploadDate, premium: $premium){
            video_id,
            video_title,
            video,
            video_thumbnail,
            video_description,
            video_views,
            channel_name,
            day,
            month,
            year,
            channel_id
          }
        }
      `,
      variables: {
        keyword: this.keyword,
        uploadDate: date,
        premium: premium
      }
    } ).valueChanges.subscribe( r=> {
      this.videos = r.data.getSearchVideo

      console.log(this.videos)
    } )
  }

  getPlaylist(){
    this.apollo.watchQuery( {
      query: gql`
        query getSearchPlaylist($keyword: String!, $uploadDate: String!){
          getSearchPlaylist(keyword: $keyword, uploadDate: $uploadDate){
            playlist_id,
            playlist_videos,
            playlist_title,
            channel_id,
            playlist_desc
          }
        }
      `,
      variables: {
        keyword: this.keyword,
        uploadDate: "3"
      }
    } ).valueChanges.subscribe( r=> {
      this.playlist = r.data.getSearchPlaylist

      
      for(let i =0 ;i<this.playlist.length;i++){
        var temp = this.playlist[i].playlist_videos.split(",")

        this.apollo.watchQuery( {
          query: gql`
            query getVideoById($video_id: Int!){
              getVideoById(video_id : $video_id){
                video_thumbnail
              } 
            }
          `,
          variables: {
            video_id: temp[0]
          }
        } ).valueChanges.subscribe( vid => {
          this.playlistThumbnail[i] = vid.data.getVideoById.video_thumbnail

          console.log(this.playlistThumbnail[i])
        } )

        console.log(this.playlist[i].channel_id)

        this.apollo.watchQuery( {
          query: gql`
            query getChannelById($channel_id: String!){
              getChannelById(channel_id : $channel_id){
                channel_name
              } 
            }
          `,
          variables: {
            channel_id: this.playlist[i].channel_id
          }
        } ).valueChanges.subscribe( vid => {
          this.pChannel[i] = vid.data.getChannelById.channel_name

          console.log(this.pChannel[i])
        } )
      }
    } )
  }

  getChannel(){
    this.apollo.watchQuery( {
      query: gql`
        query getSearchChannel($keyword: String!, $uploadDate: String!){
          getSearchChannel(keyword: $keyword, uploadDate: $uploadDate){
            channel_name,
            channel_id,
            channel_icon,
            channel_description,
            channel_subscribers
          }
        }
      `,
      variables: {
        keyword: this.keyword,
        uploadDate: "3"
      }
    } ).valueChanges.subscribe( r=> {
      this.channel = r.data.getSearchChannel

      console.log(this.channel)

      var temp;

      for(let j = 0 ; j <this.channel.length; j++){

        console.log("Asd", this.userLog.channel_id, this.channel[j].channel_id)

        if(this.userLog.channel_id == this.channel[j].channel_id){
          this.isNotSame[j] = false;
        }else{
          this.isNotSame[j] = true;

          console.log("subscribers", this.userLog.channel_subscribe)

          var temp2 = this.userLog.channel_subscribe.split(",")

          for(let k =0;k<temp2.length;k++){
            if(temp2[k] == this.channel[j].channel_id ){
              console.log("same", temp2[k], this.channel[j].channel_id)
              this.isSubscribed[j] = true;
              console.log("index : ", j, this.isSubscribed[j])
              break;
            }else{
              this.isSubscribed[j] = false;
            }
          }
        }
        
        

        console.log(this.channel[j])
        this.apollo.watchQuery( {
          query: gql`
            query getVideo{
              getVideo{
                channel_id
              }
            }
          `
        } ).valueChanges.subscribe( v => {
          temp = v.data.getVideo

  
          var f: number = 0;
          for(let i=0;i<temp.length;i++){
            console.log(temp[i].channel_id, this.channel[j].channel_id)
            if(temp[i].channel_id == this.channel[j].channel_id){
              f+=1;
              console.log(f)
              this.vidCount[j] = f
              console.log(this.vidCount[j])
            }
          }
        } )

      }


      console.log(this.channel)
    } )
  }

  getSubs(number): String{
    if(number<1000) return number;
    if(number<100000) return (number/1000).toFixed(1) + " k";
    if(number<1000000000) return (number/1000000).toFixed(1) + " m";
  }

  filterDate(num){
    this.upDate = num.toString();

    this.filterVideo();
  }

  filterVideo(){
    this.channel= [];
    this.playlist = [];
    this.videos = [];
    this.getVids(this.upDate, this.userLog.channel_premium);
  }

  filterPlaylist(){
    this.upDate = "3";
    this.channel= [];
    this.videos = [];
    this.playlist = [];
    this.getPlaylist();
  }

  filterChannel(){
    this.upDate = "3";
    this.videos = [];
    this.playlist = [];
    this.channel = [];
    this.getChannel();
  }



}