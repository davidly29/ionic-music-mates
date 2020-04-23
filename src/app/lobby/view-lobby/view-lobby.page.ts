import {Component, Input, OnInit, ViewChild, NgZone, Pipe} from '@angular/core';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {ServicePageModule} from '../service/service.module';
import {LobbyModel} from '../lobby.model';
import {FirebaseServiceService} from '../../firebase-service.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {LobbyServiceService} from '../lobby-service.service';
import {AlertController, IonContent, ModalController, ToastController} from '@ionic/angular';
import {User} from '../../auth/user.model';
import {AuthService} from '../../auth/auth.service';
import {LobbyUserModel} from '../join-lobby/lobbyUserModel';
import {checkAvailability} from '@ionic-native/core';
import { AutosizeModule} from 'ngx-autosize';
import {MessageModel} from './messageModel';
import {isBoolean} from 'util';
import {ViewUserModalComponent} from './view-user-modal/view-user-modal.component';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {SongModel} from '../song.model';
import {UserSongsModalComponent} from './user-songs-modal/user-songs-modal.component';
import {UserAddSongsComponent} from './user-add-songs/user-add-songs.component';
import index from '@ionic/angular-toolkit/schematics/page';
import {PlaylistModel} from '../../playlist/PlaylistModel';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media/ngx';
import { BLE } from '@ionic-native/ble/ngx';
import {AddPlaylistLobbyComponent} from './add-playlist-lobby/add-playlist-lobby.component';
import {AddSongsPageModule} from './add-songs/add-songs.module';
import {YoutubeVideoPlayer} from '@ionic-native/youtube-video-player/ngx';
import {BleDeviceScanComponent} from './ble-device-scan/ble-device-scan.component';
import {ShowLobbySongsModalComponent} from './show-lobby-songs-modal/show-lobby-songs-modal.component';

declare var cordova: any;
@Component({
  selector: 'app-view-lobby',
  templateUrl: './view-lobby.page.html',
  styleUrls: ['./view-lobby.page.scss'],
})
export class ViewLobbyPage implements OnInit {
  tempshit = 'shit';
  joined: boolean;
  result = {};
  playlistSongs: string[];
  lobbyUsers: LobbyUserModel[];
  currentUser: BehaviorSubject<User>;

  currentUserName = '';
  isJoined = false;
  isJoinedMsg = '';

  playlist: PlaylistModel = {
    username: 'test',
    userId: 'test',
    name: 'test',
    id: 'test',
    songs: [] = [],
  };
  statusMessage: string;
  deviceMode = true;

  allPlaylists: PlaylistModel[] = [];
  allLobbies: LobbyModel[];
  allMessages: MessageModel[] = [];
  currentLobbyMessages: MessageModel[];
  loadedLobby: LobbyModel;
  allTheSongs: SongModel[] = [];

  allRegisteredUsers: LobbyUserModel[];

  currentUserLobby: LobbyUserModel = {
      name: '',
      email: '',
      lobbyId: '',
      users: '',
      id: '',
  };

  newUserLobby: LobbyUserModel = {
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
    currentSong: '',
    joinedUsers: [],
    songs: [],
    videoTime: 0,
    readyUrl: '',
    isAdmin: false,
  };

  tempUser: LobbyUserModel = {
    name: 'test',
    lobbyId: 'test',
    email: 'test',
    users: 'test'
  };

  tempSong: SongModel;
  currentVideoId: string;
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
  url: any;
  songs = [];
  lobbySongs: string[];
  currentSongIndex = 0;
  devices: any[] = [];
  seconds = 0;

  everyoneReady = false;
  playUrl = '';
  constructor(private activatedRoute: ActivatedRoute, private lobbyService: LobbyServiceService,
              private firebaseService: FirebaseServiceService, private toastCtrl: ToastController
  ,           private authService: AuthService, private toastController: ToastController,
              private modalCtrl: ModalController, private dom: DomSanitizer, public streamingMedia: StreamingMedia,
              private ble: BLE, private ngZone: NgZone, private alertCtrl: AlertController, private route: Router,
              private youtube: YoutubeVideoPlayer) { }

