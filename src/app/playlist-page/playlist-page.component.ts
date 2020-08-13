import { Component, OnInit, ɵConsole } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-playlist-page',
  templateUrl: './playlist-page.component.html',
  styleUrls: ['./playlist-page.component.scss']
})
export class PlaylistPageComponent implements OnInit {

  constructor(private route: ActivatedRoute, private apollo: Apollo, 
    private us: HeroService, private router: Router) { }

  playlistId;

  playlist: [];

  thumbnail = "../../assets/no_image.png";

  videoCount;

  videos: [];

  playlistChannel;

  userLog;

  isSame;

  lastKey = 0;

  observer: any;

  ngOnInit(): void {

    this.lastKey = 9;

    this.playlistId = +this.route.snapshot.paramMap.get('id');

    var vids = new Array();

    var counter = 0;

    this.isSame = false;

    this.apollo.watchQuery( { 
      query: gql`
        query getPlaylistById($id: ID!){
          getPlaylistById(playlist_id: $id){
            playlist_id,
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

       console.log(this.playlist)


       this.us.getUser().subscribe( u => {
         console.log(u)
        this.apollo.watchQuery( { 
          query: gql`
           query getChannelById($id: String!){
             getChannelById(channel_id : $id){
               channel_name,
               channel_icon,
               channel_id,
               channel_subscribe
             }
           }
           `,
           variables: {
             id: u.id
           }
         } ).valueChanges.subscribe( k => {
          //  console.log(k)
           this.userLog = k.data.getChannelById
          //  console.log(k.data.getChannelById)
          //  console.log(this.userLog)

          //  console.log(this.userLog.channel_id, this.playlist.channel_id)

          var temp2 = this.userLog.channel_subscribe.split(",")

           if(this.userLog.channel_id == this.playlist.channel_id){
             this.isSame = true;
            //  console.log("samee", this.isSame)
           }else{
            for(let i =0; i< temp2.length;i++){
              // console.log(temp2[i], this.channel.channel_id)
              if (temp2[i] == this.playlist.channel_id){
                this.isSubscribed = true;
                break;
              }
            }
           }
           
          })



       } )

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
       
       this.apollo.watchQuery( {
         query:gql`
          query getPlaylistVideo($videos: String!, $flag: String!){
            getPlaylistVideo(videos: $videos, flag: $flag ){
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
         variables: {
            videos: this.playlist.playlist_videos,
            flag: this.flags2.toString()
         }
       } ).valueChanges.subscribe( v => {
         this.videos = v.data.getPlaylistVideo

         this.thumbnail = this.videos[0].video_thumbnail

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

       


     })

  }

  deleteVideoPlaylist(id){
    console.log(this.playlist.playlist_id)
    console.log(id)
    this.apollo.mutate( {
      mutation: gql`
        mutation deleteVideoPlaylist($playlist_id: ID!, $video_id: String!){
          deleteVideoPlaylist(playlist_id: $playlist_id, video_id: $video_id)
        }
      `,
      variables: {
        playlist_id: this.playlist.playlist_id,
        video_id: id.toString()
      },
      refetchQueries: [ {
        query:gql`
          query getPlaylistVideo($videos: String!, $flag: String!){
            getPlaylistVideo(videos: $videos, flag: $flag ){
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
         variables: {
            videos: this.playlist.playlist_videos,
            flag: this.flags2.toString()
         }
      } ]
    } ).subscribe( r => {
      console.log(r)
    } )
  }

  deletePlaylist(){
    console.log("p id: ", this.playlist.playlist_id)
    this.apollo.mutate( {
      mutation: gql`
        mutation deletePlaylist($playlist_id: ID!){
          deletePlaylist(playlist_id: $playlist_id)
        }
      `,
      variables: {
        playlist_id: this.playlist.playlist_id
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
          id: this.userLog.channel_id
        }
      } ]
    } ).subscribe( r => {
      console.log(r)

      this.router.navigate([''])
    } )
  }

  flags = 1;
  flags2 = 1;

  filter(num){
    this.videos= [];
    
    if(num == 1){
      this.apollo.watchQuery( {
        query:gql`
         query getPlaylistVideoPopularity($videos: String!){
          getPlaylistVideoPopularity(videos: $videos){
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
        variables: {
           videos: this.playlist.playlist_videos
        }
      } ).valueChanges.subscribe( v => {
        this.videos = v.data.getPlaylistVideoPopularity

        this.thumbnail = this.videos[0].video_thumbnail

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
    }else if(num == 2){
      this.apollo.watchQuery( {
        query:gql`
         query getPlaylistVideoDP($videos: String!, $flag: String!){
          getPlaylistVideoDP(videos: $videos, flag: $flag){
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
        variables: {
           videos: this.playlist.playlist_videos,
           flag: this.flags.toString()
        }
      } ).valueChanges.subscribe( v => {
        this.videos = v.data.getPlaylistVideoDP
        console.log(this.videos) 

        if(this.flags==1){
          this.flags = 2
        }else {
          this.flags = 1
        }

        this.thumbnail = this.videos[0].video_thumbnail

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

      })
    }else{
      console.log(this.flags2)
      this.apollo.watchQuery( {
        query:gql`
         query getPlaylistVideo($videos: String!, $flag: String!){
          getPlaylistVideo(videos: $videos, flag: $flag){
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
        variables: {
           videos: this.playlist.playlist_videos,
           flag: this.flags2.toString()
        }
      } ).valueChanges.subscribe( v => {
        this.videos = v.data.getPlaylistVideo
        console.log(this.videos) 

        if(this.flags2==1){
          this.flags2 = 2
        }else {
          this.flags2 = 1
        }
        console.log(this.flags2)

        this.thumbnail = this.videos[0].video_thumbnail

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

      })
    }
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
    if(!this.isSubscribed) {
      this.apollo.mutate( {
        mutation: gql`
          mutation addChannelSubscribe($channel_id: String!, $ch_subs: String!){
            addChannelSubscribe(channel_id: $channel_id, ch_subs: $ch_subs)
          }
        `,
        variables: {
          channel_id: this.userLog.channel_id,
          ch_subs: this.playlist.channel_id
        }
      } ).subscribe( r => {
        console.log(r)

        this.isSubscribed = true;
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
          ch_subs: this.playlist.channel_id
        },
      } ).subscribe( r => {
        console.log(r)

        this.isSubscribed = false;
      } )
    }
  }

}
