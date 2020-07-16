import { Component, OnInit } from '@angular/core';
import { expand } from '../trending-page/trending-page.component';

import { SocialAuthService } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {

  show: boolean;

  user: SocialUser;
  loggedIn: boolean;

  constructor(private authService: SocialAuthService, private router: Router) { 
    console.log("test");
    this.show = false;
    expanded = 'sideBar';
    console.log(expanded);
    this.isExpanded = expanded;
  }

  ngOnInit(): void {
    this.show = false;
    expanded = 'sideBar';

    if(localStorage.getItem('user') == null){
      this.user = null;
    }
    else{
      this.getUser();
    }
  }

  getUser(){
    this.user = JSON.parse(localStorage.getItem('user'));
    this.loggedIn = true;
    console.log(this.user);
  }

  signIn(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    
    this.authService.authState.subscribe((user) => {
      this.loggedIn = true;
      this.user = user;
      this.loggedIn = (user != null);

      localStorage.setItem('user', JSON.stringify(user));
    });



    
  }

  signOut(): void {
    this.authService.signOut(true);
    sessionStorage.clear()
    this.loggedIn = false;

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
    console.log(this.isExpanded);
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
