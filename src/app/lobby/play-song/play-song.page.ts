import { Component, OnInit } from '@angular/core';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import {SongModel} from '../song.model';
import {NgForm} from '@angular/forms';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {SpotifyAuth} from '@ionic-native/spotify-auth/ngx';
import {YtServiceService} from '../../yt-service.service';
import { LoadingService } from '../../loading.service';
import {AlertController, LoadingController, ModalController, Platform, ToastController} from '@ionic/angular';
import {ModalPlayComponent} from './modal-play/modal-play.component';
import {FirebaseServiceService} from '../../firebase-service.service';
import {PlaylistModel} from '../../playlist/playlist-model';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../auth/auth.service';
import {BehaviorSubject} from 'rxjs';
import {User} from '../../auth/user.model';

declare var cordova: any;

@Component({
  selector: 'app-play-song',
  templateUrl: './play-song.page.html',
  styleUrls: ['./play-song.page.scss'],
})
export class PlaySongPage implements OnInit {
  result = {};
  songs: SongModel[];
  embedUrl: SafeResourceUrl = '';

  playlist: PlaylistModel = {
    videoId: 'test',
    userId: 'test',
    name: 'test',
    id: 'test',
    songs: [],
  };

  allPlaylists: PlaylistModel[];

  searchKey = '';
  response: any = {};

  private categoryArray;
  private videos = [];
  private video;
  loading: LoadingService;
  currentUser: BehaviorSubject<User>;

  videoKey = '';
  vid = '';
  yt = 'https://www.youtube.com/';
  category: any;
  constructor(private youtube: YoutubeVideoPlayer, private dom: DomSanitizer,
              private ytProvider: YtServiceService, private alertCtrl: AlertController, public modalCtrl: ModalController,
              // tslint:disable-next-line:max-line-length
              public plt: Platform, private firebaseService: FirebaseServiceService, private activatedRoute: ActivatedRoute,
              private authService: AuthService, private toastController: ToastController) {
    this.getCategory();
  }

  ngOnInit() {

    this.firebaseService.getPlaylists().subscribe(res => {
      this.allPlaylists = res;
      }
    );
    // const config = {
    //   clientId: '<SPOTIFY CLIENT ID>',
    //   redirectUrl: '<REDIRECT URL, MUST MATCH WITH AUTH ENDPOINT AND SPOTIFY DEV CONSOLE>',
    //   scopes: ['streaming'], // see Spotify Dev console for all scopes
    //   tokenExchangeUrl: '<URL OF TOKEN EXCHANGE HTTP ENDPOINT>',
    //   tokenRefreshUrl: '<URL OF TOKEN REFRESH HTTP ENDPOINT>',
    // };
    //
    // this.spotifyAuth.authorize(config)
    //     .then(({ accessToken, expiresAt }) => {
    //       console.log(`Got an access token, its ${accessToken}!`);
    //       console.log(`Its going to expire in ${expiresAt - Date.now()}ms.`);
    //     });


   // this.spotifyAuth.forget().then(() => console.log("We're logged out!"));
    this.currentUser = this.authService.user;
  }

  // authWithSpotify() {
  //   const config = {
  //     clientId: '4671fcc7c9564f94b408922a06f54835',
  //     redirectUrl: 'ionicfyp://callback',
  //     scopes: ['streaming', 'playlist-read-private', 'user-read-email', 'user-read-private'],
  //     tokenExchangeUrl: 'https://ionicfypserver.herokuapp.com/exchange',
  //     tokenRefreshUrl: 'https://ionicfypserver.herokuapp.com/refresh',
  //   };
  //
  //   cordova.plugins.spotifyAuth.authorize(config)
  //       .then(({ accessToken, encryptedRefreshToken, expiresAt }) => {
  //         this.result = { access_token: accessToken, expires_in: expiresAt, ref: encryptedRefreshToken };
  //       });
  // }

