import { Component, OnInit } from '@angular/core';
import {FirebaseServiceService} from '../firebase-service.service';
import {ToastController} from '@ionic/angular';
import {AuthService} from '../auth/auth.service';
import {PlaylistModel} from './PlaylistModel';


@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.page.html',
  styleUrls: ['./playlist.page.scss'],
})
export class PlaylistPage implements OnInit {
  playlist: PlaylistModel = {
    videoId: 'test',
    userId: 'test',
    name: 'test',
    id: 'test',
    songs: [],
  };

  allPlaylists: PlaylistModel[];
  constructor( private firebaseService: FirebaseServiceService, private toastCtrl: ToastController
    ,          private authService: AuthService, private toastController: ToastController) { }

  ngOnInit() {
    this.firebaseService.getPlaylists().subscribe(res => {
          this.allPlaylists = res;
        }
    );
  }

  getUserPlaylist() {
    const temp = this.authService.user.getValue().id;
    if (this.allPlaylists.find(x => x.userId === temp) != null) {
      this.playlist = this.allPlaylists.find(x => x.userId === temp);
    }
    return this.playlist;
  }

}
