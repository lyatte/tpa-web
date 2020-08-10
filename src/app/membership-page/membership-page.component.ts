import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-membership-page',
  templateUrl: './membership-page.component.html',
  styleUrls: ['./membership-page.component.scss']
})
export class MembershipPageComponent implements OnInit {

  constructor(private apollo: Apollo, private user: HeroService ) { }

  isPremium = false;

  isGuest;

  isMonthly = false;

  isClicked;

  date;


  dateprev;

  actDate;

  plan;

  ngOnInit(): void {
    this.user.getUser().subscribe( us => {
      this.apollo.watchQuery( {
        query: gql`
          query getChannelById($channel_id: String!){
            getChannelById(channel_id: $channel_id){
              channel_premium,
              premium_day,
              premium_month,
              premium_year
            }
          }
        `,
        variables: {
          channel_id: us.id
        }
      } ).valueChanges.subscribe( r => {
        // console.log(r.data.getChannelById.channel_premium)

        var temp = r.data.getChannelById.channel_premium
        // if(r.data.getChannelById.channel_premium)

        if(temp != "1" && temp != "2"){
          this.isPremium = false;
        }else{
          this.isPremium = true;

          if(temp == 1){
            this.plan = "Monthly"
          }else this.plan = "Annually"
        }

        

        temp = r.data.getChannelById

        var date = new Date(temp.premium_year, temp.premium_month, temp.premium_day)

        console.log(date)

        this.actDate = date.toLocaleDateString()
      } )
    } )

  }

  openModal(num){
    var modal = document.getElementById('confirmModal');

    modal.style.display = "block";

    if(num == 1){
      this.isMonthly = true;
      this.calculateDate(new Date(),1)
    }else{
      this.isMonthly = false;
      this.calculateDate(new Date(),2)
    } 

  }

  calculateDate(date, flag){

    if(flag == 1){
      console.log(date.getMonth())
      date.setMonth(date.getMonth()+1)
      this.date = date
      this.dateprev = date.toLocaleDateString()
    }else{
      console.log(date.getMonth())
      date.setFullYear(date.getFullYear()+1)
      this.date = date
      this.dateprev = date.toLocaleDateString()
    }

    console.log(this.date.toLocaleDateString())



  }

  confirm(num){
    if(num==1){
      this.user.getUser().subscribe( us => {
        this.apollo.mutate( {
          mutation: gql`
            mutation updateAccountPremium($channel_id: String!, $premium_id: String!, 
              $day: Int!, $month: Int!, $year: Int!){
                updateAccountPremium(channel_id: $channel_id, premium_id: $premium_id,
                  day: $day, month: $month, year: $year)
              }
          `,
          variables: {
            channel_id: us.id,
            premium_id: "1",
            day: this.date.getDate(),
            month: this.date.getMonth(),
            year: this.date.getFullYear()
          }
        } ).subscribe( r => {
          console.log(r)

          location.reload()
        } )
      } )
    }else{
      this.user.getUser().subscribe( us => {
        this.apollo.mutate( {
          mutation: gql`
            mutation updateAccountPremium($channel_id: String!, $premium_id: String!, 
              $day: Int!, $month: Int!, $year: Int!){
                updateAccountPremium(channel_id: $channel_id, premium_id: $premium_id,
                  day: $day, month: $month, year: $year)
              }
          `,
          variables: {
            channel_id: us.id,
            premium_id: "2",
            day: this.date.getDate(),
            month: this.date.getMonth(),
            year: this.date.getFullYear()
          }
        } ).subscribe( r => {
          console.log(r)

          location.reload()
        } )
      } )
    }
  }

  close(){
    var modal = document.getElementById('confirmModal');

    modal.style.display = "none";
  }

  

}
