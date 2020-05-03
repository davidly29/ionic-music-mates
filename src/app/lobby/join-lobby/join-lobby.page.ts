import {Component, OnInit, ViewChild} from '@angular/core';
import {ServicePage} from '../service/service.page';
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
  constructor(private lobbyService: ServicePage, private firebaseService: FirebaseServiceService, private authService: AuthService,
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
  clearList() {
    for (let i = 0; this.allPlaylist.length; i++) {
      if (this.allPlaylist[i].userId === 'test') {
        this.firebaseService.deletePlaylist(this.allPlaylist[i].id);
      }
    }
  }
  ionViewDidEnter() {
    this.checkMyAccount();
    // this.currentUser = this.allRegisteredUsers.find(x => x.email === this.authService.user.getValue().email);
    // // if (this.currentUser.email !== '') {
    //   this.firebaseService.getLobby(this.currentUser.lobbyId).subscribe(lobby => {
    //     this.usersLobby = lobby;
    //   });
    // }

  }
  lobbySearch() {
    for (let i = 0; i < this.loadedLobbies.length; i++) {
      if (this.loadedLobbies[i].name === this.lobbyName) {
         this.goToIndex = i;
         this.slider.slideTo(i, 500);
      }
    }
  }
  goToSlide() {
    this.slider.slideTo(2, 500);
  }
  lobbyManager() {
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


  checkLobby(slide) {
    this.currentUser = this.allRegisteredUsers.find(x => x.email === this.authService.user.getValue().email);
    this.firebaseService.getLobby(this.currentUser.lobbyId).subscribe(lobby => {
      this.usersLobby = lobby;
    });
    if (this.usersLobby.id.length > 4) {
      this.currentlyInLobby = true;
    }
    this.lobbyIndex = this.loadedLobbies.findIndex(x => x === this.usersLobby);
    this.lobbyIndex = 2;
    slide.slider.slideTo(2, 2000);
  }
  joinLobby(lobby: LobbyModel) {
    // if (lobby.joinedUsers.length >= lobby.allowedUsers) {
    //   this.toastCtrl.create({
    //     message: 'There is no songs yet',
    //     duration: 3000,
    //     showCloseButton: true,
    //     closeButtonText: 'OK',
    //     animated: true
    //   }).then((obj) => {
    //     obj.present();
    //   });
    // }
    this.currentUser = this.allRegisteredUsers.find(x => x.email === this.authService.user.getValue().email);
    this.currentUser.lobbyId = lobby.id;
    this.firebaseService.updateUser(this.currentUser, this.currentUser.id);

    lobby.joinedUsers.push(this.authService.user.getValue().email);
    this.firebaseService.updateLobby(lobby, lobby.id);

    if (lobby.isPassword) {
      this.modalCtrl.create({component: PasswordCheckComponent, componentProps:
            {password: lobby.password, lobbyId: lobby.id, lobbyToJoin: lobby}}).then(modalEl => {
        modalEl.present();
    });
    }
  }

}
