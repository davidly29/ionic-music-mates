import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import {HttpClientModule} from '@angular/common/http';
import {environment} from '../environment';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { YtServiceService } from './yt-service.service';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  // tslint:disable-next-line:max-line-length
  imports: [BrowserModule, HttpClientModule, AngularFireModule.initializeApp(environment.firebase), AngularFirestoreModule, IonicModule.forRoot(), AppRoutingModule],

  providers: [
    StatusBar,
    SplashScreen,
    YtServiceService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    YoutubeVideoPlayer
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
