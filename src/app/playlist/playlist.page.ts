import { Component, OnInit } from '@angular/core';
import {FirebaseServiceService} from '../firebase-service.service';
import {ToastController} from '@ionic/angular';
import {AuthService} from '../auth/auth.service';
import {PlaylistModel} from './PlaylistModel';
import {SongModel} from '../lobby/song.model';
import {LobbyModel} from '../lobby/lobby.model';
import {LobbyUserModel} from '../lobby/join-lobby/lobbyUserModel';


@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.page.html',
  styleUrls: ['./playlist.page.scss'],
})
export class PlaylistPage implements OnInit {
  playlist: PlaylistModel = {
    username: 'test',
    userId: 'test',
    name: 'test',
    songs: [],
  };
  newUserPlaylist: PlaylistModel = {
    username: 'test',
    userId: 'test',
    name: '',
    id: 'test',
    songs: [],
  };


  toDelete: SongModel = {
   id: '',
   name: '',
  };

  toAdd: SongModel = {
    id: '',
    name: '',
  };

  usersLobby: LobbyModel = {
    id: '',
    name: '',
    description: '',
    userId: '',
    password: '',
    allowedUsers: 0,
    joinedUsers: [],
    songs: []
  };
  currentUser: LobbyUserModel = {
    name: 'test',
    lobbyId: 'test',
    email: 'test',
    users: 'test'
  };

  allPlaylists: PlaylistModel[] = [];
  allRegisteredUsers: LobbyUserModel[] = [];
  allLobbies: LobbyModel[] = [];

  usersPlaylist: PlaylistModel[] = [];

  isCurrentlyInLobby = false;
  newSongArray: SongModel[] = [];
  isCreate = false;
  constructor( private firebaseService: FirebaseServiceService, private toastCtrl: ToastController
    ,          private authService: AuthService, private toastController: ToastController) { }

  ngOnInit() {
    this.firebaseService.getPlaylists().subscribe(res => {
          this.allPlaylists = res;
      // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.allPlaylists.length; i ++) {
            if (this.allPlaylists[i].userId === this.authService.user.getValue().email) {
              this.usersPlaylist.push(this.allPlaylists[i]);
            }
          }
        });

    this.firebaseService.getUsers().subscribe(res => {
      this.allRegisteredUsers = res;
    });

    this.firebaseService.getLobbies().subscribe(res => {
      this.allLobbies = res;
    });
    const temp = this.authService.user.getValue().id;
    if (this.allPlaylists.find(x => x.userId === temp) != null) {
      this.playlist = this.allPlaylists.find(x => x.userId === temp);
      return this.playlist;
    }
  }
  newPlaylistCreate() {
    this.newUserPlaylist.userId = this.authService.user.getValue().id;
    this.firebaseService.addPlaylist(this.newUserPlaylist).then(console.log);
  }
  switchAdd() {
    this.isCreate = true;
    return this.isCreate;
  }
  getUserPlaylist() {
    const temp = this.authService.user.getValue().id;
    if (this.allPlaylists.find(x => x.userId === temp) != null) {
      this.playlist = this.allPlaylists.find(x => x.userId === temp);
    }
    // this.currentUser = this.allRegisteredUsers.find(x => x.email === this.authService.user.getValue().email);
    // this.usersLobby = this.allLobbies.find(x => x.id === this.currentUser.lobbyId);

    // TODO this may be needed somewhere
    // this.firebaseService.getLobby(this.currentUser.lobbyId).subscribe(lobby => {
    //   this.usersLobby = lobby;
    // });
    this.newSongArray = this.playlist.songs;
    return this.newSongArray;
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

  addToLobby(song) {
    this.firebaseService.getLobby(this.currentUser.lobbyId).subscribe(lobby => {
      this.usersLobby = lobby;
    });
    this.toAdd = song;
    this.newSongArray = this.usersLobby.songs;
    this.newSongArray.push(this.toAdd);

    this.usersLobby.songs = this.newSongArray;
    this.firebaseService.updateLobby(this.usersLobby, this.usersLobby.id);
    this.toastController.create({
      message: 'Song added to ' + this.usersLobby.name,
      duration: 3000,
      showCloseButton: true,
      closeButtonText: 'OK',
      animated: true
    }).then((obj) => {
      obj.present();
    });
  }
}
