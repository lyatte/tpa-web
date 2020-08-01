import { Component, OnInit } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';

import { HeroService } from '../hero.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  constructor(private apollo: Apollo,
    private user: HeroService) { }

  isExpanded: string;

  videos: any;

  videoDuration;

  playlist;

  ngOnInit(): void {

    console.log("welcome")

    this.apollo.watchQuery({
      query: gql`
      {
        getVideo{
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
        }
      }
      `,
    }).valueChanges.subscribe(result => {
      console.log("asd")
      this.videos = result.data.getVideo
      console.log(this.videos)

      

      // let self = this;
      // for(let i = 0; i<this.videos.length; i++){
      //   console.log(this.videos[i]);
      //   var video = document.createElement('video');

      //   video.src = this.videos[i].video;

      //   console.log(video.src)

      //   console.log(video.duration)

      //   // video.preload = 'metadata';


      //   // console.log(this.videos[i].video)
  
      //   // video.onloadedmetadata = function() {
      //   //   window.URL.revokeObjectURL(video.src);
      //   //   var duration = video.duration;

      //   //   console.log(duration)
  
      //   //   self.videoDuration = self.setDuration(duration);
      //   // }
    

      //   // video.src = URL.createObjectURL(this.videos[i].video);
      // }

      
    });

    this.user.getUser().subscribe( us => {
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
          id: us.id
        }
      } ).valueChanges.subscribe( r => {
        this.playlist = r.data.getChannelPlaylist
      } )
    } )

    
  }

  getViews(number): String{
    if(number<1000) return number;
    if(number<100000) return (number/1000).toFixed(1) + " k";
    if(number<1000000000) return (number/1000000).toFixed(1) + " m";
  }

  setDuration(duration): String{
    
    var minute: number = Math.floor((duration / 60) % 60);
    var second: number = Math.floor(duration % 60);

    
    if(second < 10){
      return minute + ":" + "0" + second;
    }else{
      return minute + ":" + second;
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
    this.closeModalPlaylist();

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
        }
  
      } ).subscribe( res => 
        console.log(res) )
    } )

  }

  close(){
    
    var modal = document.getElementById('addModal');

    modal.style.display = "none";
  }

  getDay(day, month, year): String{
    var date = day + (month*30) + (year*365);

    var todayDate = new Date();

    var today_day = todayDate.getDate();
    var today_month = (todayDate.getMonth()+1) * 30;
    var today_year = todayDate.getFullYear() * 365;

    // console.log(todayDate)

    // console.log(todayDate.getMonth())

    // console.log(day, month, year)
    // console.log(today_day, todayDate.getMonth(), todayDate.getFullYear())

    // console.log((today_day + today_month + today_year), date);

    var differences = (today_day + today_month + today_year) - date;

    // console.log(differences)

    if(differences == 0) return "today"
    else if(differences < 7) return differences + " day ago"
    else if(differences < 30) return Math.floor(differences/7) + " week ago"
    else if(differences < 365) return Math.floor(differences / 30) + " month ago"
    else return Math.floor(differences/365) + " year ago"
  }

}
