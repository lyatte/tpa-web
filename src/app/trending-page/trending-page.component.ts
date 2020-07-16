import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-trending-page',
  templateUrl: './trending-page.component.html',
  styleUrls: ['./trending-page.component.scss']
})
export class TrendingPageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
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
var flag = 1;

export function expand(expanded:number){
  
  var container : HTMLElement = document.querySelector('#container');
  
  console.log("here");

  if(expanded == 1){
    flag=1;
  }else{
    flag=2;
  }

  console.log(container);
  
  if(flag == 1 && container != null){
    flag = 2;
    container.style.marginLeft = "15.6vw";
    container.style.width = "84.4%";
    
    console.log("ASd");

  }
  else if(flag == 2 && container != null){
    flag = 1;
    container.style.marginLeft = "4.7vw";
    container.style.width = "95.3%";
    
    console.log("wewe");

  }

  
  console.log(container.style.width);
  console.log("hem");

}