import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { HeroService } from 'src/app/hero.service';
import { CategoryVidsService } from 'src/app/category-vids.service';

@Component({
  selector: 'app-category-sport',
  templateUrl: './category-sport.component.html',
  styleUrls: ['./category-sport.component.scss']
})
export class CategorySportComponent implements OnInit {

  constructor(private apollo: Apollo, private vids: CategoryVidsService, 
    private user: HeroService) { }

  videos1: any;
  videos2: any;
  videos3: any;
  videos4: any;
  
  ngOnInit(): void {
    var temp = JSON.parse(localStorage.getItem('restrict'))

    var rest;

    if (temp == "Off"){
      rest = "No"
    }else {
      rest = "Yes"
    }
    this.user.getUser().subscribe( us => {
      console.log(us)
      console.log(rest)

      this.apollo.watchQuery( {
        query: gql`
          query getChannelById($id: String!){
            getChannelById(channel_id: $id){
              channel_premium
            }
          }
        `,variables: {
          id: us.id
        }
      } ).valueChanges.subscribe( user => {
        console.log(user.data.getChannelById.channel_premium)

        this.vids.getAllTimePopular(rest, user.data.getChannelById.channel_premium, "Sport").subscribe( r => {
          console.log(r)
          this.videos1 = r;
        } )
    
        this.vids.getVideoWeek(rest, user.data.getChannelById.channel_premium, "Sport").subscribe( r => {
          console.log(r)
          this.videos2 = r;
        } )
    
        this.vids.getVideoMonth(rest, user.data.getChannelById.channel_premium, "Sport").subscribe( r => {
          console.log(r)
          this.videos3 = r;
        } )

        this.vids.getVideoRecent(rest, user.data.getChannelById.channel_premium, "Sport").subscribe( r => {
          console.log(r)
          this.videos4 = r;
        } )

      } )


    } )

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
