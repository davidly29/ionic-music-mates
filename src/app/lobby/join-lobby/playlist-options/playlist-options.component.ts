import {Component, Input, OnInit} from '@angular/core';
import {PlaylistModel} from '../../../playlist/PlaylistModel';
import {SongModel} from '../../song.model';
import {LobbyModel} from '../../lobby.model';
import {LobbyUserModel} from '../lobbyUserModel';
import {FirebaseServiceService} from '../../../firebase-service.service';
import {AuthService} from '../../../auth/auth.service';
import {ModalController, ToastController} from '@ionic/angular';




@Component({
  selector: 'app-playlist-options',
  templateUrl: './playlist-options.component.html',
  styleUrls: ['./playlist-options.component.scss'],
})
export class PlaylistOptionsComponent implements OnInit {
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
  lobby: LobbyModel = {
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
    users: 'test',
  };

  newSongArray: SongModel[] = [];
  allLobbies: LobbyModel[] = [];
  allRegisteredUsers: LobbyUserModel[];

  @Input() song: SongModel;
  @Input() usersLobby: LobbyModel;
  constructor(private firebaseService: FirebaseServiceService, private authService: AuthService, private toastCtrl: ToastController,
              private modalCtrl: ModalController) { }

  ngOnInit() {
    this.firebaseService.getUsers().subscribe(res => {
      this.allRegisteredUsers = res;
    });
    this.firebaseService.getLobbies().subscribe(res => {
      this.allLobbies = res;
    });
  }
  ionViewDidEnter() {
  }

  addToLobby(song) {
    this.lobby.songs = this.lobby.songs.concat(song);
    this.firebaseService.updateLobby(this.lobby, this.lobby.id);
    this.toastCtrl.create({
      message: 'Song added to ' + this.lobby.name,
      duration: 3000,
      showCloseButton: true,
      closeButtonText: 'OK',
      animated: true
    }).then((obj) => {
      obj.present();
    });
  }
  getUser() {
    this.firebaseService.getUsers().subscribe(res => {
      this.allRegisteredUsers = res;
    });
    this.firebaseService.addUser(this.currentUser);
    return this.allRegisteredUsers;
  }
  loadDetails() {
    this.getUser();
    this.getCurrentUserLobby();
  }
  getCurrentUserLobby() {
    const email = this.authService.user.getValue().email;
    this.currentUser = this.allRegisteredUsers.find(x => x.email === email);
    this.firebaseService.getLobby(this.currentUser.lobbyId).subscribe(res => {
      this.lobby = res;
    });
  }
  cancel() {
    this.modalCtrl.dismiss();
  }

}
