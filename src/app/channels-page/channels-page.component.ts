import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-channels-page',
  templateUrl: './channels-page.component.html',
  styleUrls: ['./channels-page.component.scss']
})
export class ChannelsPageComponent implements OnInit {

  channel;

  constructor(private route: ActivatedRoute, private apollo: Apollo,
    private us: HeroService) { }
  
  c = {};

  userLog;

  id;

  viewsCount = 0;

  isSame = false;

  isUser;

  bg;
  icon;

  playlist:[];

  playlistThumbnail = {};

  videoCount = {};

  videos = {};

  lastKey;

  observer: any;

  vRecent = [];

  vRandom = [];

  pRandom = [];


  ngOnInit(): void {

    this.lastKey = 12;

    this.c[1] = true;

    var channelId;

    this.route.paramMap.subscribe((params: ParamMap) => {
      channelId = params.get('id');
      this.id = channelId.toString();


      console.log(this.id)

      this.apollo.watchQuery({
        query: gql`
          query getChannelById($channel_id: String!){
            getChannelById(channel_id: $channel_id){
              channel_id,
              channel_name,
              channel_background,
              channel_icon,
              channel_subscribers,
              channel_description,
              channel_join_date_day,
              channel_join_date_month,
              channel_join_date_year,
              channel_premium
            }
          }
        `, 
        variables: { channel_id: this.id }
      }).valueChanges.subscribe(result => {
        this.channel = result.data.getChannelById

        this.bg = this.channel.channel_background
        this.icon = this.channel.channel_icon

        if(this.channel.channel_description == ""){
          this.channel.channel_description = "There's no description"
        }

        this.apollo.watchQuery( {
          query: gql`
            query getVideo{
              getVideo{
                channel_id,
                video_views,
                video_title
              }
            }
          `
        } ).valueChanges.subscribe( v => {
          var temps;

          temps = v.data.getVideo

          for(let i =0;i<temps.length;i++){
            if(temps[i].channel_id == this.channel.channel_id){
              // console.log("the views : ", temps[i].video_views)
              // console.log("the vids : ", temps[i].video_title)
              this.viewsCount += temps[i].video_views
              // console.log(this.viewsCount)
            }
          }
        } )

        if(localStorage.getItem('user') == null){
          this.userLog = this.channel
    
          this.userLog.channel_premium = "3"
          console.log("chpremm", this.userLog.channel_premium)
          this.isUser = false;

          this.contentExpand(1)
        }else{
          this.isUser = true;
          this.us.getUser().subscribe( user => {
            this.apollo.watchQuery({
              query: gql`
                query getChannelById($channel_id: String!){
                  getChannelById(channel_id: $channel_id){
                    channel_id,
                    channel_name,
                    channel_background,
                    channel_icon,
                    channel_subscribe,
                    channel_description,
                    channel_join_date_day,
                    channel_join_date_month,
                    channel_join_date_year,
                    channel_premium
                  }
                }
              `, 
              variables: { channel_id: user.id }
            }).valueChanges.subscribe(result => {
              this.userLog = result.data.getChannelById
              
              var temp2 = this.userLog.channel_subscribe.split(",")
      
              if(this.userLog.channel_id == this.channel.channel_id){
                this.isSame = true;
              }else{
                for(let i =0; i< temp2.length;i++){
                  // console.log(temp2[i], this.channel.channel_id)
                  if (temp2[i] == this.channel.channel_id){
                    this.isSubscribed = true;
                    break;
                  }
                }
              }

              this.contentExpand(1)
      
            })
          } )
        }
      })
    })

    

    
    

  }

