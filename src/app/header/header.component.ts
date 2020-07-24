import { Component, OnInit } from '@angular/core';
import { expand } from '../trending-page/trending-page.component';

import { SocialAuthService } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

import { HeroService } from '../hero.service';
import { Subscription } from 'rxjs';

@Component({
  moduleId: module.id,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {

  show: boolean;

  loggedIn: boolean;

  photoUrl;

  dummy;

  subscription: Subscription;

  constructor(private authService: SocialAuthService, 
    private router: Router,
    private apollo: Apollo,
    private user: HeroService) { 
    console.log("test");
    this.show = false;
    expanded = 'sideBar';
    this.isExpanded = expanded;
  }

  ngOnInit(): void {
    this.show = false;
    expanded = 'sideBar';

    if(localStorage.getItem('user') == null){
      this.user.setUser(null);
    }
    else{
      this.getUser();
    }
  }

  getUser(){
    this.dummy = JSON.parse(localStorage.getItem('user'));
    this.user.setUser(this.dummy);

    this.user.getUser().subscribe( asd => 
      console.log(asd))


    this.photoUrl = this.dummy.photoUrl;
    

    this.loggedIn = true;
  }

  signIn(): void {
    
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);

    this.authService.authState.subscribe((res) => {
      this.loggedIn = true;

      this.photoUrl = res.photoUrl;
      
      this.user.setUser(res);

      this.loggedIn = (res != null);

      localStorage.setItem('user', JSON.stringify(res));


      var date = new Date();

      var day = date.getDate();
      var month = date.getMonth()+1;
      var year = date.getFullYear();

      console.log(day, month, year);

      this.user.getUser().subscribe( data => {
        console.log("asdasdads");
        console.log(data.id);
        this.apollo.mutate({
          mutation: gql`
            mutation createChannel($channel_id: String!, $channel_name: String!,
              $channel_icon: String!, $channel_join_date_day: Int!, 
              $channel_join_date_month: Int!, $channel_join_date_year: Int!){
                createChannel(channel_id: $channel_id,input:{
                  channel_id: $channel_id
                  channel_name: $channel_name
                  channel_background: "https://firebasestorage.googleapis.com/v0/b/y-jube.appspot.com/o/null.jpg?alt=media&token=91c13f5d-4a43-4d17-a6fe-0c334d7b0982"
                  channel_icon: $channel_icon
                  channel_subscribers: 0
                  channel_description: ""
                  channel_join_date_day: $channel_join_date_day
                  channel_join_date_month: $channel_join_date_month
                  channel_join_date_year: $channel_join_date_year
                  channel_liked_video: ""
                  channel_disliked_video: ""
                  channel_liked_post: ""
                  channel_disliked_post: ""
                  channel_liked_comment: ""
                  channel_disliked_comment: ""
                  channel_premium: "None"
                }){ channel_name }
            }
          `,
          variables: {
            channel_id: data.id,
            channel_name: data.name,
            channel_icon: data.photoUrl,
            channel_join_date_day: day,
            channel_join_date_month: month,
            channel_join_date_year: year
          }
        }).subscribe(({ data }) => {
          console.log("data : ", data);
        })
        // window.location.reload();
      })


      
    });


    
  }

  signOut(): void {
    this.authService.signOut(true);
    sessionStorage.clear()
    this.loggedIn = false;

    this.user.clearUser();

    window.localStorage.clear();
    window.location.reload();
  
  }



  isExpanded: string = expanded;

  expandButton(){
    if(this.isExpanded == 'sideBar'){
      this.isExpanded = 'sideBarExpanded';
      this.show = true;
      expand(1);
    } 
    else{
      this.isExpanded = 'sideBar';
      this.show=false;
      expand(2);
    } 
  }

  openCategoryPage(num: number){
    if(num == 1) this.router.navigate(['/category/music']);
    else if (num == 2) this.router.navigate(['/category/game']);
    else if (num == 3) this.router.navigate(['/category/news']);
    else if (num == 4) this.router.navigate(['/category/sport']);
    else if (num == 5) this.router.navigate(['/category/entertainment']);
    else this.router.navigate(['/category/travel']);
  }

}

export var expanded: string;
