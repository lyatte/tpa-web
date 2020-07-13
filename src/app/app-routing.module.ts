import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TrendingPageComponent } from './trending-page/trending-page.component';
import { HomePageComponent } from './home-page/home-page.component';


const routes: Routes = [
  { path: 'home', component: HomePageComponent},
  { path: 'trending', component: TrendingPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
export const routingComponents = [TrendingPageComponent, HomePageComponent]