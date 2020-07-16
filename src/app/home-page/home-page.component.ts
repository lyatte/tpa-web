import { Component, OnInit } from '@angular/core';
import { expanded } from '../header/header.component'

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  constructor() { }

  isExpanded: string;

  ngOnInit(): void {
    var container : HTMLElement = document.querySelector('#container');

    this.isExpanded = expanded;

    console.log(expanded);
    
    if(this.isExpanded == 'sideBarExpanded') {
      container.style.marginLeft = "15.6vw";
      container.style.width = "84.4%";
    }else{
      container.style.marginLeft = "4.7vw";
      container.style.width = "95.3%";
    }

    console.log(container.style.width);
  }

}
