import {Component, Input, OnInit, ViewChild, NgZone, Pipe} from '@angular/core';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {LobbyModel} from '../lobby.model';
import {FirebaseServiceService} from '../../firebase-service.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {LobbyServiceService} from '../lobby-service.service';
import {AlertController, IonContent, ModalController, ToastController} from '@ionic/angular';
import {User} from '../../auth/user.model';
import {AuthService} from '../../auth/auth.service';
import {LobbyUserModel} from '../join-lobby/lobbyUserModel';
import {MessageModel} from './messageModel';
import {ViewUserModalComponent} from './view-user-modal/view-user-modal.component';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {SongModel} from '../song.model';
import {UserAddSongsComponent} from './user-add-songs/user-add-songs.component';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media/ngx';
import { BLE } from '@ionic-native/ble/ngx';
import {AddPlaylistLobbyComponent} from './add-playlist-lobby/add-playlist-lobby.component';
import {YoutubeVideoPlayer} from '@ionic-native/youtube-video-player/ngx';
import {BleDeviceScanComponent} from './ble-device-scan/ble-device-scan.component';
import {ShowLobbySongsModalComponent} from './show-lobby-songs-modal/show-lobby-songs-modal.component';
import {PlaylistAddingComponent} from './playlist-adding/playlist-adding.component';
import { ChangeDetectorRef } from '@angular/core';
import {SongToLobbyComponent} from './song-to-lobby/song-to-lobby.component';
import {PlaylistModel} from '../../playlist/PlaylistModel';

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

  thePlaylists: PlaylistModel[] = [];
  allLobbies: LobbyModel[];
  allMessages: MessageModel[] = [];
  currentLobbyMessages: MessageModel[];
  loadedLobby: LobbyModel;
  allTheSongs: SongModel[] = [];

  allRegisteredUsers: LobbyUserModel[] = [];

  newUserLobby: LobbyUserModel = {
    name: '',
    email: '',
    lobbyId: '',
    users: '',
    id: '',
  };

  currentUserLobby: LobbyUserModel = {
    name: 'test',
    lobbyId: 'test',
    email: 'test',
    users: 'test'
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
    songs: [] = [],
    videoTime: 0,
    readyUrl: '',
    isAdmin: false,
    isReady: false,
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
  secondUrl: any;
  songs = [];
  lobbySongs: string[];
  currentSongIndex = 0;
  devices: any[] = [];
  seconds = 0;
  everyoneReady = false;
  playUrl = '';
  testString = '';
  constructor(private activatedRoute: ActivatedRoute, private lobbyService: LobbyServiceService,
              private firebaseService: FirebaseServiceService, private toastCtrl: ToastController
  ,           private authService: AuthService, private toastController: ToastController,
              private modalCtrl: ModalController, private dom: DomSanitizer, public streamingMedia: StreamingMedia,
              private ble: BLE, private ngZone: NgZone, private alertCtrl: AlertController, private route: Router,
              private youtube: YoutubeVideoPlayer, private changeRef: ChangeDetectorRef) { }

  ngOnInit() {
    const lobbyID = this.activatedRoute.snapshot.paramMap.get('id');
    this.firebaseService.getLobbies().subscribe(res => {
      this.allLobbies = res;
      this.tempLobby = this.allLobbies.find(x => x.id === lobbyID)
      console.log(this.allLobbies);
    });

    this.firebaseService.getUsers().subscribe(res => {
      this.allRegisteredUsers = res;
    });

    this.firebaseService.getPlaylists().subscribe(res => {
          this.thePlaylists = res;
        });

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
    this.joined = false;
    this.currentUser = this.authService.user;

    this.loadedLobby = this.lobbyService.getLobby(this.activatedRoute.snapshot.paramMap.get('id'));
    this.firebaseService.getLobby(lobbyID).subscribe(temp => {
      this.tempLobby = temp;
      this.sanitizeVidId(this.tempLobby.currentSong);
    });
    this.currentUserName = this.currentUser.getValue().email;
    this.currentId = this.currentUser.getValue().id;
    this.checkUserJoined();
    this.songs = this.playlist.songs;
  }
  ionViewDidEnter() {
    const lobbyID = this.activatedRoute.snapshot.paramMap.get('id');
    this.firebaseService.getLobby(lobbyID).subscribe(temp => {
      this.tempLobby = temp;
      this.sanitizeVidId(this.tempLobby.currentSong);
    });
    if (this.tempLobby.currentSong === '') {
      this.tempLobby.currentSong = this.tempLobby.songs[0].id;
      this.firebaseService.updateLobby(this.tempLobby, this.tempLobby.id);
      this.sanitizeVidId(this.tempLobby.currentSong);
    } else {
      this.sanitizeVidId(this.tempLobby.currentSong);
    }
    this.checkUserJoined();
  }


  openAVideo() {
    this.youtube.openVideo(this.tempLobby.currentSong);
  }
  checkUsersReady() {
    this.everyoneReady = true;
    // this.playUrl = '/?autoplay=1';
    // this.urlToSanitize = 'https://www.youtube.com/embed/' + this.tempLobby.currentSong;
    // this.tempLobby.readyUrl = this.urlToSanitize;
    // this.firebaseService.updateLobby(this.tempLobby, this.tempLobby.id);
    this.url = this.sanitizeVidId(this.tempLobby.currentSong);
    return this.url;
  }

  makeReady() {
    this.tempLobby.isReady = true;
    this.firebaseService.updateLobby(this.tempLobby, this.tempLobby.id);
    return this.tempLobby;
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
        this.currentSongIndex = this.tempLobby.songs.length;
        return this.currentSongIndex;
      } else {
        this.currentSongIndex = this.currentSongIndex + 1;
        this.tempLobby.currentSong = this.tempLobby.songs[this.currentSongIndex].id;
        this.firebaseService.updateLobby(this.tempLobby, this.tempLobby.id).then(console.log);
        return this.tempLobby;
        this.sanitizeVidId(this.tempLobby.currentSong);
      }
  }

  goToPrevVideo() {
      if (this.currentSongIndex <= 0) {
        this.currentSongIndex = 0;
        return this.currentSongIndex;
      } else {
        this.currentSongIndex = this.currentSongIndex - 1;
        this.tempLobby.currentSong = this.tempLobby.songs[this.currentSongIndex].id;
        this.firebaseService.updateLobby(this.tempLobby, this.tempLobby.id).then(console.log);
        return this.tempLobby;
        this.sanitizeVidId(this.tempLobby.currentSong);
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


      const lobbyID = this.activatedRoute.snapshot.paramMap.get('id');
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
  sanitizeVidId(id) {
    this.playUrl = '?autoplay=1';
    if (this.everyoneReady) {
      this.secondUrl = this.dom.bypassSecurityTrustResourceUrl('http://www.youtube.com/embed/' + id );
      // tslint:disable-next-line:max-line-length
      this.url = this.dom.bypassSecurityTrustResourceUrl('http://www.youtube.com/embed/' + id + '?autoplay=1');
    } else {
      this.secondUrl = this.dom.bypassSecurityTrustResourceUrl('http://www.youtube.com/embed/' + id );
      this.url = this.dom.bypassSecurityTrustResourceUrl('http://www.youtube.com/embed/' + id);
    }
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
      // this.firebaseService.deleteUserFromLobby(this.tempLobby);;
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

  playlistSong() {
    this.modalCtrl.create({
      component: SongToLobbyComponent
      , componentProps: {lobby: this.tempLobby}
    }).then(modalEl => {
      modalEl.present();
    });
  }

  loadSongs() {
    this.modalCtrl.create({
      component: PlaylistAddingComponent
      , componentProps: {currentLobby: this.tempLobby}
    }).then(modalEl => {
      modalEl.present();
    });
  }
  viewSongs() {
    const temp = this.authService.user.getValue().id;
    if (this.thePlaylists.find(x => x.userId === temp) != null) {
      this.playlist = this.thePlaylists.find(x => x.userId === temp);
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
