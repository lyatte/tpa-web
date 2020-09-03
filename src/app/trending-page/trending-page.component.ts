import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { HeroService } from '../hero.service';
import { templateJitUrl } from '@angular/compiler';

@Component({
  selector: 'app-trending-page',
  templateUrl: './trending-page.component.html',
  styleUrls: ['./trending-page.component.scss']
})
export class TrendingPageComponent implements OnInit {

  constructor(private router: Router, private apollo: Apollo, 
    private user: HeroService) { }

  views;

  videos;

  channel;
  
  playlist;

  videoDuration = [];

  premVids = [];

  vid = [];

  ngOnInit(): void {
    
    if(localStorage.getItem('user') == null){

      this.apollo.watchQuery({
        query: gql`
        {
          getVideoOrderedByViews{
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
            channel_id,
            video_premium
          }
        }
        `,
      }).valueChanges.subscribe(result => {
        this.vid = result.data.getVideoOrderedByViews

        var temps = [];
        for(let i = 0;i<this.vid.length;i++){
          console.log("no user!")
          if(this.vid[i].video_premium == "false"){
            temps.push(this.vid[i])
          }
        }
  
        this.videos = temps.slice(0,20)
      })


    }else{

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
  
        this.apollo.watchQuery({
          query: gql`
          {
            getVideoOrderedByViews{
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
              channel_id,
              video_premium
            }
          }
          `,
        }).valueChanges.subscribe(result => {
          this.vid = result.data.getVideoOrderedByViews
    
  
            console.log("there's user")
            this.apollo.watchQuery({
              query: gql`
                query getChannelById($id: String!){
                  getChannelById(channel_id: $id){
                    channel_premium,
                    channel_id
                  }
                }
              `,
              variables: {
                id: us.id
              }
            }).valueChanges.subscribe( ch => {
                this.channel = ch.data.getChannelById
    
                if(this.channel.channel_premium == "1" || 
                this.channel.channel_premium == "2"){
                  console.log("this channel prem")
                  this.videos = this.vid.slice(0,20)
    
                  for(let i = 0;i<this.videos.length;i++){
                    if(this.videos[i].video_premium == "true"){
                      console.log("true");
                      this.premVids[i] = true;
                    }
                  }
                }else{
                  console.log("this channel not prem")
                  var temps;
                  for(let i = 0;i<this.vid.length;i++){
                    if(this.vid[i].video_premium == "false"){
                      temps.push(this.vid[i])
                    }
                  }
    
                  this.videos = temps.slice(0,20)
                }
            })
    
            
            
          
        })
        
  
        
        
  
  
      } )
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
        refetchQueries: [ {
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
        } ]
  
      } ).subscribe( res => 
        console.log(res) )
    } )

  }

  getShortDesc(desc){
    var tempDesc;

    if(desc.length > 150){
      return desc.slice(0,150) + "...";
    }else return desc
  }

  close(){
    
    var modal = document.getElementById('addModal');

    modal.style.display = "none";
  }



  getViews(number): String{
    if(number<1000) return number;
    if(number<100000) return (number/1000).toFixed(1) + " k";
    if(number<1000000000) return (number/1000000).toFixed(1) + " m";
  }

  openCategoryPage(num: number){
    if(num == 1) this.router.navigate(['/category/music']);
    else if (num == 2) this.router.navigate(['/category/game']);
    else if (num == 3) this.router.navigate(['/category/news']);
    else if (num == 4) this.router.navigate(['/category/sport']);
    else if (num == 5) this.router.navigate(['/category/entertainment']);
    else this.router.navigate(['/category/travel']);
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



}



var flag = 1;

export function expand(expanded:number){
  
  var container : HTMLElement = document.querySelector('#container');
  
  if(expanded == 1){
    flag=1;
  }else{
    flag=2;
  }

  console.log(container);
  
  if(flag == 1 && container != null){
    flag = 2;
    container.style.marginLeft = "240px";
    // container.style.width = "84.4%";

  }
  else if(flag == 2 && container != null){
    flag = 1;
    container.style.marginLeft = "72px";

  }

  

}