import { Component, OnInit } from '@angular/core';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-subscriptions-page',
  templateUrl: './subscriptions-page.component.html',
  styleUrls: ['./subscriptions-page.component.scss']
})
export class SubscriptionsPageComponent implements OnInit {

  user;

  isGuest = true;
  
  constructor(private data: HeroService) { }

  ngOnInit(): void {
    this.data.getUser().subscribe( res => 
    this.user = res  );

    if(this.user == null){
      this.isGuest = true;
    }else{
      this.isGuest = false;
    }
  }

}
