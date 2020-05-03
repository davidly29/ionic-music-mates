import { Component, OnInit } from '@angular/core';
import {FirebaseServiceService} from '../../../firebase-service.service';

import {LobbyUserModel} from '../../join-lobby/lobbyUserModel';
import {LobbyModel} from '../../lobby.model';
import {AuthService} from '../../../auth/auth.service';
import {SongModel} from '../../song.model';
import {PlaylistModel} from '../../../playlist/PlaylistModel';

@Component({
  selector: 'app-add-songs',
  templateUrl: './add-songs.page.html',
  styleUrls: ['./add-songs.page.scss'],
})
export class AddSongsPage implements OnInit {
  playlist: PlaylistModel = {
    username: 'test',
    userId: 'test',
    name: 'test',
    id: 'test',
    songs: [],
  };
  currentUserLobby: LobbyUserModel = {
    name: '',
    email: '',
    lobbyId: '',
    users: '',
    id: '',
  };
  tempLobby: LobbyModel = {
    id: '',
    name: '',
    description: '',
    userId: '',
    password: '',
    allowedUsers: 0,
    joinedUsers: [],
    songs: []
  };
  songs: SongModel = {
    id: '',
    name: '',
  };

  allSongs: SongModel[];
  allPlaylists: PlaylistModel[] = [];
  allLobbies: LobbyModel[];
  allRegisteredUsers: LobbyUserModel[];
  email = this.authService.user.getValue().email;
  constructor(private firebaseService: FirebaseServiceService, private authService: AuthService) { }
  ngOnInit() {

  this.firebaseService.getPlaylists().subscribe(res => {
    this.allPlaylists = res;
  });
  this.firebaseService.getUsers().subscribe(res => {
    this.allRegisteredUsers = res;
  });
  this.firebaseService.getLobbies().subscribe(res => {
    this.allLobbies = res;
  });
  }

  getUserPlaylist() {
    const temp = this.authService.user.getValue().id;
    if (this.allPlaylists.find(x => x.userId === temp) != null) {
      this.playlist = this.allPlaylists.find(x => x.userId === temp);
    }
    return this.playlist;
  }

  importUserPlaylist() {
    const temp = this.authService.user.getValue().id;
    if (this.allPlaylists.find(x => x.userId === temp) != null) {
      this.playlist = this.allPlaylists.find(x => x.userId === temp);
    }
    this.allSongs = this.playlist.songs;
    this.currentUserLobby = this.allRegisteredUsers.find(x => x.email === this.email);
    this.tempLobby = this.allLobbies.find(x => x.id === this.currentUserLobby.lobbyId);
  }

}
