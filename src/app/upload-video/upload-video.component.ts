import { Component, OnInit, Input } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { HeroService } from '../hero.service';


@Component({
  selector: 'app-upload-video',
  templateUrl: './upload-video.component.html',
  styleUrls: ['./upload-video.component.scss']
})
export class UploadVideoComponent implements OnInit {

  isHovering: boolean;

  @Input() file: File;

  task: AngularFireUploadTask;
  task2: AngularFireUploadTask;

  percentage: Observable<number>;
  snapshot: Observable<any>;

  vidDownloadURL:  String;
  thumbnailDownloadURL: String;

  @Input() thumbnail: File;

  isUploaded = false;

  videoDuration;

  scheduled = false;

  constructor(private storage: AngularFireStorage, 
    private db: AngularFirestore,
    private apollo: Apollo,
    private user: HeroService) { }

  ngOnInit(): void {
  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  startUpload(){

    console.log(new Date().getDate());
    console.log(new Date().getUTCDate());

    const path = `${Date.now()}_${this.file.name}`;

    const ref = this.storage.ref(path);

    // Upload to the storage
    this.task = this.storage.upload(path, this.file);
    
    this.percentage = this.task.percentageChanges();

    this.task.then(
      (res) => ref.getDownloadURL().subscribe(data => {
        this.vidDownloadURL = data
        console.log(this.vidDownloadURL)
      }
      )
    )

    this.isUploaded = true;

    this.setInfo();
    
  }

  setInfo(){
    let self = this;
    var video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = function() {
      window.URL.revokeObjectURL(video.src);
      var duration = video.duration;

      self.videoDuration = self.setDuration(duration);
    }
  
    video.src = URL.createObjectURL(this.file);
  }

  setDuration(duration): String{
    
    var minute: number = Math.floor((duration / 60) % 60);
    var second: number = Math.floor(duration % 60);

    
    if(second < 10){
      return minute + ":" + "0" + second;
    }else{
      return minute + ":" + second;
    }

  }

  scheduledChecked(number){
    if(number == 1) this.scheduled = false;
    else this.scheduled = true;
  }
  

  onDrop(files: FileList) {
    this.file = files[0];
    this.startUpload();
  }

  chooseFile(event: EventTarget){
    let eventObj: MSInputMethodContext = <MSInputMethodContext> event;
    let target: HTMLInputElement = <HTMLInputElement> eventObj.target;
    let files: FileList = target.files;
    this.file = files[0];

    this.startUpload();
  }

  chooseThumbnail(event: EventTarget){
    let eventObj: MSInputMethodContext = <MSInputMethodContext> event;
    let target: HTMLInputElement = <HTMLInputElement> eventObj.target;
    let files: FileList = target.files;
    this.thumbnail = files[0];

    var thumbnailImg = document.getElementById('thumbnailImg');
    thumbnailImg.src = URL.createObjectURL(this.thumbnail);
    thumbnailImg.onload = function(){
      URL.revokeObjectURL(thumbnailImg.src)
    }

    var sideImg = document.getElementById('sideImage');
    sideImg.src = URL.createObjectURL(this.thumbnail);
    sideImg.onload = function(){
      URL.revokeObjectURL(sideImg.src)
    }

  }

  premiumVid(){
    this.isPremium = !this.isPremium;

    console.log(this.isPremium)
  }

  isPremium = false;

  finalizeButton(){
    const path = `${Date.now()}_${this.thumbnail.name}`;

    const ref = this.storage.ref(path);

    // Upload to the storage
    this.task2 = this.storage.upload(path, this.thumbnail);

    var title, desc, category, cat, privacy, isPublic, premium,  
    restriction, isRestricted, onSchedule, region, day, month, year, 
    channelid, channelname, channelicon;

    title = document.getElementById('v_title').value;
    desc = document.getElementById('v_desc').value;

    restriction = document.getElementById('yes');

    

    if(restriction.checked == true){
      isRestricted = false;
    }else{
      isRestricted = true;
    }

    privacy = document.getElementById('private');
    
    if(privacy.checked == true){
      isPublic = "Private"
    }else{
      isPublic = "Public"
    }

    onSchedule = document.getElementById('scheduled');

    var date;
    
    // if(onSchedule.checked == true){
    //   //schedule
    // }else{
      date = new Date();

      day = date.getDate();
      month = date.getMonth()+1;
      year = date.getFullYear();
    // }

    if(document.getElementById('music').checked == true){
      category = "Music"
    }else if(document.getElementById('sport').checked == true){
      category = "Sport"
    }else if(document.getElementById('game').checked == true){
      category = "Game"
    }else if(document.getElementById('news').checked == true){
      category = "News"
    }else if(document.getElementById('ent').checked == true){
      category = "Entertainment"
    }else if(document.getElementById('travel').checked == true){
      category = "Travel"
    }


    console.log(title, desc, isPublic, this.isPremium, isRestricted, 
      this.vidDownloadURL, day, month, year, category)

    
    this.user.getUser().subscribe( user => {
      this.task2.then(
        (res) => {
          ref.getDownloadURL().subscribe(data => {
            this.thumbnailDownloadURL = data,
            console.log(this.thumbnailDownloadURL),
            console.log(user.id, user.name, user.photoUrl)
            this.apollo.mutate({
              mutation: gql`
                mutation createVideo($video_title: String!, $video_description: String!, 
                  $video_category: String!, $video_privacy: String!, $video_premium: Boolean!, 
                  $video_restriction: Boolean!, $video_thumbnail: String!, $video: String!,
                  $video_region: String!, $day: Int!, $month: Int!, $year: Int!,
                  $channel_id: String!, $channel_name: String!, $channel_icon: String!){
                    createVideo(input: {
                      video_title: $video_title
                      video_description: $video_description
                      video_category: $video_category
                      video_like: 0
                      video_dislike: 0
                      video_privacy: $video_privacy
                      video_premium: $video_premium
                      video_restriction: $video_restriction
                      video_thumbnail: $video_thumbnail
                      video: $video
                      video_views: 0
                      video_region: $video_region
                      day: $day
                      month: $month
                      year: $year
                      channel_id: $channel_id
                      channel_name: $channel_name
                      channel_icon: $channel_icon
                    }){ video_title }
                }
              `,
              variables: {
                video_title: title,
                video_description: desc,
                video_category: category,
                video_privacy: isPublic,
                video_premium: this.isPremium,
                video_restriction: isRestricted,
                video_thumbnail: this.thumbnailDownloadURL,
                video: this.vidDownloadURL,
                video_region: "Indonesia",
                day: day,
                month: month,
                year: year,
                channel_id: user.id,
                channel_name: user.name,
                channel_icon: user.photoUrl,
              }
            }).subscribe(({ data }) => {
              console.log("data : ", data);
            },
            (error) => {
              console.log("error" + error)
            })
          }
          )
  
        }
        
      )
    })

    

  }

}
