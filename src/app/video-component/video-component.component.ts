import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag'; 

import { HeroService } from '../hero.service'

@Component({
  selector: 'app-video-component',
  templateUrl: './video-component.component.html',
  styleUrls: ['./video-component.component.scss']
})
export class VideoComponentComponent implements OnInit {

  constructor(private route: ActivatedRoute, private apollo: Apollo,
    private user: HeroService) { }

  video;

  videos;

  channel;

  videoId;

  channelId;

  userLog;

  userThumbnail;

  comment_count;


  ngOnInit(): void {
    
    this.videoId = +this.route.snapshot.paramMap.get('id');

    console.log(this.videoId)


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
            }
          }
        `, 
        variables: { id: this.videoId }
      }).valueChanges.subscribe(result => {
        this.video = result.data.getVideoById
        this.channelId = this.video.channel_id

        this.apollo.watchQuery({
          query: gql`
            query getChannelById($id: String!){
              getChannelById(channel_id: $id){
                channel_name,
                channel_icon,
                channel_subscribers,
                channel_liked_video,
                channel_disliked_video,
                channel_premium
              }
            }
          `, 
          variables: { id: this.channelId }
        }).valueChanges.subscribe( r => { 
          this.channel = r.data.getChannelById

        } )

        if(localStorage.getItem('user') == null){
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
                      channel_name,
                      channel_icon,
                      channel_subscribers,
                      channel_liked_video,
                      channel_disliked_video,
                      channel_premium
                    }
                  }
                `, 
                variables: { id: r.id }
              }).valueChanges.subscribe( r => {
      
                this.userLog = r.data.getChannelById
      
                console.log(r.data.getChannelById)
      
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
                          year
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
                });
              })
              
            
    
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
            
          })
        }


      
      })
    })

    


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
        }
      }).subscribe( res => { 
        // console.log("asd");
        
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
        }
      }).subscribe( res => { 
        // console.log("asd");
      })

    })
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
    var parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }

}
