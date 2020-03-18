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
import {ModalPlayComponent} from './lobby/play-song/modal-play/modal-play.component';
import {UserSongsModalComponent} from './lobby/view-lobby/user-songs-modal/user-songs-modal.component';
import {UserAddSongsComponent} from './lobby/view-lobby/user-add-songs/user-add-songs.component';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media/ngx';

@NgModule({
  declarations: [AppComponent, ModalPlayComponent, UserSongsModalComponent, UserAddSongsComponent],
  entryComponents: [ModalPlayComponent, UserSongsModalComponent, UserAddSongsComponent],
  // tslint:disable-next-line:max-line-length
  imports: [BrowserModule, HttpClientModule, AngularFireModule.initializeApp(environment.firebase), AngularFirestoreModule,
    IonicModule.forRoot(), AppRoutingModule],

  providers: [
    StatusBar,
    SplashScreen,
    YtServiceService,
    StreamingMedia,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    YoutubeVideoPlayer
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
