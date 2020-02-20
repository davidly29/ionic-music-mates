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

  currentUserTest: LobbyUserModel = {
    name: 'test',
    lobbyId: 'test',
    email: 'test',
    users: 'test'
  };

  userToCheck: LobbyUserModel = {
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

  messageTemp: MessageModel = {
    lobbyId: '',
    msgContent: '',
    sentBy: '',
    time: ''
  };
  constructor(private activatedRoute: ActivatedRoute, private lobbyService: LobbyServiceService,
              private firebaseService: FirebaseServiceService, private toastCtrl: ToastController
  ,           private authService: AuthService, private toastController: ToastController,
              private modalCtrl: ModalController) { }

  ngOnInit() {
    this.firebaseService.getLobbies().subscribe(res => {
      this.allLobbies = res;
      console.log(this.allLobbies);
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
    // this.currentUserTest.email = this.currentUser.getValue().email;
    this.joined = false;
    // this.checkUserJoined();
    this.currentUser = this.authService.user;
    this.loadedLobby = this.lobbyService.getLobby(this.activatedRoute.snapshot.paramMap.get('id'));
    this.firebaseService.getLobby(this.activatedRoute.snapshot.paramMap.get('id')).subscribe(temp => {
      this.tempLobby = temp;
    });
    this.currentUserName = this.currentUser.getValue().email;
  }

  joinLobby() {
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

    // this.firebaseService.addUser(this.tempUser).then(r => this.toastController.dismiss());
  }

  checkUserJoined() {
    this.userToCheck.email = this.authService.user.getValue().email;
    this.userToCheck.users = this.authService.user.getValue().id;
    this.userToCheck.lobbyId = this.activatedRoute.snapshot.paramMap.get('id');
    this.userToCheck.name = 'test';
    const id = this.userToCheck.users;

    this.lobbyUsers.find(item => {
      if (item.users === this.activatedRoute.snapshot.paramMap.get('id')) {
        this.joined = true;
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
    this.modalCtrl.create({component: ViewUserModalComponent, componentProps: {lobbyUsers: this.lobbyUsers, lobbyId: this.activatedRoute.snapshot.paramMap.get('id')}}).then(modelEl => {
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