  ngOnInit() {
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

    this.firebaseService.getUsers().subscribe(res => {
        this.allRegisteredUsers = res;
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
    this.joined = false;
    this.currentUser = this.authService.user;

    this.loadedLobby = this.lobbyService.getLobby(this.activatedRoute.snapshot.paramMap.get('id'));
    this.firebaseService.getLobby(this.activatedRoute.snapshot.paramMap.get('id')).subscribe(temp => {
      this.tempLobby = temp;
    });
    this.currentUserName = this.currentUser.getValue().email;
    this.currentId = this.currentUser.getValue().id;
    this.checkUserJoined();
    this.songs = this.playlist.songs;
    if (this.tempLobby.songs.length < 1) {
      this.toastCtrl.create({
        message: 'No Playlist Set :(',
        duration: 3000
      }).then(toast => toast.present());
    }
    this.currentVideoId = 'MjBzElQrm4E';
    // this.tempLobby.songs = this.tempSong;
    // tslint:disable-next-line:no-conditional-assignment
    if (this.tempLobby.currentSong = '') {
      this.tempLobby.currentSong = this.tempLobby.songs[0].id;
      this.firebaseService.updateLobby(this.tempLobby, this.tempLobby.id);
      this.sanitizeVidId(this.tempLobby.currentSong);
    } else {
      this.sanitizeVidId(this.tempLobby.currentSong);
    }
  }

  saveTimeStamp(time) {
    this.tempLobby.videoTime = time;
    this.firebaseService.updateLobby(this.tempLobby, this.tempLobby.id).then(console.log);
  }


  openAVideo() {
    this.youtube.openVideo(this.tempLobby.currentSong);
  }
  checkUsersReady() {
    this.playUrl = '/?autoplay=1';
    this.url = this.sanitizeVidId(this.tempLobby.currentSong);
    this.tempLobby.readyUrl = this.url.toString();
    this.firebaseService.updateLobby(this.tempLobby, this.tempLobby.id);
    return this.url;
  }

  addPlaylist() {
      this.modalCtrl.create({
        component: AddPlaylistLobbyComponent, componentProps: {lobby: this.tempLobby}
      }).then(modalEl => {
        modalEl.present();
      });
  }
 openBLEModal() {
    this.Scan();
   // tslint:disable-next-line:max-line-length
    this.modalCtrl.create({component: BleDeviceScanComponent, componentProps: {devices: this.devices}}).then(modelEl => {
      modelEl.present();
   });

 }
  Scan() {
    this.setStatus('Scanning for Bluetooth LE Devices');
    this.devices = [];  // clear list

    this.ble.scan([], 5).subscribe( // scanning for 5 seconds on one tap
        device => this.onDeviceDiscovered(device),
        error => this.scanError(error)
    );

    setTimeout(this.setStatus.bind(this), 5000, 'Scan complete');
  }

  onDeviceDiscovered(device) {
    console.log('Discovered ' + JSON.stringify(device, null, 2));
    this.ngZone.run(() => {
      console.log(JSON.parse(JSON.stringify(device, null, 2)).name);
      this.devices.push(device); // filling the list with discovered list
    });
  }
  // If location permission is denied, you'll end up here
  scanError(error) {
    this.setStatus('Error ' + error);
    this.toastCtrl.create({
      message: 'Error scanning for Bluetooth low energy devices',
      position: 'bottom',
      duration: 5000
    }).then((obj) => {
      obj.present();
    });
  }
  setStatus(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }
  deviceSelected(device: any) {
    console.log(JSON.stringify(device) + ' selected');
    const navigationExtras: NavigationExtras = {
      queryParams: {
        special: JSON.stringify(device)
      }
    };
    this.route.navigate(['device-details'], navigationExtras);
  }

  goToNextVideo() {
      if (this.currentSongIndex >= this.tempLobby.songs.length) {
        return;
      } else {
        this.currentSongIndex = this.currentSongIndex + 1;
        this.tempLobby.currentSong = this.tempLobby.songs[this.currentSongIndex].id;
        this.sanitizeVidId(this.tempLobby.currentSong);
        this.firebaseService.updateLobby(this.tempLobby, this.tempLobby.id);
        return this.tempLobby;
      }
  }

  goToPrevVideo() {
      if (this.currentSongIndex <= 0) {
        this.currentSongIndex = 0;
        return this.currentSongIndex;
      } else {
        this.currentSongIndex = this.currentSongIndex - 1;
        this.tempLobby.currentSong = this.tempLobby.songs[this.currentSongIndex].id;
        this.sanitizeVidId(this.tempLobby.currentSong);
        this.firebaseService.updateLobby(this.tempLobby, this.tempLobby.id).then(console.log);
        return this.tempLobby;
      }
  }

  joinedLobby() {

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
      const id = this.activatedRoute.snapshot.paramMap.get('id');
      this.firebaseService.getLobby(id).subscribe(tempLobby => {
        this.tempLobby = tempLobby;
      });
      this.tempLobby.joinedUsers.push(this.authService.user.getValue().email);
      this.firebaseService.updateLobby(this.tempLobby, this.tempLobby.id).then(console.log);

      // this.currentUserLobby = this.allRegisteredUsers.find(x => x.email === this.authService.user.getValue().email);
      // this.currentUserLobby.lobbyId = this.activatedRoute.snapshot.paramMap.get('id');
      // this.newUserLobby = this.currentUserLobby;
      // this.firebaseService.updateUser(this.currentUserLobby, this.currentUserLobby.id).then(console.log);
      this.toastController.create({
        message: 'Joined',
        duration: 3000,
        showCloseButton: true,
        closeButtonText: 'OK',
        animated: true
      }).then((obj) => {
        obj.present();
      });
      this.isJoined = true;
    }
  }
  testAndroid() {
    const options: StreamingVideoOptions = {
      successCallback: () => { console.log('Video played'); },
      errorCallback: (e) => { console.log('Error streaming'); },
      orientation: 'landscape',
      shouldAutoClose: true,
      controls: false
    };
    this.streamingMedia.playVideo('https://www.youtube.com/watch?v=-jWh1lK3ruE', options);
  }
  playUserSongs(songId) {
    this.modalCtrl.create({
      component: UserSongsModalComponent, componentProps: {song: songId}
    }).then(modalEl => {
      modalEl.present();
    });
  }
  getSongId() {
    this.tempSong = this.tempLobby.songs[this.currentSongIndex];
    return this.tempSong;
  }
  sanitizeVidId(id) {
    this.url = this.dom.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + id);
    return this.url;
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
  getLobbySongs() {
    if (this.tempLobby.songs === null ) {
      this.toastController.create({
        message: 'There is no songs yet',
        duration: 3000,
        showCloseButton: true,
        closeButtonText: 'OK',
        animated: true
      }).then((obj) => {
        obj.present();
      });
    } else {
      this.modalCtrl.create({
        component: ShowLobbySongsModalComponent
        , componentProps: {songs: this.tempLobby.songs}
      }).then(modalEl => {
        modalEl.present();
      });
    }
  }
  leaveCurrentLobby() {
    this.isJoined = false;
    let name = '';
    name = this.tempLobby.joinedUsers.find(x => (x === this.authService.user.getValue().email));
    const indexToRemove = this.tempLobby.joinedUsers.indexOf(name);
    this.tempLobby.joinedUsers.splice(indexToRemove, 1);
    if (name !== '') {
      this.firebaseService.deleteUserFromLobby(this.tempLobby);
      this.currentUserLobby = this.allRegisteredUsers.find(x => x.email === this.authService.user.getValue().email);
      this.currentUserLobby.lobbyId = '';
      this.newUserLobby = this.currentUserLobby;
      this.firebaseService.updateUser(this.newUserLobby, this.newUserLobby.id).then(console.log);

      this.toastCtrl.create({
        message: 'You have left the lobby',
        duration: 2000
      }).then(toast => toast.present());
    } else {
      this.toastCtrl.create({
        message: 'You have not joined this lobby',
        duration: 2000
      }).then(toast => toast.present());
    }
  }
  async showPlaylistAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Playlist Already Loaded',
      subHeader: 'There is already a loaded playlist',
      message: 'would you like to remove this playlist and load your own ?',
      buttons: [
        {
        text: 'Cancel',
        handler: data => {
        console.log('Cancel clicked');
        this.alertCtrl.dismiss();
        }
        },
        {
          text: 'Override Playlist',
          handler: data => {
            this.viewSongs();
          }
        }
      ]
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    console.log(result);
  }
  loadSongs() {
    if (this.tempLobby.songs.length > 0) {
      this.showPlaylistAlert().then(console.log);
    } else {
      this.viewSongs();
    }
  }
  viewSongs() {
    const temp = this.authService.user.getValue().id;
    if (this.allPlaylists.find(x => x.userId === temp) != null) {
      this.playlist = this.allPlaylists.find(x => x.userId === temp);
    }
    this.tempLobby.songs = this.playlist.songs;
    this.firebaseService.updateLobby(this.tempLobby, this.tempLobby.id);
    this.allTheSongs = this.playlist.songs;
    this.tempshit = this.playlist.songs[0].id.toString();
    this.toastController.create({
      message: 'Playlist Loaded',
      duration: 3000,
      showCloseButton: true,
      closeButtonText: 'OK',
      animated: true
    }).then((obj) => {
      obj.present();
    });
    return this.lobbySongs;
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
  lobbyStatus() {
    if (this.isJoined) {
      this.leaveCurrentLobby();
    } else {
      this.joinLobby();
    }
  }

}
