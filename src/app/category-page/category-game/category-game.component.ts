import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

import { CategoryVidsService } from '../../category-vids.service';
import { Subscription } from 'rxjs';
import { HeroService } from 'src/app/hero.service';
import { query } from '@angular/animations';

@Component({
  selector: 'app-category-game',
  templateUrl: './category-game.component.html',
  styleUrls: ['./category-game.component.scss']
})
export class CategoryGameComponent implements OnInit {

  constructor(private apollo: Apollo, private vids: CategoryVidsService, 
    private user: HeroService) { }

  videos1: any;
  videos2: any;
  videos3: any;
  videos4: any;

  videoDuration1 = [];
  videoDuration2 = [];
  videoDuration3 = [];
  videoDuration4 = [];

  premiumVids1 = [];
  premiumVids2 = [];
  premiumVids3 = [];
  premiumVids4 = [];

  playlist;
  
  ngOnInit(): void {
    var temp = JSON.parse(localStorage.getItem('restrict'))

    var rest;

    if (temp == "Off"){
      rest = "No"
    }else {
      rest = "Yes"
    }
    if(localStorage.getItem('user') == null){
      this.vids.getAllTimePopular(rest, "3", "Game").subscribe( r => {
        console.log(r)
        this.videos1 = r;
      } )
  
      this.vids.getVideoWeek(rest, "3", "Game").subscribe( r => {
        console.log(r)
        this.videos2 = r;
      } )
  
      this.vids.getVideoMonth(rest, "3", "Game").subscribe( r => {
        console.log(r)
        this.videos3 = r;
      } )

      this.vids.getVideoRecent(rest, "3", "Game").subscribe( r => {
        console.log(r)
        this.videos4 = r;
      } )
    }else{
      this.user.getUser().subscribe( us => {
        console.log(us)
        console.log(rest)

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
  
        this.apollo.watchQuery( {
          query: gql`
            query getChannelById($id: String!){
              getChannelById(channel_id: $id){
                channel_premium
              }
            }
          `,variables: {
            id: us.id
          }
        } ).valueChanges.subscribe( user => {
          console.log(user.data.getChannelById.channel_premium)
  
          this.vids.getAllTimePopular(rest, user.data.getChannelById.channel_premium, "Game").subscribe( r => {
            console.log(r)
            this.videos1 = r;

            if(this.videos1 != null){
              for(let i = 0;i < this.videos1.length; i++){
                if(this.videos1[i].video_premium == "true"){
                  this.premiumVids1[i] = true;
                  console.log("yak masuk sini")
                }
              }
              console.log("heauhaehuhauehuae")

            }
          } )
      
          this.vids.getVideoWeek(rest, user.data.getChannelById.channel_premium, "Game").subscribe( r => {
            console.log(r)
            this.videos2 = r;

            if(this.videos2 != null){
              for(let i = 0;i < this.videos2.length; i++){
                if(this.videos2[i].video_premium == "true"){
                  this.premiumVids2[i] = true;
                }
              }
            }
          } )
      
          this.vids.getVideoMonth(rest, user.data.getChannelById.channel_premium, "Game").subscribe( r => {
            console.log(r)
            this.videos3 = r;

            if(this.videos3 != null){
              for(let i = 0;i < this.videos3.length; i++){
                if(this.videos3[i].video_premium == "true"){
                  this.premiumVids3[i] = true;
                }
              }
            }
          } )
  
          this.vids.getVideoRecent(rest, user.data.getChannelById.channel_premium, "Game").subscribe( r => {
            console.log(r)
            this.videos4 = r;

            if(this.videos4 != null){
              for(let i = 0;i < this.videos4.length; i++){
                if(this.videos4[i].video_premium == "true"){
                  this.premiumVids4[i] = true;
                }
              }
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
      }else if(flag == 3){
        this.videoDuration3[index] =  minute + "." + "0" + second;
      }else{
        this.videoDuration4[index] =  minute + "." + "0" + second;
      }
    }else{
      if(flag == 1)
        this.videoDuration1[index] =  minute + "." + second;
      else if(flag == 2)
        this.videoDuration2[index] =  minute + "." + second;
      else if(flag == 3)
        this.videoDuration3[index] =  minute + "." + second;
      else
        this.videoDuration4[index] =  minute + "." + second;

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
