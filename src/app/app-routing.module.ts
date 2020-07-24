import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TrendingPageComponent } from './trending-page/trending-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { VideoComponentComponent } from './video-component/video-component.component';
import { SubscriptionsPageComponent } from './subscriptions-page/subscriptions-page.component';
import { MembershipPageComponent } from './membership-page/membership-page.component';
import { ChannelsPageComponent } from './channels-page/channels-page.component';
import { CategoryGameComponent } from './category-page/category-game/category-game.component';
import { CategoryMusicComponent } from './category-page/category-music/category-music.component';
import { CategoryNewsComponent } from './category-page/category-news/category-news.component';
import { CategorySportComponent } from './category-page/category-sport/category-sport.component';
import { CategoryEntertainmentComponent } from './category-page/category-entertainment/category-entertainment.component';
import { CategoryTravelComponent } from './category-page/category-travel/category-travel.component';
import { PlaylistPageComponent } from './playlist-page/playlist-page.component';
import { UploadVideoComponent } from './upload-video/upload-video.component';



const routes: Routes = [
  { path: '', component: HomePageComponent},
  { path: 'trending', component: TrendingPageComponent},
  { path: 'video/:id', component: VideoComponentComponent },
  { path: 'subscriptions', component: SubscriptionsPageComponent},
  { path: 'membership', component: MembershipPageComponent },
  { path: 'channel/:id', component: ChannelsPageComponent },
  { path: 'category/game', component: CategoryGameComponent },
  { path: 'category/music', component: CategoryMusicComponent },
  { path: 'category/news', component: CategoryNewsComponent },
  { path: 'category/sport', component: CategorySportComponent },
  { path: 'category/entertainment', component: CategoryEntertainmentComponent },
  { path: 'category/travel', component: CategoryTravelComponent },
  { path: 'playlist/:id', component: PlaylistPageComponent },
  { path: 'upload', component: UploadVideoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
export const routingComponents = 
[TrendingPageComponent, 
  HomePageComponent,
  VideoComponentComponent,
  SubscriptionsPageComponent,
  MembershipPageComponent,
  ChannelsPageComponent,
  CategoryGameComponent,
  CategoryMusicComponent,
  CategoryNewsComponent,
  CategorySportComponent,
  CategoryEntertainmentComponent,
  CategoryTravelComponent,
  PlaylistPageComponent,
  UploadVideoComponent]