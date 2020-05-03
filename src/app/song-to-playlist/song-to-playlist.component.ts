import {Component, Input, OnInit} from '@angular/core';

import {AuthService} from '../auth/auth.service';
import {FirebaseServiceService} from '../firebase-service.service';
import {SongModel} from '../lobby/song.model';
import {ToastController} from '@ionic/angular';
import {PlaylistModel} from '../playlist/PlaylistModel';

@Component({
  selector: 'app-song-to-playlist',
  templateUrl: './song-to-playlist.component.html',
  styleUrls: ['./song-to-playlist.component.scss'],
})
export class SongToPlaylistComponent implements OnInit {
  @Input() songID: string;
  @Input() songName: string;
  @Input() allPlaylists: PlaylistModel[];
  playlistSongs: SongModel[];
  playlists: PlaylistModel[];
  newUserPlaylist: PlaylistModel = {
    songs: [],
    name: '',
    userId: '',
    username: '',
  };
  playlist: PlaylistModel = {
    username: 'test',
    userId: 'test',
    name: 'test',
    id: 'test',
    songs: [] = [],
  };

  songToAdd: SongModel = {
    id: '',
    name: '',
  };

  // tslint:disable-next-line:max-line-length
  constructor(private authService: AuthService, private firebaseService: FirebaseServiceService, private toastController: ToastController) { }

  ngOnInit() {
    this.songToAdd.name = this.songName;
    this.songToAdd.id = this.songID;
    this.playlistSongs = [];

    this.firebaseService.getPlaylists().subscribe(data => {
      this.playlists = data;
    });
    this.firebaseService.addPlaylist(this.playlist);

  }

  getPlaylists() {
    this.firebaseService.getPlaylists().subscribe(data => {
      this.playlists = data;
    });
    return this.playlists;
  }
  deletePlaylist(item: PlaylistModel) {
    this.firebaseService.deletePlaylist(item.id).then(console.log);
    this.toastController.create({
      message: 'Playlist Deleted',
      position: 'bottom',
      duration: 5000
    }).then((obj) => {
      obj.present();
    });
  }

  addToPlaylist(item: PlaylistModel) {
    // this.playlist = item;
    this.songToAdd.name = this.songName;
    this.songToAdd.id = this.songID;

    // this.playlist.songs.push(this.songToAdd);
    this.playlistSongs = item.songs;

    // this.playlistSongs = this.playlist.songs.map((obj) => Object.assign({}, obj));
    this.playlistSongs.push(this.songToAdd);
    // this.playlist.songs  = this.playlistSongs.map((obj) => Object.assign({}, obj));
    item.songs = this.playlistSongs;
    // this.playlistSongs.push(this.songToAdd);
    // this.playlist.songs.push(this.songToAdd);

    this.firebaseService.updatePlaylist(item, item.id).then(console.log);
    this.toastController.create({
      message: 'Song Added !',
      position: 'bottom',
      duration: 5000
    }).then((obj) => {
      obj.present();
    });
  }
  createNewPlaylist() {
    this.newUserPlaylist.username = this.authService.user.getValue().email;
    this.newUserPlaylist.userId = this.authService.user.getValue().id;
    this.firebaseService.addPlaylist(this.newUserPlaylist);
    this.toastController.create({
      message: 'Playlist Created !',
      position: 'bottom',
      duration: 5000
    }).then((obj) => {
      obj.present();
    });
  }
}
