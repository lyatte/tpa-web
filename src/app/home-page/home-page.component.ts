import { Component, OnInit } from '@angular/core';
import { expanded } from '../header/header.component';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';
import { rejects } from 'assert';
import { INT_TYPE } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  constructor(private apollo: Apollo) { }

  isExpanded: string;

  videos: any;

  videoDuration;

  ngOnInit(): void {

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
      this.videos = result.data.getVideo

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
