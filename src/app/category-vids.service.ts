import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class CategoryVidsService {

  private VideoAllTime = new BehaviorSubject<any>(null);
  private VideoRecent = new BehaviorSubject<any>(null);
  private VideoMonthPopular = new BehaviorSubject<any>(null);
  private VideoWeekPopular = new BehaviorSubject<any>(null);
  
  constructor(private apollo: Apollo) { }

  setAllTimePopular(rest, prem, cat){
    this.apollo.watchQuery ( {
      query: gql`
        query getVideoCategoryAllTimePopular($restriction: String!, 
          $premium: String!, $category: String!){
            getVideoCategoryAllTimePopular(restriction: $restriction, 
              premium: $premium, category: $category){
                video_id,
                video_title,
                video_thumbnail,
                video_views,
                day,
                month,
                year,
                channel_name,
                channel_icon,
                channel_id,
                video_premium,
                video
              }
          }
      `,
      variables: {
        restriction: rest,
        premium: prem,
        category: cat
      }
    } ).valueChanges.subscribe( r => {
      console.log('data ',r.data);
      this.VideoAllTime.next(r.data.getVideoCategoryAllTimePopular)
    } )
  }

  getAllTimePopular(rest,prem,cat): Observable<any>{
    this.VideoAllTime.next(null)
    this.setAllTimePopular(rest,prem,cat)
    console.log("asd")
    return this.VideoAllTime.asObservable();
  }

  setVideoRecent(rest, prem, cat){
    this.apollo.watchQuery ( {
      query: gql`
        query getVideoCategoryRecently($restriction: String!, 
          $premium: String!, $category: String!){
            getVideoCategoryRecently(restriction: $restriction, 
              premium: $premium, category: $category){
                video_id,
                video_title,
                video_thumbnail,
                video_views,
                day,
                month,
                year,
                channel_name,
                channel_icon,
                channel_id,
                video_premium,
                video
              }
          }
      `,
      variables: {
        restriction: rest,
        premium: prem,
        category: cat
      }
    } ).valueChanges.subscribe( r => {
      this.VideoRecent.next( r.data.getVideoCategoryRecently)
    } )
  }

  getVideoRecent(rest,prem,cat): Observable<any>{
    this.VideoAllTime.next(null)
    this.setVideoRecent(rest,prem,cat)
    return this.VideoRecent.asObservable();
  }

  setVideoMonth(rest, prem, cat){
    this.apollo.watchQuery ( {
      query: gql`
        query getVideoCategoryMonthPopular($restriction: String!, 
          $premium: String!, $category: String!){
            getVideoCategoryMonthPopular(restriction: $restriction, 
              premium: $premium, category: $category){
                video_id,
                video_title,
                video_thumbnail,
                video_views,
                day,
                month,
                year,
                channel_name,
                channel_icon,
                channel_id,
                video_premium,
                video
              }
          }
      `,
      variables: {
        restriction: rest,
        premium: prem,
        category: cat
      }
    } ).valueChanges.subscribe( r => {
      this.VideoMonthPopular.next(r.data.getVideoCategoryMonthPopular)
    } )
  }

  getVideoMonth(rest, prem, cat): Observable<any>{
    this.VideoAllTime.next(null)
    this.setVideoMonth(rest, prem, cat)
    return this.VideoMonthPopular.asObservable();
  }

  setVideoWeek(rest, prem, cat){
    this.apollo.watchQuery ( {
      query: gql`
        query getVideoCategoryWeekPopular($restriction: String!, 
          $premium: String!, $category: String!){
            getVideoCategoryWeekPopular(restriction: $restriction, 
              premium: $premium, category: $category){
                video_id,
                video_title,
                video_thumbnail,
                video_views,
                day,
                month,
                year,
                channel_name,
                channel_icon,
                channel_id,
                video_premium,
                video
              }
          }
      `,
      variables: {
        restriction: rest,
        premium: prem,
        category: cat
      }
    } ).valueChanges.subscribe( r => {
      this.VideoWeekPopular.next(r.data.getVideoCategoryWeekPopular)
    } )
  }

  getVideoWeek(rest, prem, cat): Observable<any>{
    this.VideoAllTime.next(null)
    this.setVideoWeek(rest, prem, cat)

    return this.VideoWeekPopular.asObservable();
  }
}
