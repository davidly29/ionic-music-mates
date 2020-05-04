/*
Author: David Lynch
Description: This class function is used to allow the user to manage their lobby
 */

import { Component, OnInit } from '@angular/core';

import {ModalController, ToastController} from '@ionic/angular';

import {PlaylistModel} from './PlaylistModel';

import {SongModel} from '../lobby/song.model';
import {LobbyModel} from '../lobby/lobby.model';
import {LobbyUserModel} from '../lobby/join-lobby/lobbyUserModel';
import {AuthService} from '../auth/auth.service';
import {FirebaseServiceService} from '../firebase-service.service';
import {PlaylistOptionsComponent} from '../lobby/join-lobby/playlist-options/playlist-options.component';


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

  allLobbies: LobbyModel[] = [];
  allRegisteredUsers: LobbyUserModel[] = [];
  usersPlaylist: PlaylistModel[] = [];

  isCurrentlyInLobby = false;
  newSongArray: SongModel[] = [];
  isCreate = false;
  clicked = false;
  allPlaylist: PlaylistModel[] = [];
  users: LobbyUserModel[] = [];
  constructor( private firebaseService: FirebaseServiceService, private toastCtrl: ToastController
    ,          private authService: AuthService, private toastController: ToastController, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.firebaseService.getPlaylists().subscribe(res => {
      this.allPlaylist = res;
    });

    this.firebaseService.getUsers().subscribe(res => {
      this.allRegisteredUsers = res;
    });

    this.firebaseService.getLobbies().subscribe(res => {
      this.allLobbies = res;
    });

    const temp = this.authService.user.getValue().id;
    if (this.allPlaylist.find(x => x.userId === temp) != null) {
      this.playlist = this.allPlaylist.find(x => x.userId === temp);
      return this.playlist;
    }
  }

  ionViewDidEnter() {
    this.getUserPlaylist();
    this.checkMyAccount();
  }
  checkMyAccount() {
    const email = this.authService.user.getValue().email;
    this.currentUser = this.allRegisteredUsers.find(x => x.email === email);
    return this.currentUser;
  }
  getUsers() {
    this.firebaseService.getLobbies().subscribe(res => {
      this.allLobbies = res;
    });

    this.usersLobby = this.allLobbies[0];
    return this.usersLobby;
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
    // TODO this may be needed somewhere
    // this.firebaseService.getLobby(this.currentUser.lobbyId).subscribe(lobby => {
    //   this.usersLobby = lobby;
    // });
    this.firebaseService.getPlaylists().subscribe(res => {
      this.allPlaylist = res;
    });
    this.firebaseService.addPlaylist(this.newUserPlaylist).then(console.log);
    return this.allPlaylist;
  }
  itemClicked() {
    this.clicked = true;
    this.usersLobby = this.allLobbies.find(x => x.id === this.currentUser.lobbyId);
  }
  openOptions(song) {
    this.currentUser = this.allRegisteredUsers.find(x => x.email === this.authService.user.getValue().email);
    this.usersLobby = this.allLobbies.find(x => x.id === this.currentUser.lobbyId);

    // tslint:disable-next-line:max-line-length
    this.modalCtrl.create({component: PlaylistOptionsComponent, componentProps: {song: song, usersLobby: this.usersLobby }}).then(modelEl => {
      modelEl.present();
    });
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
