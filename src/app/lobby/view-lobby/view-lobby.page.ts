import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ServicePageModule} from '../service/service.module';
import {LobbyModel} from '../lobby.model';
import {FirebaseServiceService} from '../../firebase-service.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {LobbyServiceService} from '../lobby-service.service';
import {IonContent, ToastController} from '@ionic/angular';
import {User} from '../../auth/user.model';
import {AuthService} from '../../auth/auth.service';
import {LobbyUserModel} from '../join-lobby/lobbyUserModel';
import {checkAvailability} from '@ionic-native/core';
import { AutosizeModule} from 'ngx-autosize';
import {MessageModel} from './messageModel';
import {isBoolean} from 'util';

@Component({
  selector: 'app-view-lobby',
  templateUrl: './view-lobby.page.html',
  styleUrls: ['./view-lobby.page.scss'],
})
export class ViewLobbyPage implements OnInit {
  joined: boolean;

  lobbyUsers: LobbyUserModel[];
  currentUser: BehaviorSubject<User>;

  allLobbies: LobbyModel[];
  allMessages: MessageModel[] = [];

  currentLobbyMessages: MessageModel[];
  tempLobby: LobbyModel = {
    name: '',
    description: '',
    id: '',
    password: '',
    allowedUsers: 0
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
  ,           private authService: AuthService, private toastController: ToastController) { }

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
    this.firebaseService.addUser(this.tempUser).then(r => this.toastController.dismiss());
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

  showToast(msg) {
    this.toastCtrl.create({
      message: msg,
      duration: 2000
    }).then(toast => toast.present());
  }

}
