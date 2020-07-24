import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-channels-page',
  templateUrl: './channels-page.component.html',
  styleUrls: ['./channels-page.component.scss']
})
export class ChannelsPageComponent implements OnInit {

  channel;

  constructor(private route: ActivatedRoute, private apollo: Apollo) { }

  ngOnInit(): void {

    var channelId;

    this.route.paramMap.subscribe((params: ParamMap) => {
      channelId = params.get('id');
      var id = channelId.toString();

      console.log(id)

      this.apollo.watchQuery({
        query: gql`
          query getChannelById($channel_id: String!){
            getChannelById(channel_id: $channel_id){
              channel_name,
              channel_background,
              channel_icon,
              channel_subscribers,
              channel_description,
              channel_join_date_day,
              channel_join_date_month,
              channel_join_date_year,
              channel_premium
            }
          }
        `, 
        variables: { channel_id: id }
      }).valueChanges.subscribe(result => {
        this.channel = result.data.getChannelById
      })
    })


    
  }

  c: boolean = false;

  getSubs(number): String{
    if(number<1000) return number;
    if(number<100000) return (number/1000).toFixed(1) + " k";
    if(number<1000000000) return (number/1000000).toFixed(1) + " m";
  }

  contentExpand(x: number){
    if(x==1){
      this.c=true;
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
