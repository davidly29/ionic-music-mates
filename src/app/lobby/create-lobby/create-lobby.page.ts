import { Component, OnInit } from '@angular/core';
import {FirebaseServiceService} from '../../firebase-service.service';
import {LobbyModel} from '../lobby.model';
import {NavController, ToastController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../auth/auth.service';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-create-lobby',
  templateUrl: './create-lobby.page.html',
  styleUrls: ['./create-lobby.page.scss'],
})
export class CreateLobbyPage implements OnInit {
  lobby: LobbyModel = {
    userId: '',
    name: '',
    password: '',
    description: '',
    allowedUsers: null,
    joinedUsers: [],
    songs: [],
    isPassword: false,
    currentSong: '',
    videoTime: 0,
    readyUrl: '',
    isAdmin: false,
  };

  lobbyId = null;
  constructor(private firebaseService: FirebaseServiceService, public toastController: ToastController, private route: ActivatedRoute,
              private authService: AuthService, private navCtrl: NavController) {
  }

  saveLobby() {
    this.authService.userId.pipe(take(1)).subscribe(currentUserid => {
      this.lobby.userId = currentUserid;
      if (this.lobby.password.length > 0) {
        this.lobby.isPassword = true;
      } else {
        this.lobby.isPassword = false;
      }
      this.firebaseService.addLobby(this.lobby).then(r => this.toastController.dismiss());
    });
    this.navCtrl.back();
  }
  ngOnInit() {
    this.lobbyId = this.route.snapshot.params.id;

  }

}
