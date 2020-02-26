import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ServicePageModule} from '../service/service.module';
import {LobbyModel} from '../lobby.model';
import {FirebaseServiceService} from '../../firebase-service.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {LobbyServiceService} from '../lobby-service.service';
import {IonContent, ModalController, ToastController} from '@ionic/angular';
import {User} from '../../auth/user.model';
import {AuthService} from '../../auth/auth.service';
import {LobbyUserModel} from '../join-lobby/lobbyUserModel';
import {checkAvailability} from '@ionic-native/core';
import { AutosizeModule} from 'ngx-autosize';
import {MessageModel} from './messageModel';
import {isBoolean} from 'util';
import {ViewUserModalComponent} from './view-user-modal/view-user-modal.component';
import {PlaylistModel} from '../../playlist/playlist-model';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {SongModel} from '../song.model';
import {UserSongsModalComponent} from './user-songs-modal/user-songs-modal.component';
import {UserAddSongsComponent} from './user-add-songs/user-add-songs.component';
import index from '@ionic/angular-toolkit/schematics/page';
declare var cordova: any;
@Component({
  selector: 'app-view-lobby',
  templateUrl: './view-lobby.page.html',
  styleUrls: ['./view-lobby.page.scss'],
})
export class ViewLobbyPage implements OnInit {
  joined: boolean;
  result = {};
  lobbyUsers: LobbyUserModel[];
  currentUser: BehaviorSubject<User>;

  currentUserName = '';
  isJoined = false;
  isJoinedMsg = '';

  playlist: PlaylistModel = {
    videoId: 'test',
    userId: 'test',
    name: 'test',
    id: 'test',
    songs: [],
  };

  allPlaylists: PlaylistModel[];
  allLobbies: LobbyModel[];
  allMessages: MessageModel[] = [];

  currentLobbyMessages: MessageModel[];

  loadedLobby: LobbyModel;

  tempLobby: LobbyModel = {
    id: '',
    name: '',
    description: '',
    userId: '',
    password: '',
    allowedUsers: 0,
    joinedUsers: []
  };

  tempUser: LobbyUserModel = {
    name: 'test',
    lobbyId: 'test',
    email: 'test',
    users: 'test'
  };

  messages = [
    {
      msgContent: 'Hello There',
      sentBy: 'david@gmail.com',
      time: Date.now().toString(),
      lobbyId: this.activatedRoute.snapshot.paramMap.get('id')
    },
    {
      msgContent: 'Hello Back',
      sentBy: 'sam@gmail.com',
      time: Date.now().toString(),
      lobbyId: this.activatedRoute.snapshot.paramMap.get('id')
    }
  ];
  newMsg = '';
  lobbyPlaylist = [];

  messageTemp: MessageModel = {
    lobbyId: '',
    msgContent: '',
    sentBy: '',
    time: ''
  };
  currentId = '';
  url: SafeResourceUrl = '';
  songs = [];
  currentVideo = '';
  currentSongIndex = 0;
  constructor(private activatedRoute: ActivatedRoute, private lobbyService: LobbyServiceService,
              private firebaseService: FirebaseServiceService, private toastCtrl: ToastController
  ,           private authService: AuthService, private toastController: ToastController,
              private modalCtrl: ModalController, private dom: DomSanitizer) { }

