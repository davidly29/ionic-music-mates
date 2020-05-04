/*
Author: David Lynch
Description: This class function is used to manage a users lobbies
 */
import {Component, Input, OnInit} from '@angular/core';
import {LobbyUserModel} from '../lobbyUserModel';
import {LobbyModel} from '../../lobby.model';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-lobby-manager',
  templateUrl: './lobby-manager.component.html',
  styleUrls: ['./lobby-manager.component.scss'],
})
export class LobbyManagerComponent implements OnInit {
  @Input() currentUser: LobbyUserModel;
  @Input() usersLobby: LobbyModel;
  @Input() userLobbies: LobbyModel[];
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  onCancel() {
    this.modalCtrl.dismiss();
  }

}
