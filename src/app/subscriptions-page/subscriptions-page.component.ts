import { Component, OnInit } from '@angular/core';
import { HeroService } from '../hero.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag'

@Component({
  selector: 'app-subscriptions-page',
  templateUrl: './subscriptions-page.component.html',
  styleUrls: ['./subscriptions-page.component.scss']
})
export class SubscriptionsPageComponent implements OnInit {

  user;

  isGuest = true;

  today_vid;

  week_vid;

  month_vid;

  channel;

  isEmpty1 = false;

  videoDuration1 = [];
  videoDuration2 = [];
  videoDuration3 = [];

  premVids1 = [];
  premVids2 = [];
  premVids3 = [];
  
  isEmpty2 = false;

  isEmpty3 = false;

  lastKey1 = 10;

  lastKey2 = 10;

  lastKey3 = 10;

  observer1: any;

  observer2: any;

  observer3: any;

  playlist;
  
  constructor(private data: HeroService, private apollo: Apollo) { }

  ngOnInit(): void {
    this.data.getUser().subscribe( res => 
    this.user = res  );

    if(this.user == null){
      this.isGuest = true;
    }else{
      this.isGuest = false;
    }

    if(!this.isGuest){
      this.data.getUser().subscribe( res => {
        this.user = res;

        this.apollo.watchQuery( { 
          query: gql`
            query getChannelPlaylist($id: String!){
              getChannelPlaylist(channel_id: $id){
                playlist_id,
                playlist_title,
                playlist_videos
              }
            }
          `,
          variables: {
            id: this.user.id
          }
        } ).valueChanges.subscribe( r => {
          this.playlist = r.data.getChannelPlaylist
        } )
  
        console.log(res)
  
        this.apollo.watchQuery({
          query: gql`
            query getChannelById($channel_id: String!){
              getChannelById(channel_id: $channel_id){
                channel_name,
                channel_subscribe,
                channel_premium
              }
            }
          `,
          variables: {
            channel_id: res.id
          }
        }).valueChanges.subscribe( r => {
          this.channel = r.data.getChannelById
  
          console.log(this.channel)
          
          console.log(this.channel.channel_subscribe)
  
  
          var temp2 = this.channel.channel_subscribe.split(",");
  
          temp2.splice(temp2.length-1, 1)
          
          console.log(temp2)
  
          this.apollo.watchQuery({
            query: gql`
              query getSubscribeVideos($channel_id: [String!]!, $flag: String!, $premium: String!){
                getSubscribeVideos(channel_id: $channel_id, flag: $flag, premium: $premium){
                  video_id,
                  video_title,
                  video,
                  video_thumbnail,
                  video_description,
                  video_views,
                  channel_name,
                  channel_icon,
                  day,
                  month,
                  year,
                  channel_id,
                  video_premium
                }
              }
            
            `,variables: {
              channel_id: temp2,
              flag: "1",
              premium: this.channel.channel_premium
            }
          }).valueChanges.subscribe( result => {
            this.today_vid = result.data.getSubscribeVideos
            console.log(this.today_vid)
  
            if(this.today_vid.length == 0){
              this.isEmpty1 = true;
            }else{
              for(let i=0;i<this.today_vid.length;i++){
                if(this.today_vid[i].video_premium == "true"){
                  this.premVids1[i] = true;
                }
              }

              this.observer1 = new IntersectionObserver( (entry) => {
                if(entry[0].isIntersecting){
                  let card = document.querySelector(".video-section");
                  for(let i = 0; i<5; i++){
                    if(this.lastKey1 < this.today_vid.length){
                      let div = document.createElement("div")
                      let video = document.createElement("div")
                      div.appendChild(video)
                      card.appendChild(div)
                      this.lastKey1++;
                    }
                  }
                }
              } )
              this.observer1.observe(document.querySelector(".this-week-section"))
            }
          } )
  
          this.apollo.watchQuery({
            query: gql`
              query getSubscribeVideos($channel_id: [String!]!, $flag: String!, $premium: String!){
                getSubscribeVideos(channel_id: $channel_id, flag: $flag, premium: $premium){
                  video_id,
                  video_title,
                  video,
                  video_thumbnail,
                  video_description,
                  video_views,
                  channel_name,
                  channel_icon,
                  day,
                  month,
                  year,
                  channel_id,
                  video_premium
                }
              }
            
            `,variables: {
              channel_id: temp2,
              flag: "2",
              premium: this.channel.channel_premium
            }
          }).valueChanges.subscribe( result => {
            this.week_vid = result.data.getSubscribeVideos
  
            if(this.week_vid.length == 0){
              this.isEmpty2 = true;
            }else{
              for(let i=0;i<this.week_vid.length;i++){
                if(this.week_vid[i].video_premium == "true"){
                  this.premVids2[i] = true;
                }
              }

              this.observer2 = new IntersectionObserver( (entry) => {
                if(entry[0].isIntersecting){
                  let card = document.querySelector(".video-section");
                  for(let i = 0; i<5; i++){
                    if(this.lastKey2 < this.week_vid.length){
                      let div = document.createElement("div")
                      let video = document.createElement("div")
                      div.appendChild(video)
                      card.appendChild(div)
                      this.lastKey2++;
                    }
                  }
                }
              } )
              this.observer2.observe(document.querySelector(".this-month-section"))
            }
  
  
          } )
  
          this.apollo.watchQuery({
            query: gql`
              query getSubscribeVideos($channel_id: [String!]!, $flag: String!, $premium: String!){
                getSubscribeVideos(channel_id: $channel_id, flag: $flag, premium: $premium){
                  video_id,
                  video_title,
                  video,
                  video_thumbnail,
                  video_description,
                  video_views,
                  channel_name,
                  channel_icon,
                  day,
                  month,
                  year,
                  channel_id,
                  video_premium
                }
              }
            
            `,variables: {
              channel_id: temp2,
              flag: "3",
              premium: this.channel.channel_premium
            }
          }).valueChanges.subscribe( result => {
            this.month_vid = result.data.getSubscribeVideos
  
            if(this.month_vid.length == 0){
              this.isEmpty3 = true;
              console.log(this.isEmpty3)
            }else{
              for(let i=0;i<this.month_vid.length;i++){
                if(this.month_vid[i].video_premium == "true"){
                  this.premVids3[i] = true;
                }
              }
              this.observer3 = new IntersectionObserver( (entry) => {
                if(entry[0].isIntersecting){
                  let card = document.querySelector(".video-section");
                  for(let i = 0; i<5; i++){
                    if(this.lastKey3 < this.month_vid.length){
                      let div = document.createElement("div")
                      let video = document.createElement("div")
                      div.appendChild(video)
                      card.appendChild(div)
                      this.lastKey3++;
                    }
                  }
                }
              } )
              this.observer3.observe(document.querySelector(".footer"))
            }
  
  
          } )
  
        } )
  
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

  setDuration(flag, index, d){
    var duration = d.target.duration
    console.log(duration)
    
    var minute: number = Math.floor((duration / 60) % 60);
    var second: number = Math.floor(duration % 60);

    
    if(second < 10){
      if(flag == 1){
        this.videoDuration1[index] =  minute + "." + "0" + second;
        
      }else if(flag == 2){
        this.videoDuration2[index] =  minute + "." + "0" + second;
      }else{
        this.videoDuration3[index] =  minute + "." + "0" + second;
      }
    }else{
      if(flag == 1)
        this.videoDuration1[index] =  minute + "." + second;
      else if(flag == 2)
        this.videoDuration2[index] =  minute + "." + second;
      else 
        this.videoDuration3[index] =  minute + "." + second;

    }

  }

  chosenVid;


  openModalPlaylist(video_id){
    var modal = document.getElementById('playlistModal');

    modal.style.display = "block";

    this.chosenVid = video_id;


    console.log(this.chosenVid)
  }

  closeModalPlaylist(){
    var modal = document.getElementById('playlistModal');

    modal.style.display = "none";
  }

  addToPlaylist(id){

    console.log(this.chosenVid, id);

    this.apollo.mutate( {
      mutation: gql`
        mutation addVideoToPlaylist($playlist_id: ID!, $video_id: ID!){
          addVideoToPlaylist(playlist_id: $playlist_id, video_id: $video_id)
        }
      `,variables:{
        video_id: this.chosenVid,
        playlist_id: id,
      }
    } ).subscribe( res => {
      console.log(res)
    } )


  }

  createPlaylist(){

    var modal = document.getElementById('addModal');

    modal.style.display = "block";

  }

  create(){
    var title = document.getElementById('pName').value;

    var date = new Date();

    var day = date.getDay();
    var month = date.getMonth()+1;
    var year = date.getFullYear();
    
    var v = "Public";
    
    console.log(title)

    this.user.getUser().subscribe( us => {
      console.log(us.id)
      this.apollo.mutate( {
        mutation: gql`
          mutation createPlaylist($ch_id: String!, 
            $title: String!, $day: Int!, $month: Int!, $year: Int!,
            $visibility: String!){
            createPlaylist( input : {
              channel_id: $ch_id
              playlist_title: $title
              playlist_day: $day
              playlist_visibility: $visibility
              playlist_month: $month
              playlist_year: $year
              playlist_views: 0
              playlist_videos: ""
              playlist_desc: ""
            }) { playlist_title }
          }
        `,
        variables: {
          ch_id: us.id,
          title: title,
          day: day,
          month: month,
          year: year,
          visibility: v
        },
        refetchQueries: [
          {
            query: gql`
              query getChannelPlaylist($id: String!){
                getChannelPlaylist(channel_id: $id){
                  playlist_id,
                  playlist_title,
                  playlist_videos
                }
              }
            `,
            variables:{
              id: us.id
            }
          }, 
        ]
  
      } ).subscribe( res => {
        console.log(res) 
      })
    } )

  }

  close(){
    
    var modal = document.getElementById('addModal');

    modal.style.display = "none";
  }

}
