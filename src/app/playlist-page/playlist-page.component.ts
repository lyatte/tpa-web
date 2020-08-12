import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-playlist-page',
  templateUrl: './playlist-page.component.html',
  styleUrls: ['./playlist-page.component.scss']
})
export class PlaylistPageComponent implements OnInit {

  constructor(private route: ActivatedRoute, private apollo: Apollo) { }

  playlistId;

  playlist;

  thumbnail = "../../assets/no_image.png";

  videoCount;

  videos;

  playlistChannel;

  ngOnInit(): void {
    this.playlistId = +this.route.snapshot.paramMap.get('id');

    var vids = new Array();

    var counter = 0;

    this.apollo.watchQuery( { 
      query: gql`
        query getPlaylistById($id: ID!){
          getPlaylistById(playlist_id: $id){
            playlist_title,
            playlist_videos,
            playlist_views,
            playlist_desc,
            channel_id,
            playlist_day,
            playlist_month,
            playlist_year
          }
        }
      `,
      variables: {
        id: this.playlistId
      }
     } ).valueChanges.subscribe( res => {
       this.playlist = res.data.getPlaylistById

       this.apollo.watchQuery( { 
         query: gql`
          query getChannelById($id: String!){
            getChannelById(channel_id : $id){
              channel_name,
              channel_icon,
              channel_id
            }
          }
          `,
          variables: {
            id: this.playlist.channel_id
          }
        } ).valueChanges.subscribe( s => {
          this.playlistChannel = s.data.getChannelById
        } )

       var array = this.playlist.playlist_videos.split(',');

       console.log(array)

       this.videoCount = array.length-1;

       if(array.length == 1){
        this.videos = null;
       }else{
        
        for(let i=0;i<array.length-1;i++){
          console.log(array[i])

          if(array[i] == "") continue;

          this.apollo.watchQuery( { 
            query: gql`
              query getVideoById($id: Int!){
                getVideoById(video_id : $id){
                  video_title,
                  channel_name,
                  video_id,
                  video_thumbnail,
                  video_views,
                  channel_id,
                  day,
                  month,
                  year,
                  video_description
                } 
              }
            `,
            variables: {
              id: array[i]
            }
           } ).valueChanges.subscribe( r => {
              vids.push(r.data.getVideoById)
              console.log(vids)
              this.videos = vids;

              console.log(array[0])

              console.log(this.videos)

              if(counter == 0){
                console.log(this.videos[0].video_thumbnail)
                console.log(this.videos[0])
                this.thumbnail = this.videos[0].video_thumbnail
                console.log("masuk sini")
                counter++;
              }
           })

        }

       }


     })

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

  getViews(number): String{
    if(number<1000) return number;
    if(number<100000) return (number/1000).toFixed(1) + " k";
    if(number<1000000000) return (number/1000000).toFixed(1) + " m";
  }

  addViews(){
    this.apollo.mutate( { 
      mutation: gql`
        mutation addPlaylistViews($id: ID!){
          addPlaylistViews(playlist_id: $id)
        }
      `,
      variables: {
        id: this.playlistId
      },
      refetchQueries: [ {
        query: gql`
          query getPlaylistById($id: ID!){
            getPlaylistById(playlist_id: $id){
              playlist_title,
              playlist_videos,
              playlist_views,
              playlist_desc,
              channel_id,
              playlist_day,
              playlist_month,
              playlist_year
            }
          }
        `,
        variables: {
          id: this.playlistId
        }
      }
    ]
     } ).subscribe( r =>
      console.log(r) )
  }

  getMonth(number):String{
    if(number == 1){
      return "Jan"
    }
    else if(number == 2){
      return "Feb"
    }
    else if(number == 3){
      return "Mar"
    }
    else if(number == 4){
      return "Apr"
    }
    else if(number == 5){
      return "May"
    }
    else if(number == 6){
      return "Jun"
    }
    else if(number == 7){
      return "Jul"
    }
    else if(number == 8){
      return "Aug"
    }
    else if(number == 9){
      return "Sep"
    }
    else if(number == 10){
      return "Okt"
    }
    else if(number == 11){
      return "Nov"
    }
    else if(number == 12){
      return "Dec"
    }
  }

  isSubscribed: boolean=false;

  subscribe(){
    if(this.isSubscribed) this.isSubscribed = false;
    else this.isSubscribed = true;
  }

}
