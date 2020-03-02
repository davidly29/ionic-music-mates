import { Component, OnInit } from '@angular/core';
import {ServicePage} from '../service/service.page';
import {LobbyModel} from '../lobby.model';
import {FirebaseServiceService} from '../../firebase-service.service';
import {AuthService} from '../../auth/auth.service';
import {AlertController, ModalController} from '@ionic/angular';

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
    allowedUsers: null
  };

  sliderConfig = {
    spaceBetween: 10,
    centeredSlides: true,
    slidesPerView: 1.6,
  };
  constructor(private lobbyService: ServicePage, private firebaseService: FirebaseServiceService, private authService: AuthService,
              private alert: AlertController) { }

  ngOnInit() {
  // this.loadedLobbies = this.lobbyService.lobbies;
    this.firebaseService.getLobbies().subscribe(res => {
        this.loadedLobbies = res;
  });
  }

  removeLobby(id) {
    // this.tempLobby = this.loadedLobbies.find(temp => temp.id === id);
    // if (this.tempLobby.userId !== this.authService.user.getValue().id) {
    //   this.alert.create({header: 'You can only delete lobbies you have made', buttons: ['OK']}).then(alertEl => alertEl.present());
    // } else {
      this.firebaseService.removeLobby(id).then(obj => {
        console.log(obj);
      });
  }

  joinLobby(lobby: LobbyModel) {
    // this.tempLobby = lobby;
    // this.tempLobby.joinedUsers.push(this.authService.user.getValue().email);
    // this.firebaseService.updateLobby(lobby, lobby.id).then(c => {console.log(c); });
  }

}
