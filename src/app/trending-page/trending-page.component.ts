import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-trending-page',
  templateUrl: './trending-page.component.html',
  styleUrls: ['./trending-page.component.scss']
})
export class TrendingPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  
}
  
// declare global{
//   var flag: number;
// }

var flag = 1;

export function expand(expanded:number){
  console.log("masuk expand()");
  
  var container : HTMLElement = document.querySelector('#container');
  
  if(expanded == 1){
    flag=1;
  }else{
    flag=2;
  }
  
  if(flag == 1 && container != null){
    flag = 2;
    container.style.marginLeft = "15.6vw";
    container.style.width = "84.4%";
    
    console.log(container);

    container.style.backgroundColor = "red";
  }
  else if(flag == 2 && container != null){
    flag = 1;
    container.style.marginLeft = "4.7vw";
    container.style.width = "95.3%";
    
    console.log(container);

    container.style.backgroundColor = "blue";
  }

  // console.log(container.style.marginLeft);

}