import { Component, OnInit } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';

import { HeroService } from '../hero.service';
import { variable } from '@angular/compiler/src/output/output_ast';

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

  videoDuration = [];

  playlist;

  lastKey = 0;

  observer: any;

  us;

  premVids = [];

  ngOnInit(): void {


    this.lastKey = 12;

    var location = JSON.parse(localStorage.getItem('location'))

    console.log(location)


    this.user.getUser().subscribe( us => {
      console.log(us)

      if(us != null){
        this.apollo.watchQuery( {
          query: gql`
            query getChannelById($channel_id: String!){
              getChannelById(channel_id: $channel_id){
                channel_premium
              }
            }
          `,
          variables: {
            channel_id: us.id
          }
        } ).valueChanges.subscribe( r => {
          var ch = r.data.getChannelById
  
          console.log(ch.channel_premium)
  
          if(JSON.parse(localStorage.getItem('restrict')) == "Off"){
            this.apollo.watchQuery( { 
              query: gql`
                query getVideoHomePage($restriction: String!, $location: String!, $premium_id: String!){
                  getVideoHomePage(restriction: $restriction, location: $location, premium_id: $premium_id){
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
              `,
              variables: {
                restriction: "No",
                location: location,
                premium_id: ch.channel_premium
                
              }
            } ).valueChanges.subscribe( r => {
              console.log(r.data.getVideoHomePage)
              this.videos = r.data.getVideoHomePage
      
              console.log(this.videos)

              for(let i=0;i<this.videos.length;i++){
                console.log("asdasdasdasd", this.videos[i].video_premium)
                if(this.videos[i].video_premium == "true"){
                  this.premVids[i] = true;
                }
              }
      
              this.observer = new IntersectionObserver((entry) => {
                if(entry[0].isIntersecting){
                  let card = document.querySelector(".videoSection");
                  for(let i = 0; i<4; i++){
                    if(this.lastKey < this.videos.length){
                      let div = document.createElement("div")
                      let video = document.createElement("div")
                      div.appendChild(video)
                      card.appendChild(div)
                      this.lastKey++;
                    }
                  }
                }
              }
              )
          
              this.observer.observe(document.querySelector(".footer"))
            } )
          }else{
    
            this.apollo.watchQuery( { 
              query: gql`
                query getVideoHomePage($restriction: String!, $location: String!, $premium_id: String!){
                  getVideoHomePage(restriction: $restriction, location: $location, premium_id: $premium_id){
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
              `,
              variables: {
                restriction: "Yes",
                location: location,
                premium_id: ch.channel_premium
              }
            } ).valueChanges.subscribe( r => {
              console.log(r.data.getVideoHomePage)
              this.videos = r.data.getVideoHomePage

              for(let i=0;i<this.videos.length;i++){
                console.log("asdasdasdasd", this.videos[i].video_premium)
                if(this.videos[i].video_premium == "true"){
                  this.premVids[i] = true;
                }
              }
      
              this.observer = new IntersectionObserver((entry) => {
                if(entry[0].isIntersecting){
                  let card = document.querySelector(".videoSection");
                  for(let i = 0; i<4; i++){
                    if(this.lastKey < this.videos.length){
                      let div = document.createElement("div")
                      let video = document.createElement("div")
                      div.appendChild(video)
                      card.appendChild(div)
                      this.lastKey++;
                    }
                  }
                }
              }
              )
          
              this.observer.observe(document.querySelector(".footer"))
            } )
          }
        } )
      }else{

        if(JSON.parse(localStorage.getItem('restrict')) == "Off"){
          this.apollo.watchQuery( { 
            query: gql`
              query getVideoHomePage($restriction: String!, $location: String!, $premium_id: String!){
                getVideoHomePage(restriction: $restriction, location: $location, premium_id: $premium_id){
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
                  channel_id
                }
              }
            `,
            variables: {
              restriction: "No",
              location: location,
              premium_id: ""
              
            }
          } ).valueChanges.subscribe( r => {
            console.log(r.data.getVideoHomePage)
            this.videos = r.data.getVideoHomePage
    
            console.log(this.videos)
    
            this.observer = new IntersectionObserver((entry) => {
              if(entry[0].isIntersecting){
                let card = document.querySelector(".videoSection");
                for(let i = 0; i<4; i++){
                  if(this.lastKey < this.videos.length){
                    let div = document.createElement("div")
                    let video = document.createElement("div")
                    div.appendChild(video)
                    card.appendChild(div)
                    this.lastKey++;
                  }
                }
              }
            }
            )
        
            this.observer.observe(document.querySelector(".footer"))
          } )
        }else{
  
          this.apollo.watchQuery( { 
            query: gql`
              query getVideoHomePage($restriction: String!, $location: String!, $premium_id: String!){
                getVideoHomePage(restriction: $restriction, location: $location, premium_id: $premium_id){
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
            `,
            variables: {
              restriction: "Yes",
              location: location,
              premium_id: ""
            }
          } ).valueChanges.subscribe( r => {
            console.log(r.data.getVideoHomePage)
            this.videos = r.data.getVideoHomePage
    
            this.observer = new IntersectionObserver((entry) => {
              if(entry[0].isIntersecting){
                let card = document.querySelector(".videoSection");
                for(let i = 0; i<4; i++){
                  if(this.lastKey < this.videos.length){
                    let div = document.createElement("div")
                    let video = document.createElement("div")
                    div.appendChild(video)
                    card.appendChild(div)
                    this.lastKey++;
                  }
                }
              }
            }
            )
        
            this.observer.observe(document.querySelector(".footer"))
          } )
        }
      }
      

      

      


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

  setDuration(index, d){
    var duration = d.target.duration
    console.log(duration)
    
    var minute: number = Math.floor((duration / 60) % 60);
    var second: number = Math.floor(duration % 60);

    
    if(second < 10){
      this.videoDuration[index] =  minute + "." + "0" + second;
    }else{
      this.videoDuration[index] =  minute + "." + second;
    }

  }

  addToQueue(video_id){
    var temp = JSON.parse(sessionStorage.getItem("queueStorage"));

    var vid = [];

    if (temp == null){
      vid.push(video_id)
    }
    else{
      for(let i = 0; i<temp.length; i++){
        vid.push(temp[i])
      }

      vid.push(video_id)
    }

    sessionStorage.setItem("queueStorage",JSON.stringify(vid));
    console.log(JSON.parse(sessionStorage.getItem("queueStorage")))

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

  getDay(day, month, year): String{
    var date = day + (month*30) + (year*365);

    var todayDate = new Date();

    var today_day = todayDate.getDate();
    var today_month = (todayDate.getMonth()+1) * 30;
    var today_year = todayDate.getFullYear() * 365;

    var differences = (today_day + today_month + today_year) - date;

    // console.log(differences)

    if(differences == 0) return "today"
    else if(differences < 7) return differences + " day ago"
    else if(differences < 30) return Math.floor(differences/7) + " week ago"
    else if(differences < 365) return Math.floor(differences / 30) + " month ago"
    else return Math.floor(differences/365) + " year ago"
  }

}
