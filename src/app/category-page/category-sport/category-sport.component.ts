import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-category-sport',
  templateUrl: './category-sport.component.html',
  styleUrls: ['./category-sport.component.scss']
})
export class CategorySportComponent implements OnInit {

  constructor(private apollo: Apollo) { }

  videos: any;

  ngOnInit(): void {
    this.apollo.watchQuery({
      query: gql`
        query getVideoByCategory($video_category: String!){
          getVideoByCategory(video_category: $video_category){
            video_title,
            video_thumbnail,
            channel_name,
            video_views,
            day,
            month,
            year,
          }
        }
      `,
      variables: { video_category: "Sport" }
    }).valueChanges.subscribe(result => {
      this.videos = result.data.getVideoByCategory
    });
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
