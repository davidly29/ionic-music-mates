import { Component, OnInit } from '@angular/core';
import {ServicePage} from '../service/service.page';
import {LobbyModel} from '../lobby.model';
import {FirebaseServiceService} from '../../firebase-service.service';
import {AuthService} from '../../auth/auth.service';

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
  constructor(private lobbyService: ServicePage, private firebaseService: FirebaseServiceService, private authService: AuthService) { }

  ngOnInit() {
  // this.loadedLobbies = this.lobbyService.lobbies;
    this.firebaseService.getLobbies().subscribe(res => {
        this.loadedLobbies = res;
  });
  }

  removeLobby(id) {
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
