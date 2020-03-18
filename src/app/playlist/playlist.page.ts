import { Component, OnInit } from '@angular/core';
import {FirebaseServiceService} from '../firebase-service.service';
import {ToastController} from '@ionic/angular';
import {AuthService} from '../auth/auth.service';
import {PlaylistModel} from './PlaylistModel';
import {SongModel} from '../lobby/song.model';


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

  toDelete: SongModel = {
   id: '',
   name: '',
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

  removeSong(id) {
    this.toDelete = this.playlist.songs.find(x => (x.id === id));
    const indexToRemove = this.playlist.songs.indexOf(this.toDelete);
    this.playlist.songs.splice(indexToRemove, 1);
    this.firebaseService.updatePlaylist(this.playlist, this.playlist.id);
    this.toastCtrl.create({
        message: 'Song Removed',
        duration: 2000
      }).then(toast => toast.present());
    }
}