  ngOnInit() {
    this.playlist.songs = [];
    this.firebaseService.getLobbies().subscribe(res => {
      this.allLobbies = res;
      console.log(this.allLobbies);
    });

    this.firebaseService.getPlaylists().subscribe(res => {
          this.allPlaylists = res;
        }
    );

    this.firebaseService.getUsers().subscribe(res => {
      this.lobbyUsers = res;
    });

    this.firebaseService.getAllMessages().subscribe(res => {
      this.allMessages = res;
    });

    const id = this.activatedRoute.snapshot.paramMap.get('id');

    this.allMessages.find(item => {
      if (item.lobbyId === id) {
        this.currentLobbyMessages.push(item);
        return true; }
    });

    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        // redirect
        return;
      }
    });
    // this.currentUserTest.email = this.currentUser.getValue().email;
    this.joined = false;
    // this.checkUserJoined();
    this.currentUser = this.authService.user;

    this.loadedLobby = this.lobbyService.getLobby(this.activatedRoute.snapshot.paramMap.get('id'));
    this.firebaseService.getLobby(this.activatedRoute.snapshot.paramMap.get('id')).subscribe(temp => {
      this.tempLobby = temp;
    });
    this.currentUserName = this.currentUser.getValue().email;
    this.currentId = this.currentUser.getValue().id;
    this.checkUserJoined();
    this.songs = this.playlist.songs;
    this.currentVideo = this.playlist.songs[1];
  }

  goToNextVideo() {
    // let temps = this.playlist.songs.indexOf(currentId);
    // temps = temps + 1;
    this.currentSongIndex = this.currentSongIndex + 1;
    this.currentVideo = this.playlist.songs[this.currentSongIndex];
    return this.currentVideo;
  }

  goToPrevVideo() {
    this.currentSongIndex = this.currentSongIndex - 1;
    this.currentVideo = this.playlist.songs[this.currentSongIndex];
    return this.currentVideo;
  }

  joinLobby() {
    this.checkUserJoined();
    if (this.isJoined) {
      this.toastController.create({
        message: 'Already Joined',
        duration: 3000,
        showCloseButton: true,
        closeButtonText: 'OK',
        animated: true
      }).then((obj) => {
        obj.present();
      });
    } else {
      this.currentUser = this.authService.user;
      this.tempUser.email = this.authService.user.getValue().email;
      const id = this.activatedRoute.snapshot.paramMap.get('id');
      this.firebaseService.getLobby(id).subscribe(tempLobby => {
        this.tempLobby = tempLobby;
      });

      this.tempUser.lobbyId = this.activatedRoute.snapshot.paramMap.get('id');
      this.tempUser.users = this.authService.user.getValue().id;

      this.tempLobby.joinedUsers.push(this.currentUserName);
      this.firebaseService.updateLobby(this.tempLobby, this.tempLobby.id);

    }
  }

  playUserSongs(songId) {
    this.modalCtrl.create({
      component: UserSongsModalComponent, componentProps: {song: songId}
    }).then(modalEl => {
      modalEl.present();
    });
  }

  sanitizeVidId(id) {
    return this.dom.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + id);
  }
  checkUserJoined() {
    this.tempLobby.joinedUsers.find(item => {
      if (item === this.currentUser.getValue().email) {
        this.isJoined = true;
        this.isJoinedMsg = 'You have Joined !';
        return true; }
    });
  }

  authWithSpotify() {
    const config = {
      clientId: '4671fcc7c9564f94b408922a06f54835',
      redirectUrl: 'ionicfyp://callback',
      scopes: ['streaming', 'playlist-read-private', 'user-read-email', 'user-read-private'],
      tokenExchangeUrl: 'https://ionicfypserver.herokuapp.com/exchange',
      tokenRefreshUrl: 'https://ionicfypserver.herokuapp.com/refresh',
    };

    cordova.plugins.spotifyAuth.authorize(config)
        .then(({ accessToken, encryptedRefreshToken, expiresAt }) => {
          this.result = { access_token: accessToken, expires_in: expiresAt, ref: encryptedRefreshToken };
        });
  }
  leaveCurrentLobby() {
    this.joined = false;
    this.firebaseService.deleteUserFromLobby(this.currentUser.getValue().id);
  }
  viewSongs() {
    const temp = this.authService.user.getValue().id;
    if (this.allPlaylists.find(x => x.userId === temp) != null) {
      this.playlist = this.allPlaylists.find(x => x.userId === temp);
    }
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'No Playlist found :(',
      duration: 2000
    });
    toast.present();
  }

  sendMessage() {
    this.messageTemp.sentBy = this.authService.user.getValue().email;
    this.messageTemp.time = Date.now().toString();
    this.messageTemp.msgContent = this.newMsg;
    this.messageTemp.lobbyId = this.activatedRoute.snapshot.paramMap.get('id');

    this.newMsg = '';
    this.firebaseService.addLobbyMessage(this.messageTemp);
  }

  viewLobbyUsers() {
    // tslint:disable-next-line:max-line-length
    this.modalCtrl.create({component: ViewUserModalComponent, componentProps: {joinedUsers: this.tempLobby.joinedUsers, lobbyId: this.activatedRoute.snapshot.paramMap.get('id')}}).then(modelEl => {
      modelEl.present();
    });
  }

  addSongsUser() {
    // tslint:disable-next-line:max-line-length
    this.modalCtrl.create({component: UserAddSongsComponent, componentProps: {song: this.playlist.songs, lobbyList: this.lobbyPlaylist}}).then(modelEl => {
      modelEl.present();
    });
  }

  showToast(msg) {
    this.toastCtrl.create({
      message: msg,
      duration: 2000
    }).then(toast => toast.present());
  }

}
