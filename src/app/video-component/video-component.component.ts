import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag'; 

import { HeroService } from '../hero.service'
import { ThrowStmt } from '@angular/compiler';
import { threadId } from 'worker_threads';

@Component({
  selector: 'app-video-component',
  templateUrl: './video-component.component.html',
  styleUrls: ['./video-component.component.scss']
})
export class VideoComponentComponent implements OnInit {

  constructor(private route: ActivatedRoute, private apollo: Apollo,
    private user: HeroService) { }

  video = {};

  videos = {};

  channel;

  videoId;

  channelId;

  userLog;

  userThumbnail;

  comment_count = 0;

  playlist = {};

  comment = [];

  cthumbnail = {};

  ccname = {};

  replyc = {};

  reply = {};

  isSubscribed = false;

  isNotSame = true;

  lastKey = 0;
  lastKey2 = 0;

  observer:any;

  isLoaded = false;

  videoDuration = {};

  premVids = {};

  isPremiumUser = false;

  isPremiumVid = false;

  show = true;


  ngOnInit(): void {

    this.lastKey = 18;
    this.lastKey2 = 7;
    
    this.videoId = +this.route.snapshot.paramMap.get('id');

    console.log(this.videoId)


    if(localStorage.getItem('user') == null) {
      this.isPremiumUser = false;
    }

    this.isPremiumUser = true;


    this.apollo.mutate({
      mutation: gql`
        mutation addVideoViews($id: ID!){
          addVideoViews(video_id: $id)
        }
      `,
      variables: { 
        id: this.videoId 
      }
    }).subscribe( res => {
      this.apollo.watchQuery({
        query: gql`
          query getVideoById($id: Int!){
            getVideoById(video_id: $id){
              video_id,
              video_title,
              video,
              video_thumbnail,
              video_description,
              video_views,
              video_like,
              video_dislike,
              channel_id,
              video_category,
              video_region,
              day,
              month,
              year,
              video_premium
            }
          }
        `, 
        variables: { id: this.videoId }
      }).valueChanges.subscribe(result => {
        this.video = result.data.getVideoById
        this.channelId = this.video.channel_id

        if(this.video.video_premium == "false"){
          this.isPremiumVid = false
        }else{
          this.isPremiumVid = true
        }

        this.hotkeys()

        this.apollo.watchQuery({
          query: gql`
            query getChannelById($id: String!){
              getChannelById(channel_id: $id){
                channel_name,
                channel_icon,
                channel_subscribers,
                channel_liked_video,
                channel_disliked_video,
                channel_premium,
                channel_id,
                channel_subscribe
              }
            }
          `, 
          variables: { id: this.channelId }
        }).valueChanges.subscribe( r => { 
          this.channel = r.data.getChannelById
        } )

        this.apollo.watchQuery({
          query: gql`
            query getVideosComment($id: ID!, $flag: String!){
              getVideosComment(video_id: $id, flag: $flag){
                comment_id,
                like,
                dislike,
                content,
                reply_count,
                day,
                month,
                year,
                channel_id
              }
            }
          `, 
          variables: { id: this.videoId, flag: "1" }
        }).valueChanges.subscribe( r => { 
          this.comment = r.data.getVideosComment

          this.comment_count = this.comment.length

          for(let i = 0; i<this.comment.length ;i++){
            this.apollo.watchQuery({
              query: gql`
                query getChannelById($id: String!){
                  getChannelById(channel_id: $id){
                    channel_id,
                    channel_name,
                    channel_icon,
                    channel_subscribers,
                    channel_liked_video,
                    channel_disliked_video,
                    channel_premium
                  }
                }
              `, 
              variables: { id: this.comment[i].channel_id }
            }).valueChanges.subscribe( r => {
              this.cthumbnail[i] = r.data.getChannelById.channel_icon
              // console.log(this.cthumbnail[i])
              this.ccname[i] = r.data.getChannelById.channel_name
              this.replyc[i] = false;

            })

            this.apollo.watchQuery({
              query: gql`
                query getCommentReply($id: ID!){
                  getCommentReply(comment_id: $id){
                    comment_id,
                    like,
                    dislike,
                    content,
                    reply_count,
                    day,
                    month,
                    year,
                    channel_id
                  }
                }
              `, 
              variables: { id: this.comment[i].comment_id }
            }).valueChanges.subscribe( r => {
              console.log(this.comment[i].comment_id)
              this.reply[this.comment[i].comment_id] = r.data.getCommentReply
              console.log(this.reply[this.comment[i].comment_id])

            })

            
          }

          

        } )

        if(localStorage.getItem('user') == null){


          if(this.isPremiumVid = true) this.show = false
          else this.show = true

          console.log("s")
    
          var loc = this.video.video_region
          var t = JSON.parse(localStorage.getItem('restrict'));


          var rest;
          if (t == "Off"){
            rest = "No"
          }else rest = "Yes"
            
          console.log(rest, loc, this.video.video_category)

          this.userThumbnail = "../../assets/user_logo.png";          


          this.apollo.watchQuery({
            query: gql`
            
              query getRelatedVideo($restriction: String!, $premium_id: String!,
                $location: String!, $category: String!){
                  getRelatedVideo(restriction: $restriction, premium_id: $premium_id, 
                    location: $location, category: $category){
                    video_id,
                    video_title,
                    video,
                    video_thumbnail,
                    video_description,
                    video_views,
                    channel_name,
                    channel_id,
                    day,
                    month,
                    year
                  }
                }
            
            `,
            variables: {
              restriction: rest,
              premium_id: "",
              location: loc,
              category: this.video.video_category
            }
            ,
          }).valueChanges.subscribe(result => {
            this.videos = result.data.getRelatedVideo

            console.log(this.videos.length)

            this.isLoaded = true;

            this.observer = new IntersectionObserver((entry) => {
              if(entry[0].isIntersecting){
                console.log("t")
                let card = document.querySelector(".relatedVideo");
                for(let i = 0; i<5; i++){
                  if(this.lastKey < this.videos.length){
                    let div = document.createElement("div")
                    let video = document.createElement("div")
                    div.appendChild(video)
                    card.appendChild(div)
                    this.lastKey++;
                  }
                }

                let com = document.querySelector(".c-section");
                for(let i = 0; i<5; i++){
                  if(this.lastKey2 < this.comment.length){
                    let div = document.createElement("div")
                    let c = document.createElement("div")
                    div.appendChild(c)
                    com.appendChild(div)
                    this.lastKey2++;
                  }
                }
              }
            }
            )
        
            this.observer.observe(document.querySelector(".bottom"))

            
          });
        }

        else{
          this.user.getUser().subscribe( r => {

            console.log(r)
    
            this.userThumbnail = r.photoUrl
    
            console.log("asd", this.userThumbnail)
    
              this.apollo.watchQuery({
                query: gql`
                  query getChannelById($id: String!){
                    getChannelById(channel_id: $id){
                      channel_id,
                      channel_name,
                      channel_icon,
                      channel_subscribers,
                      channel_liked_video,
                      channel_disliked_video,
                      channel_premium,
                      channel_subscribe
                    }
                  }
                `, 
                variables: { id: r.id }
              }).valueChanges.subscribe( r => {
      
                this.userLog = r.data.getChannelById

                console.log(this.userLog.channel_premium)

                if(this.userLog.channel_premium == "1" || this.userLog.channel_premium == "2"){
                  this.isPremiumUser = true;
                }else{
                  this.isPremiumUser = false
                }

                if(this.isPremiumUser){
                  this.show = true
                }else{
                  if(this.isPremiumVid = false) this.show = true
                  else this.show = false
                }

                if(this.userLog.channel_id == this.channelId){
                  this.isNotSame = false;
                }

                var temp = this.userLog.channel_subscribe.split(",")

                for(let i=0;i<temp.length;i++){
                  if(temp[i] == this.channelId){
                    this.isSubscribed = true;
                  }
                  console.log(temp[i])
                }
      
                console.log(r.data.getChannelById)

                var like = this.userLog.channel_liked_video.split(',');
        
                var dislike = this.userLog.channel_disliked_video.split(',');
          
                console.log(like)
          
                for(let i=0;i<like.length;i++){
                  if(like[i] == this.videoId){
          
                    document.getElementById('likeButton').style.color = "rgb(0,191,255)"
                    document.getElementById('likeImg').src = "../../assets/liked_icon.png"
                  }
          
                }
          
                console.log(dislike)
                
                for(let i=0;i<dislike.length;i++){
                  if(dislike[i] == this.videoId){
          
                    document.getElementById('dislikeButton').style.color = "rgb(0,191,255)"
                    document.getElementById('dislikeImg').src = "../../assets/disliked_icon.png"
                  }
                }
      
                var loc = this.video.video_region;
                var t = JSON.parse(localStorage.getItem('restrict'));

                var rest;
                if (t == "Off"){
                  rest = "No"
                }else rest = "Yes"
                
                console.log(rest, this.userLog.channel_premium, loc, this.video.video_category)
      
                this.apollo.watchQuery({
                  query: gql`
                  
                    query getRelatedVideo($restriction: String!, $premium_id: String!,
                      $location: String!, $category: String!){
                        getRelatedVideo(restriction: $restriction, premium_id: $premium_id, 
                          location: $location, category: $category){
                          video_id,
                          video_title,
                          video,
                          video_thumbnail,
                          video_description,
                          video_views,
                          channel_name,
                          channel_id,
                          day,
                          month,
                          year,
                          video_premium
                        }
                      }
                  
                  `,
                  variables: {
                    restriction: rest,
                    premium_id: this.userLog.channel_premium,
                    location: loc,
                    category: this.video.video_category
                  }
                  ,
                }).valueChanges.subscribe(result => {
                  this.videos = result.data.getRelatedVideo

                  this.isLoaded = true;

                  console.log(this.videos.length)

                  for(let i = 0;i<this.videos.length;i++){
                    if(this.videos[i].video_premium == "true"){
                      console.log("true");
                      this.premVids[i] = true;
                    }
                  }

                  this.observer = new IntersectionObserver((entry) => {
                    if(entry[0].isIntersecting){
                      console.log("t")
                      let card = document.querySelector(".relatedVideo");
                      for(let i = 0; i<5; i++){
                        if(this.lastKey < this.videos.length){
                          let div = document.createElement("div")
                          let video = document.createElement("div")
                          div.appendChild(video)
                          card.appendChild(div)
                          this.lastKey++;
                        }
                      }

                      let com = document.querySelector(".c-section");
                      for(let i = 0; i<5; i++){
                        if(this.lastKey2 < this.comment.length){
                          let div = document.createElement("div")
                          let c = document.createElement("div")
                          div.appendChild(c)
                          com.appendChild(div)
                          this.lastKey2++;
                        }
                      }
                    }
                  }
                  )
              
                  this.observer.observe(document.querySelector(".bottom"))
                });
              })
              
            
    
              
            
          })
        }


      
      })
    })

    


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

  setreplyc(num){
    this.replyc[num] = true
  }

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
          ch_subs: this.channelId
        },
        refetchQueries: [ {
          query: gql`
            query getChannelById($id: String!){
              getChannelById(channel_id: $id){
                channel_name,
                channel_icon,
                channel_subscribers,
                channel_liked_video,
                channel_disliked_video,
                channel_premium,
                channel_id,
                channel_subscribe
              }
            }
          `, 
          variables: { id: this.channelId }
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
          ch_subs: this.channelId
        },
        refetchQueries: [ {
          query: gql`
            query getChannelById($id: String!){
              getChannelById(channel_id: $id){
                channel_name,
                channel_icon,
                channel_subscribers,
                channel_liked_video,
                channel_disliked_video,
                channel_premium,
                channel_id,
                channel_subscribe
              }
            }
          `, 
          variables: { id: this.channelId }
        } ]
      } ).subscribe( r => {
        console.log(r)

        this.isSubscribed = false;
      } )
    }
  }

  replying(id, idx){
    var con = document.getElementById('replyBox').value;

    var date = new Date();

    var day = date.getDate();
    var month = date.getMonth()+1;
    var year = date.getFullYear();
    

    console.log(this.reply[id])

    console.log(id, con, this.videoId, 
      day, month, year)
      
      this.apollo.mutate( {
        mutation: gql`
          mutation createComment($channel_id: String!, $like: Int!, 
            $dislike: Int!, $reply_to: Int!, $content: String!, 
            $reply_count: Int!, $video_id: Int!, $post_id: Int!, 
            $day: Int!, $month: Int!, $year: Int!){
            createComment( input: {
              channel_id: $channel_id, 
              like: $like, 
              dislike: $dislike, 
              reply_to: $reply_to, 
              content: $content, 
              reply_count: $reply_count, 
              video_id: $video_id, 
              post_id: $post_id, 
              day: $day, 
              month: $month, 
              year: $year
            }){
                comment_id
            }
          }
        `,
        variables: {
          channel_id: this.userLog.channel_id,
          like: 0,
          dislike: 0,
          reply_to: id,
          content: con,
          reply_count: 0,
          video_id: 0,
          post_id: 0,
          day: day,
          month: month,
          year: year
        }
      } ).subscribe( res => {
        console.log(res)
        console.log(this.reply[id])
        document.getElementById('replyBox').value = "";
      } )
  }

  commenting(num){

    var con = document.getElementById('commentBox').value;

    var date = new Date();

    var day = date.getDate();
    var month = date.getMonth()+1;
    var year = date.getFullYear();

    console.log(this.userLog.channel_id, con, this.videoId, 
      day, month, year)
      
      this.apollo.mutate( {
        mutation: gql`
          mutation createComment($channel_id: String!, $like: Int!, 
            $dislike: Int!, $reply_to: Int!, $content: String!, 
            $reply_count: Int!, $video_id: Int!, $post_id: Int!, 
            $day: Int!, $month: Int!, $year: Int!){
            createComment( input: {
              channel_id: $channel_id, 
              like: $like, 
              dislike: $dislike, 
              reply_to: $reply_to, 
              content: $content, 
              reply_count: $reply_count, 
              video_id: $video_id, 
              post_id: $post_id, 
              day: $day, 
              month: $month, 
              year: $year
            }){
                comment_id
            }
          }
        `,
        variables: {
          channel_id: this.userLog.channel_id,
          like: 0,
          dislike: 0,
          reply_to: 0,
          content: con,
          reply_count: 0,
          video_id: this.videoId,
          post_id: 0,
          day: day,
          month: month,
          year: year
        },
        refetchQueries: [ {
          query: gql`
          query getVideosComment($id: ID!, $flag: String!){
            getVideosComment(video_id: $id, flag: $flag){
              comment_id,
              like,
              dislike,
              content,
              reply_count,
              day,
              month,
              year,
              channel_id
            }
          }
        `, 
        variables: { id: this.videoId, flag: "1" }
        } ]
      } ).subscribe( res => {
        console.log(res)
        document.getElementById('commentBox').value = "";
      } )
  }

  likeVideo(){
    this.user.getUser().subscribe( res => {

      this.apollo.mutate({
        mutation: gql`
          mutation addVideoLike($id: ID!, $channel_id: String!){
            addVideoLike(video_id: $id, channel_id: $channel_id)
          }
        `,
        variables: { 
          id: this.videoId,
          channel_id : res.id
        },
        refetchQueries: [ {
          query: gql`
            query getVideoById($id: Int!){
              getVideoById(video_id: $id){
                video_id,
                video_title,
                video,
                video_thumbnail,
                video_description,
                video_views,
                video_like,
                video_dislike,
                channel_id,
                video_category,
                video_region,
                day,
                month,
                year,
              }
            }
        `, 
        variables: { id: this.videoId }
      } ]
      
      }).subscribe( res => { 
        document.getElementById('likeButton').style.color = "rgb(0,191,255)"
        document.getElementById('likeImg').src = "../../assets/liked_icon.png"
        
      })

    })


  }


  dislikeVideo(){
    this.user.getUser().subscribe( res => {

      this.apollo.mutate({
        mutation: gql`
          mutation addVideoDislike($id: ID!, $channel_id: String!){
            addVideoDislike(video_id: $id, channel_id: $channel_id)
          }
        `,
        variables: { 
          id: this.videoId,
          channel_id : res.id
        },
        refetchQueries: [ {
          query: gql`
            query getVideoById($id: Int!){
              getVideoById(video_id: $id){
                video_id,
                video_title,
                video,
                video_thumbnail,
                video_description,
                video_views,
                video_like,
                video_dislike,
                channel_id,
                video_category,
                video_region,
                day,
                month,
                year,
              }
            }
        `, 
        variables: { id: this.videoId }
        } ]
      }).subscribe( res => { 
        document.getElementById('dislikeButton').style.color = "rgb(0,191,255)"
        document.getElementById('dislikeImg').src = "../../assets/disliked_icon.png"
      })

    })
  }

  close(){
    
    var modal = document.getElementById('addModal');

    modal.style.display = "none";
  }

  likeDislike(num, comid){
    console.log(comid)
    console.log(this.userLog.channel_id, num)
    this.apollo.mutate( {
      mutation: gql`
        mutation updateCommentDL($comment_id: ID!, $channel_id: String!,
          $flag: Int!){
            updateCommentDL(comment_id: $comment_id, channel_id: $channel_id,
              flag: $flag)
          }
      `,
      variables: {
        comment_id: comid,
        channel_id: this.userLog.channel_id,
        flag: num
      },
      refetchQueries: [ {
        query: gql`
          query getVideosComment($id: ID!, $flag: String!){
            getVideosComment(video_id: $id, flag: $flag){
              comment_id,
              like,
              dislike,
              content,
              reply_count,
              day,
              month,
              year,
              channel_id
            }
          }
        `, 
        variables: { id: this.videoId, flag: "1" }
      } ]

    } ).subscribe( r => {
      console.log(r)
    } )
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

  hotkeys(){
    var vid = (document.getElementsByTagName('mat-video')[0] as HTMLVideoElement).querySelector('video');
    var audio = vid;
    
    document.onkeydown = function(event) {
      switch (event.keyCode) {

        case 38:
          event.preventDefault();
          var audio_volume = (audio).volume;

          if (audio_volume != 1) {
            try {
                var x = audio_volume + 0.02;
                audio.volume = x;

              }
            catch(err) {
                audio.volume = 1;
            }
          } 

        break;

        case 40:
          event.preventDefault();
          audio_volume = audio.volume;

          if (audio_volume != 0) {
            try {
              var x = audio_volume - 0.02;
              audio.volume = x;

            }
            catch(err) {
                audio.volume = 0;
            }
          }

        break;

        case 74:
          event.preventDefault();
          audio.currentTime -= 10;
        break;

        case 76:
          event.preventDefault();
          audio.currentTime += 10;
        break;

        case 75:
          event.preventDefault();
          vid.paused ? vid.play() : vid.pause()
      }
    }
  }
  
  openModalPlaylist(v_id){
    this.chosenVid = v_id;
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
        id: this.userLog.channel_id
      }
    } ).valueChanges.subscribe( r => {
      this.playlist = r.data.getChannelPlaylist
      var modal = document.getElementById('playlistModal');
  
      modal.style.display = "block";

    } )
    
  }

  closeModalPlaylist(){
    var modal = document.getElementById('playlistModal');

    modal.style.display = "none";
  }

  chosenVid;

  addToPlaylist(id){

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
      this.closeModalPlaylist();
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
          id: this.userLog.channel_id
        }
        }
       ],
  
      } ).subscribe( res => {
        console.log(res) 

        this.close();
      })

        
    } 
    )

  }


  filter(num){

    this.comment= {};
    this.reply = {};

    if(num == 1){
      this.apollo.watchQuery({
        query: gql`
          query getVideosComment($id: ID!, $flag: String!){
            getVideosComment(video_id: $id, flag: $flag){
              comment_id,
              like,
              dislike,
              content,
              reply_count,
              day,
              month,
              year,
              channel_id
            }
          }
        `, 
        variables: { id: this.videoId, flag: "1" }
      }).valueChanges.subscribe( r => { 
        this.comment = r.data.getVideosComment

        this.comment_count = this.comment.length

        for(let i = 0; i<this.comment.length ;i++){
          this.apollo.watchQuery({
            query: gql`
              query getChannelById($id: String!){
                getChannelById(channel_id: $id){
                  channel_id,
                  channel_name,
                  channel_icon,
                  channel_subscribers,
                  channel_liked_video,
                  channel_disliked_video,
                  channel_premium
                }
              }
            `, 
            variables: { id: this.comment[i].channel_id }
          }).valueChanges.subscribe( r => {
            this.cthumbnail[i] = r.data.getChannelById.channel_icon
            // console.log(this.cthumbnail[i])
            this.ccname[i] = r.data.getChannelById.channel_name
            this.replyc[i] = false;

          })

          this.apollo.watchQuery({
            query: gql`
              query getCommentReply($id: ID!){
                getCommentReply(comment_id: $id){
                  comment_id,
                  like,
                  dislike,
                  content,
                  reply_count,
                  day,
                  month,
                  year,
                  channel_id
                }
              }
            `, 
            variables: { id: this.comment[i].comment_id }
          }).valueChanges.subscribe( r => {
            console.log(this.comment[i].comment_id)
            this.reply[this.comment[i].comment_id] = r.data.getCommentReply
            console.log(this.reply[this.comment[i].comment_id])

          })

        }

      } )
    }else{
      this.apollo.watchQuery({
        query: gql`
          query getVideosComment($id: ID!, $flag: String!){
            getVideosComment(video_id: $id, flag: $flag){
              comment_id,
              like,
              dislike,
              content,
              reply_count,
              day,
              month,
              year,
              channel_id
            }
          }
        `, 
        variables: { id: this.videoId, flag: "2" }
      }).valueChanges.subscribe( r => { 
        this.comment = r.data.getVideosComment

        this.comment_count = this.comment.length

        for(let i = 0; i<this.comment.length ;i++){
          this.apollo.watchQuery({
            query: gql`
              query getChannelById($id: String!){
                getChannelById(channel_id: $id){
                  channel_id,
                  channel_name,
                  channel_icon,
                  channel_subscribers,
                  channel_liked_video,
                  channel_disliked_video,
                  channel_premium
                }
              }
            `, 
            variables: { id: this.comment[i].channel_id }
          }).valueChanges.subscribe( r => {
            this.cthumbnail[i] = r.data.getChannelById.channel_icon
            // console.log(this.cthumbnail[i])
            this.ccname[i] = r.data.getChannelById.channel_name
            this.replyc[i] = false;

          })

          this.apollo.watchQuery({
            query: gql`
              query getCommentReply($id: ID!){
                getCommentReply(comment_id: $id){
                  comment_id,
                  like,
                  dislike,
                  content,
                  reply_count,
                  day,
                  month,
                  year,
                  channel_id
                }
              }
            `, 
            variables: { id: this.comment[i].comment_id }
          }).valueChanges.subscribe( r => {
            console.log(this.comment[i].comment_id)
            this.reply[this.comment[i].comment_id] = r.data.getCommentReply
            console.log(this.reply[this.comment[i].comment_id])

          })

          
        }

        

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

  getViews(number): String{
    if(number<1000) return number;
    if(number<1000000) return (number/1000).toFixed(1) + " k";
    if(number<1000000000) return (number/1000000).toFixed(1) + " m";
  }

  getLike(number): String{
    if(number<1000) return number;
    if(number<1000000) return (number/1000).toFixed(0) + " K";
    if(number<1000000000) return (number/1000000).toFixed(0) + " M";
  }

  getViewInFormat(number){
    if (number < 1000){
      return number
    }
    var parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }

}
