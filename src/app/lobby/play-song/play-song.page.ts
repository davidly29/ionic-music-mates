/*
Author: David Lynch
Description: This class function is used to search for a Video Using the YouTube Data API V3
 */

import { Component, OnInit } from '@angular/core';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import {SongModel} from '../song.model';
import {NgForm} from '@angular/forms';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {YtServiceService} from '../../yt-service.service';
import { LoadingService } from '../../loading.service';
import {AlertController, LoadingController, ModalController, NavController, Platform, ToastController} from '@ionic/angular';
import {ModalPlayComponent} from './modal-play/modal-play.component';
import {FirebaseServiceService} from '../../firebase-service.service';
import {ActivatedRoute, NavigationExtras} from '@angular/router';
import {AuthService} from '../../auth/auth.service';
import {BehaviorSubject} from 'rxjs';
import {User} from '../../auth/user.model';
import {SongToPlaylistComponent} from '../../song-to-playlist/song-to-playlist.component';
import {PlaylistModel} from '../../playlist/PlaylistModel';

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
    username: 'test',
    userId: 'test',
    name: 'test',
    songs: null,
  };

  updatePlaylist: PlaylistModel = {
    username: 'test',
    userId: 'test',
    name: 'test',
    id: 'test',
    songs: [],
  };
  allPlaylists: PlaylistModel[] = [];

  searchKey = '';
  response: any = {};

  private categoryArray = [];
  private videos = [];
  private video;
  loading: LoadingService;
  currentUser: BehaviorSubject<User>;


  tempSong: SongModel = {
    id: '',
    name: ''
  };
  videoKey = '';
  vid = '';
  yt = 'https://www.youtube.com/';
  category: any;
  newSongArray: SongModel[] = [];

  constructor(private youtube: YoutubeVideoPlayer, private dom: DomSanitizer,
              private ytProvider: YtServiceService, private alertCtrl: AlertController, public modalCtrl: ModalController,
              // tslint:disable-next-line:max-line-length
              public plt: Platform, private firebaseService: FirebaseServiceService, private activatedRoute: ActivatedRoute,
              private authService: AuthService, private toastController: ToastController, public navCtrl: NavController) {
    this.getCategory();
  }

  ngOnInit() {
    this.firebaseService.getPlaylists().subscribe(res => {
      this.allPlaylists = res;
      }
    );
    this.currentUser = this.authService.user;
  }


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

  addSong(id, name) {
    this.tempSong.id = id;
    this.tempSong.name = name;

    this.firebaseService.getPlaylists().subscribe(res => {
          this.allPlaylists = res;
        }
    );
    this.modalCtrl.create({
      // tslint:disable-next-line:max-line-length
      component: SongToPlaylistComponent, componentProps: {songID: this.tempSong.id, songName: this.tempSong.name, allPlaylists: this.allPlaylists}
    }).then(modalEl => {
      modalEl.present();
    });

  }

  onSubmit(form: NgForm) {
    const name = form.value.name;

  }

  /////////////////////////////////////////////////////////
  // opens selected video for viewing
  viewVideo(vid) {
    if (this.plt.is('cordova')) {
      this.youtube.openVideo(vid.id.username); // opens video with username
    } else {
      // if we are not on a device where cordova is available we open the video in browser.
      window.open('https://www.youtube.com/watch?v=' + vid.id.username);
    }
  }
// this function presents videos based on category selected by user
  filter(value) {
    this.loading.show();
    this.videos = [];
    const temp = this.ytProvider.getVideos(value);
    temp.subscribe(data => {
      // tslint:disable-next-line:forin
      for (const i in data) {
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
    this.ytProvider.SearchVideo(this.searchKey).subscribe(
        res => this.response = res,
        error => {
          console.log('Error: ', error);
          // this.commons.requestCount--;
          this.response = null;
        },
        () =>  {
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
    this.categoryArray = [];
    const temp = this.ytProvider.getCategories();
    temp.subscribe(data => {
      // tslint:disable-next-line:forin
      for (const i in data) {
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
    }, err => {

      const alert = this.alertCtrl.create({
        message: JSON.stringify(err),
        buttons: ['OK']
      });
      this.loading.hide();
    });

}
}


