import {Component, Input, OnInit} from '@angular/core';
import {LobbyUserModel} from '../../join-lobby/lobbyUserModel';
import {ModalController} from '@ionic/angular';
import {LobbyModel} from '../../lobby.model';

@Component({
  selector: 'app-view-user-modal',
  templateUrl: './view-user-modal.component.html',
  styleUrls: ['./view-user-modal.component.scss'],
})
export class ViewUserModalComponent implements OnInit {
  @Input() joinedUsers: string[];
  @Input() lobbyId: string;
  constructor(private  modalCtrl: ModalController) { }

  ngOnInit() {}

  onCancel() {
    this.modalCtrl.dismiss();
  }
}
