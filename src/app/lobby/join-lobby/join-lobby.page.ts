/*
Author: David Lynch
Description: This class function is used to allow the user to view lobbies that they can join
 */
import {Component, OnInit, ViewChild} from '@angular/core';
import {LobbyModel} from '../lobby.model';
import {FirebaseServiceService} from '../../firebase-service.service';
import {AuthService} from '../../auth/auth.service';
import {AlertController, IonSlides, ModalController, Platform, ToastController} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import {PasswordCheckComponent} from '../view-lobby/password-check/password-check.component';
import {LobbyUserModel} from './lobbyUserModel';
import {LobbyManagerComponent} from './lobby-manager/lobby-manager.component';
import {PlaylistModel} from '../../playlist/PlaylistModel';
@Component({
  selector: 'app-join-lobby',
  templateUrl: './join-lobby.page.html',
  styleUrls: ['./join-lobby.page.scss'],
})
export class JoinLobbyPage implements OnInit {
  loadedLobbies: LobbyModel[];
  tempLobby: LobbyModel = {
    id: '',
    joinedUsers: [],
    password: '',
    userId: '',
    description: '',
    name: '',
    allowedUsers: null,
    isPassword: false,
  };
  currentUser: LobbyUserModel = {
    name: 'test',
    lobbyId: 'test',
    email: 'test',
    users: 'test'
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
  allRegisteredUsers: LobbyUserModel[] = [];
  currentlyInLobby = false;

  sliderConfig = {
    spaceBetween: 10,
    centeredSlides: true,
    slidesPerView: 1.7,
  };
  lobbyIndex = 0;
  @ViewChild(IonSlides, { static: false }) slider: IonSlides;
  usersLobbies: LobbyModel[] = [];
  allPlaylist: PlaylistModel[] = [];
  lobbyName = '';
  goToIndex = 0;
  constructor(private firebaseService: FirebaseServiceService, private authService: AuthService,
              // tslint:disable-next-line:max-line-length
              private alert: AlertController, private route: Router, private modalCtrl: ModalController,
              private toastCtrl: ToastController, public platform: Platform) {}

  ngOnInit() {
    this.currentUser.users = '';
    this.lobbyIndex = 0;
  // this.loadedLobbies = this.lobbyService.lobbies;
    this.firebaseService.getLobbies().subscribe(res => {
        this.loadedLobbies = res;
  });
    this.firebaseService.getUsers().subscribe(res => {
      this.allRegisteredUsers = res;
    });
    this.firebaseService.getPlaylists().subscribe(res => {
      this.allPlaylist = res;
    });
  }
  ionViewDidEnter() {
    this.checkMyAccount();

  }
  lobbySearch() {
    for (let i = 0; i < this.loadedLobbies.length; i++) {
      if (this.loadedLobbies[i].name === this.lobbyName) {
         this.goToIndex = i;
         this.slider.slideTo(i, 500);
      }
    }
  }
  lobbyManager() {
      this.usersLobbies = [];
      this.currentUser = this.allRegisteredUsers.find(x => x.email === this.authService.user.getValue().email);
      this.firebaseService.getLobby(this.currentUser.lobbyId).subscribe(lobby => {
          this.usersLobby = lobby;
      });
    // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.loadedLobbies.length; i++) {
        if (this.loadedLobbies[i].userId === this.authService.user.getValue().id) {
            this.usersLobbies.push(this.loadedLobbies[i]);
        }
      }
      this.modalCtrl.create({component: LobbyManagerComponent, componentProps:
              {currentUser: this.currentUser, usersLobby: this.usersLobby, userLobbies: this.usersLobbies}}).then(modalEl => {
          modalEl.present();
      });
  }

  removeLobby(id) {
      this.firebaseService.removeLobby(id).then(obj => {
        console.log(obj);
      });
  }
  checkMyAccount() {
    this.currentUser = this.allRegisteredUsers.find(x => x.email === this.authService.user.getValue().email);
    return this.currentUser;
  }

  joinLobby(lobby: LobbyModel) {
    const aName = lobby.joinedUsers.find(x => x === this.authService.user.getValue().email);

    if (lobby.joinedUsers.length >= lobby.allowedUsers && aName == null) {
      this.toastCtrl.create({
        message: 'This Lobby is Full',
        duration: 3000,
        showCloseButton: true,
        closeButtonText: 'OK',
        animated: true
      }).then((obj) => {
        obj.present();
      });
    } else {
      this.currentUser = this.allRegisteredUsers.find(x => x.email === this.authService.user.getValue().email);
      this.currentUser.lobbyId = lobby.id;
      this.firebaseService.updateUser(this.currentUser, this.currentUser.id);

      const name = lobby.joinedUsers.find(x => x === this.authService.user.getValue().email);
      if (name != null) {
        if (lobby.isPassword) {
          this.modalCtrl.create({
            component: PasswordCheckComponent, componentProps:
                {password: lobby.password, lobbyId: lobby.id, lobbyToJoin: lobby}
          }).then(modalEl => {
            modalEl.present();
          });
        }
      } else {
        if (lobby.isPassword) {
          this.modalCtrl.create({
            component: PasswordCheckComponent, componentProps:
                {password: lobby.password, lobbyId: lobby.id, lobbyToJoin: lobby}
          }).then(modalEl => {
            modalEl.present();
          });
        }
      }
    }
  }

}
