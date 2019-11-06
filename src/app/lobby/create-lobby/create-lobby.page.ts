import { Component, OnInit } from '@angular/core';
import {FirebaseServiceService} from '../../firebase-service.service';
import {LobbyModel} from '../lobby.model';
import {ToastController} from '@ionic/angular';

@Component({
  selector: 'app-create-lobby',
  templateUrl: './create-lobby.page.html',
  styleUrls: ['./create-lobby.page.scss'],
})
export class CreateLobbyPage implements OnInit {
  lobby: LobbyModel;

  constructor(private dbService: FirebaseServiceService, public toastController: ToastController) {

  }

  saveLobby() {
    this.dbService.addLobby(this.lobby).then(r => this.toastController.dismiss());
  }

  ngOnInit() {
  }

}
