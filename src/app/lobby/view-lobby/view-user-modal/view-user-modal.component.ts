import {Component, Input, OnInit} from '@angular/core';
import {LobbyUserModel} from '../../join-lobby/lobbyUserModel';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-view-user-modal',
  templateUrl: './view-user-modal.component.html',
  styleUrls: ['./view-user-modal.component.scss'],
})
export class ViewUserModalComponent implements OnInit {
  @Input() lobbyUsers: LobbyUserModel[];
  @Input() lobbyId: string;
  constructor(private  modalCtrl: ModalController) { }

  ngOnInit() {}

  onCancel() {
    this.modalCtrl.dismiss();
  }
}
