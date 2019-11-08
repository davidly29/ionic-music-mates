import { Component, OnInit } from '@angular/core';
import {FirebaseServiceService} from '../../firebase-service.service';
import {LobbyModel} from '../lobby.model';
import {ToastController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-create-lobby',
  templateUrl: './create-lobby.page.html',
  styleUrls: ['./create-lobby.page.scss'],
})
export class CreateLobbyPage implements OnInit {
  lobby: LobbyModel = {
    id: 'one',
    name: 'test',
    password: 'pass',
    description: 'desc',
    allowedUsers: 2
  };
  lobbyId = null;
  constructor(private dbService: FirebaseServiceService, public toastController: ToastController, private route: ActivatedRoute) {

  }

  saveLobby() {
    this.dbService.addLobby(this.lobby).then(r => this.toastController.dismiss());
  }
  ngOnInit() {
    this.lobbyId = this.route.snapshot.params.id;
  }

}
