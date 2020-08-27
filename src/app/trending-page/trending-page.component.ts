import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { HeroService } from '../hero.service';

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


  playlist;

  ngOnInit(): void {
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
          channel_id
        }
      }
      `,
    }).valueChanges.subscribe(result => {
      var vid = result.data.getVideoOrderedByViews
      


      this.videos = vid.slice(0,20);
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