  sanitizeVid(url) {
    return this.dom.bypassSecurityTrustResourceUrl(url);
  }
  playVideo(titleName: string, id: string, channelID: string) {
    this.modalCtrl.create({
      component: ModalPlayComponent, componentProps: {title: titleName, currentId: id, channelId: channelID}
    }).then(modalEl => {
      modalEl.present();
    });
}


  addSong(id) {
    // this.songs.push(new SongModel('song1', id));
    if (this.allPlaylists.find(x => x.userId === this.currentUser.getValue().id) != null) {
      this.playlist = this.allPlaylists.find(x => x.userId === this.currentUser.getValue().id);
      this.playlist.songs.push(id);
      this.firebaseService.updatePlaylist(this.playlist, this.playlist.id);
    } else {
      this.playlist.userId = this.currentUser.getValue().id;
      this.playlist.videoId = id;
      this.playlist.songs.push(id);
      this.firebaseService.addPlaylist(this.playlist);
    }

  }

  onSubmit(form: NgForm) {
    const name = form.value.name;

  }

  /////////////////////////////////////////////////////////
  // opens selected video for viewing
  viewVideo(vid) {
    // if we are on a device where cordova is available we user the youtube video player
    if (this.plt.is('cordova')) {
      this.youtube.openVideo(vid.id.videoId); // opens video with videoId
    } else {
      // if we are not on a device where cordova is available we open the video in browser.
      window.open('https://www.youtube.com/watch?v=' + vid.id.videoId);
    }
  }
// this function presents videos based on category selected by user
  filter(value) {
    this.loading.show(); // shows loading circle
    this.videos = []; // defines this.videos as an empty array
    const temp = this.ytProvider.getVideos(value); // defines temp as our http call in yt provider
    // we subscrive to videos of category value here
    temp.subscribe(data => {
      // tslint:disable-next-line:forin
      for (const i in data) {
        // if video is not present in videos array, we push it into the array
        if (this.videos.indexOf(i) === -1) {
          this.videos.push(i);
        }
      }
      this.loading.hide(); // hides loading circle
    }, err => {
      // shows error alert if there is an issue with our subscription
      const alert = this.alertCtrl.create({
        message: JSON.stringify(err),
        buttons: ['OK']
      });
      this.loading.hide(); // hides loading circle
    });
  }

  getSongBySearch() {
   // this.commons.requestCount++;
    this.ytProvider.SearchVideo(this.searchKey).subscribe(
        res => this.response = res,
        error => {
          console.log('Error: ', error);
          // this.commons.requestCount--;
          this.response = null;
        },
        () =>  {
          // this.commons.requestCount--;
          console.log(this.response);
        }
    );
  }

  onClick(key: string) {
      // modalRef.componentInstance.header = header;
       this.embedUrl = 'https://www.youtube.com/embed/' + key;
       this.searchKey = '';
       return this.dom.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + key);
      // this.response = null;

  }




  // this function retrieves a list of the categories available on YouTube
  getCategory() {
    // this.loading.show(); // shows loading circle
    this.categoryArray = []; // defines out variable categoryArray as an empty array.
    const temp = this.ytProvider.getCategories(); // sets temp equal to our http call in yt provider
    // we subscribe to categories here
    temp.subscribe(data => {
      // tslint:disable-next-line:forin
      for (const i in data) {
        // if category is not already a member of our array, we push the categort into our array
        if (this.categoryArray.indexOf(i) === -1) {
          this.categoryArray.push(i);
        }
        // sorts the category array by title, we can use the same method to sort by any other factor as well.
        this.categoryArray.sort((a: any, b: any) => {
          const item1 = a.snippet.title;
          const item2 = b.snippet.title;
          if (item1 < item2) {
            return -1;
          } else if (item1 > item2) {
            return 1;
          } else {
            return 0;
          }
        });
      }
     // this.loading.hide();
    }, err => {

      const alert = this.alertCtrl.create({
        message: JSON.stringify(err),
        buttons: ['OK']
      });
      this.loading.hide();
    });

}
}


