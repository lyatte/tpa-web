import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { SocialUser } from "angularx-social-login";

@Injectable()
export class HeroService {

  private user = new BehaviorSubject<any>(null);

  constructor() {  }

  setUser(user: SocialUser){
    this.user.next(user);
    this.getUser().subscribe( res => console.log(res) )
  }

  clearUser(){
    this.user.next(null);
  }

  getUser(): Observable<any>{
    return this.user.asObservable();
  }
}
