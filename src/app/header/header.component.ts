import { Component, OnInit } from '@angular/core';
import { expand } from '../trending-page/trending-page.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor() { 
    console.log("test");
  }

  ngOnInit(): void {
  }

  isExpanded: string = 'sideBar';

  expandButton(){
    if(this.isExpanded == 'sideBar'){
      this.isExpanded = 'sideBarExpanded';
      expand(1);
    } 
    else{
      this.isExpanded = 'sideBar';
      expand(2);
    } 
    console.log(this.isExpanded);
  }

}
