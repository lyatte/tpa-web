import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-playlist-page',
  templateUrl: './playlist-page.component.html',
  styleUrls: ['./playlist-page.component.scss']
})
export class PlaylistPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  isSubscribed: boolean=false;

  subscribe(){
    if(this.isSubscribed) this.isSubscribed = false;
    else this.isSubscribed = true;
  }

}
