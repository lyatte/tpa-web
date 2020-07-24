import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';

import { MatVideoModule } from 'mat-video';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { DropDirective } from './drop.directive';

import { HeroService } from './hero.service';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBCeBDAIr-xLeBTlLm9JK23wnykBPRcUiA",
  authDomain: "y-jube.firebaseapp.com",
  databaseURL: "https://y-jube.firebaseio.com",
  projectId: "y-jube",
  storageBucket: "y-jube.appspot.com",
  messagingSenderId: "996899946601",
  appId: "1:996899946601:web:bf622d140cd89e458de2f8"
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    routingComponents,
    DropDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocialLoginModule,
    BrowserAnimationsModule,
    MatVideoModule,
    GraphQLModule,
    HttpClientModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '442010254451-kqh3irbmkouq0516tvj41earfso0k805.apps.googleusercontent.com'
            ),
          }
        ],
      } as SocialAuthServiceConfig,
    },
    HeroService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
