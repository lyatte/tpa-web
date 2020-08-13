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

  playlists;

  subscription: Subscription;

  isClicked: boolean;

  location = "Indonesia";

  restrict = "Off";

  isDefault = true;

  isRestrict = false;

  isExpand= false;
  
  temp;

  closed;

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

    this.isClicked = false;
    console.log(this.isClicked)

    var temp = JSON.parse(localStorage.getItem('restrict'));

    if(temp == "On"){
      this.restrict = "On"
      this.isRestrict = true;
    }else{
      this.restrict = "Off"
      this.isRestrict = false;

      localStorage.setItem('restrict', JSON.stringify("Off"))
    }

    temp = JSON.parse(localStorage.getItem('location'));

    if(temp == null){
      this.location = "Indonesia"
      localStorage.setItem('location', JSON.stringify("Indonesia"))
    }else
      this.location = temp;
  }

  expand(){
    this.isExpand = !this.isExpand
    if(this.isExpand == true){
      this.playlists = this.temp
    }else{
      this.playlists = this.closed
    }
  }

  getUser(){
    this.dummy = JSON.parse(localStorage.getItem('user'));
    this.user.setUser(this.dummy);

    this.user.getUser().subscribe( us => {
      console.log(us.id)

      this.apollo.watchQuery({
        query: gql`
          query getChannelPlaylist($id: String!){
            getChannelPlaylist(channel_id: $id){
              playlist_title,
              playlist_id
            }
          }
        `,
        variables: {
          id: us.id
        }
      }).valueChanges.subscribe( res => {
        this.temp = res.data.getChannelPlaylist

        this.closed = this.temp.slice(0,5)
        this.playlists = this.closed

        console.log(this.playlists)
      } )

    })


    this.photoUrl = this.dummy.photoUrl;
    

    this.loggedIn = true;
    
  }

  search(){
    var keyword = document.getElementById('searchBar').value

    this.router.navigate(['/search/', keyword]).then( nav => {
      console.log(nav)
    } )
  }

  settingToggle(){
    if(this.isClicked) this.isClicked = false;
    else this.isClicked = true;

    this.isDefault = true;

    this.flag=0;
  }

  flag;

  choose(num){
    this.isDefault = !this.isDefault

    if(num==0) this.flag=0;

    else if(num==1){
      this.flag=1;
    }else if(num==2){
      this.flag=2;
    }
    else{
      this.flag=3;
    }
  }

  setLocation(num){
    if(num == 1) {
      localStorage.setItem('location', JSON.stringify("Indonesia"))
    }else if(num==2){
      localStorage.setItem('location', JSON.stringify("Japan"))
    }else{
      localStorage.setItem('location', JSON.stringify("Korea"))
    }

    window.location.reload();
  }

  res(){
    console.log("satuu")
    if(this.restrict == "On"){
      this.restrict = "Off"
    }else{
      this.restrict = "On"
    }
    
    let self=this;

    async function getRData(){
      try{
        await localStorage.setItem('restrict', JSON.stringify(self.restrict));
        
        window.location.reload();
        return;
      }catch (error){
        console.log(error)
        console.log("error");
      }
    }

    getRData();

    console.log(this.restrict)

  }

  signIn(): void{
    var modal = document.getElementById('loginModal');

    modal.style.display = "block";
  }

  closeLoginModal(){
    var modal = document.getElementById('loginModal');

    modal.style.display = "none";
  }

  signInWithGoogle(): void {
    
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
        

      })


      this.closeLoginModal();

      window.location.reload();

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