  filter(num){
    this.videos = [];

    if(num == 1){
      this.apollo.watchQuery( {
        query: gql`
          query getChannelVideoMostPopular($channel_id: String!, $flag: String!){
              getChannelVideoMostPopular(channel_id: $channel_id, flag: $flag){
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
          channel_id: this.channel.channel_id,
          flag: this.userLog.channel_premium,
        }
      } ).valueChanges.subscribe( r => {
        this.videos = r.data.getChannelVideoMostPopular
      } )
    }else if(num == 2){
      this.apollo.watchQuery( {
        query: gql`
          query getChannelVideoDate($channel_id: String!, $prem: String!, 
            $flag: String!){
            getChannelVideoDate(channel_id: $channel_id, prem: $prem, 
              flag: $flag){
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
          channel_id: this.channel.channel_id,
          prem: this.userLog.channel_premium,
          flag: "1"
        }
      } ).valueChanges.subscribe( r => {
        this.videos = r.data.getChannelVideoDate
      } )
    }else{
      this.apollo.watchQuery( {
        query: gql`
          query getChannelVideoDate($channel_id: String!, $prem: String!, 
            $flag: String!){
            getChannelVideoDate(channel_id: $channel_id, prem: $prem, 
              flag: $flag){
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
          channel_id: this.channel.channel_id,
          prem: this.userLog.channel_premium,
          flag: "2"
        }
      } ).valueChanges.subscribe( r => {
        this.videos = r.data.getChannelVideoDate
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

    // console.log(differences)

    if(differences == 0) return "today"
    else if(differences < 7) return differences + " day ago"
    else if(differences < 30) return Math.floor(differences/7) + " week ago"
    else if(differences < 365) return Math.floor(differences / 30) + " month ago"
    else return Math.floor(differences/365) + " year ago"
  }

  getPlaylist(){
    this.apollo.watchQuery( {
      query: gql`
        query getChannelPlaylist($channel_id: String!){
          getChannelPlaylist(channel_id: $channel_id){
            playlist_id,
            playlist_title,
            playlist_videos
          }
        }
      `,
      variables: {
        channel_id: this.channel.channel_id
      }
    } ).valueChanges.subscribe( r => {
      this.playlist = r.data.getChannelPlaylist

      // console.log(this.playlist)
      for(let i =0 ;i<this.playlist.length;i++){
        var temp = this.playlist[i].playlist_videos.split(",")
        
        this.videoCount[i] = temp.length-1

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
      }
    } )
  }

  getViewInFormat(number){
    var parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }

  thumbnail;

  chooseThumbnail(event: EventTarget){
    let eventObj: MSInputMethodContext = <MSInputMethodContext> event;
    let target: HTMLInputElement = <HTMLInputElement> eventObj.target;
    let files: FileList = target.files;
    this.thumbnail = files[0];

    var thumbnailImg = document.getElementById('thumbnailImg');
    thumbnailImg.src = URL.createObjectURL(this.thumbnail);
    thumbnailImg.onload = function(){
      URL.revokeObjectURL(thumbnailImg.src)
    }

  }

  closeEditModal(){
    
    var modal = document.getElementById('editModal');

    modal.style.display = "none";
  }

  openEditModal(){
    var modal = document.getElementById('editModal');

    modal.style.display = "flex";
  }


  getRVid(){
    if(this.isSame){
      this.apollo.watchQuery( {
        query: gql`
          query getChannelRandomVideo($channel_id: String!, $flag: String!){
            getChannelRandomVideo(channel_id: $channel_id, flag: $flag){
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
          channel_id: this.channel.channel_id,
          flag: "2"
        }
      } ).valueChanges.subscribe( r => {
        var vid;
        vid = r.data.getChannelRandomVideo

        this.vRandom = vid.slice(0,5);
        console.log(this.vRandom)
      } )
    }else{
      this.apollo.watchQuery( {
        query: gql`
          query getChannelRandomVideo($channel_id: String!, $flag: String!){
            getChannelRandomVideo(channel_id: $channel_id, flag: $flag){
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
          channel_id: this.channel.channel_id,
          flag: this.userLog.channel_premium
        }
      } ).valueChanges.subscribe( r => {
        var vid;
        vid = r.data.getChannelRandomVideo

        this.vRandom = vid.slice(0,5);
        console.log(this.vRandom)
      } )
    }
  }

  getRecentVid(){
    if(this.isSame){
      this.apollo.watchQuery( {
        query: gql`
          query getChannelVideoRecent($channel_id: String!, $flag: String!){
            getChannelVideoRecent(channel_id: $channel_id, flag: $flag){
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
          channel_id: this.channel.channel_id,
          flag: "2"
        }
      } ).valueChanges.subscribe( r => {
        var vid;
        vid = r.data.getChannelVideoRecent

        this.vRecent = vid.slice(0,5);
        console.log(this.vRecent)
      } )
    }else{
      this.apollo.watchQuery( {
        query: gql`
          query getChannelVideoRecent($channel_id: String!, $flag: String!){
            getChannelVideoRecent(channel_id: $channel_id, flag: $flag){
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
          channel_id: this.channel.channel_id,
          flag: this.userLog.channel_premium
        }
      } ).valueChanges.subscribe( r => {
        var vid;
        vid = r.data.getChannelVideoRecent

        this.vRecent = vid.slice(0,5);
        console.log(this.vRecent)
      } )
    }
  }

  getRPlaylist(){
    this.apollo.watchQuery( {
      query: gql`
        query getChannelRandomPlaylist($channel_id: String!){
          getChannelRandomPlaylist(channel_id: $channel_id){
            playlist_id,
            playlist_title,
            playlist_videos
          }
        }
      `,
      variables: {
        channel_id: this.channel.channel_id
      }
    } ).valueChanges.subscribe( r => {
      var p;
      p = r.data.getChannelRandomPlaylist

      this.pRandom = p.slice(0,3);
      

      for(let i =0 ;i<this.pRandom.length;i++){
        console.log(i)
        var temp = this.pRandom[i].playlist_videos.split(",")

        console.log(temp.length)

        this.videoCount[i] = temp.length-1

        if(temp.length == 1){
          this.playlistThumbnail[i] = "../../assets/no_image.png"
          continue;
        }
        
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
      }
    } )
    
  }


  getSubs(number): String{
    if(number<1000) return number;
    if(number<100000) return (number/1000).toFixed(1) + " k";
    if(number<1000000000) return (number/1000000).toFixed(1) + " m";
  }

  getVideo(){
    this.lastKey = 12;
    this.videos = [];
    this.observer = null;
    if(this.isSame){
      this.apollo.watchQuery( {
        query: gql`
          query getChannelVideo($channel_id: String!, $flag: String!){
            getChannelVideo(channel_id: $channel_id, flag: $flag){
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
          channel_id: this.channel.channel_id,
          flag: "2"
        }
      } ).valueChanges.subscribe( r => {
        this.videos = r.data.getChannelVideo

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
          query getChannelVideo($channel_id: String!, $flag: String!){
            getChannelVideo(channel_id: $channel_id, flag: $flag){
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
          channel_id: this.channel.channel_id,
          flag: this.userLog.channel_premium
        }
      } ).valueChanges.subscribe( r => {
        this.videos = r.data.getChannelVideo

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

  contentExpand(x: number){
    this.c = {}
    this.c[x] = true;

    if(x == 3){
      this.getPlaylist();
    }
    else if(x==2){
      this.getVideo();
    }else if(x==1){
      this.getRVid();
      this.getRecentVid();
      this.getRPlaylist();
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
          ch_subs: this.channel.channel_id
        },
        refetchQueries: [ {
          query: gql`
            query getChannelById($channel_id: String!){
              getChannelById(channel_id: $channel_id){
                channel_id,
                channel_name,
                channel_background,
                channel_icon,
                channel_subscribers,
                channel_description,
                channel_join_date_day,
                channel_join_date_month,
                channel_join_date_year,
                channel_premium
              }
            }
          `, 
          variables: { channel_id: this.id }
        } ]
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
          ch_subs: this.channel.channel_id
        },
        refetchQueries: [ {
          query: gql`
            query getChannelById($channel_id: String!){
              getChannelById(channel_id: $channel_id){
                channel_id,
                channel_name,
                channel_background,
                channel_icon,
                channel_subscribers,
                channel_description,
                channel_join_date_day,
                channel_join_date_month,
                channel_join_date_year,
                channel_premium
              }
            }
          `, 
          variables: { channel_id: this.id }
        } ]
      } ).subscribe( r => {
        console.log(r)

        this.isSubscribed = false;
      } )
    }
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

  // openModalPlaylist(video_id){
  //   var modal = document.getElementById('playlistModal');

  //   modal.style.display = "block";
  // }

  // closeModalPlaylist(){
  //   var modal = document.getElementById('playlistModal');

  //   modal.style.display = "none";
  // }

  // addToPlaylist(id){

  //   console.log(this.chosenVid, id);

  //   this.apollo.mutate( {
  //     mutation: gql`
  //       mutation addVideoToPlaylist($playlist_id: ID!, $video_id: ID!){
  //         addVideoToPlaylist(playlist_id: $playlist_id, video_id: $video_id)
  //       }
  //     `,variables:{
  //       video_id: this.chosenVid,
  //       playlist_id: id,
  //     }
  //   } ).subscribe( res => {
  //     console.log(res)
  //   } )


  // }

  // createPlaylist(){
  //   this.closeModalPlaylist();

  //   var modal = document.getElementById('addModal');

  //   modal.style.display = "block";

  // }

  // create(){
  //   var title = document.getElementById('pName').value;

  //   var date = new Date();

  //   var day = date.getDay();
  //   var month = date.getMonth()+1;
  //   var year = date.getFullYear();
    
  //   var v = "Public";
    
  //   console.log(title)

  //   this.user.getUser().subscribe( us => {
  //     console.log(us.id)
  //     this.apollo.mutate( {
  //       mutation: gql`
  //         mutation createPlaylist($ch_id: String!, 
  //           $title: String!, $day: Int!, $month: Int!, $year: Int!,
  //           $visibility: String!){
  //           createPlaylist( input : {
  //             channel_id: $ch_id
  //             playlist_title: $title
  //             playlist_day: $day
  //             playlist_visibility: $visibility
  //             playlist_month: $month
  //             playlist_year: $year
  //             playlist_views: 0
  //             playlist_videos: ""
  //             playlist_desc: ""
  //           }) { playlist_title }
  //         }
  //       `,
  //       variables: {
  //         ch_id: us.id,
  //         title: title,
  //         day: day,
  //         month: month,
  //         year: year,
  //         visibility: v
  //       }
  
  //     } ).subscribe( res => 
  //       console.log(res) )
  //   } )

  // }

  // close(){
    
  //   var modal = document.getElementById('addModal');

  //   modal.style.display = "none";
  // }

}
