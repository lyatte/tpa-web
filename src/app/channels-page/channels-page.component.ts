import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-channels-page',
  templateUrl: './channels-page.component.html',
  styleUrls: ['./channels-page.component.scss']
})
export class ChannelsPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  c: boolean = false;

  contentExpand(x: number){
    if(x==1){
      this.c=true;
      console.log("masuk");
    } 
    else this.c = false;


    console.log(this.c);
  }

  isSubscribed: boolean=false;

  subscribe(){
    if(this.isSubscribed) this.isSubscribed = false;
    else this.isSubscribed = true;
  }

}
