import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-user-add-songs',
  templateUrl: './user-add-songs.component.html',
  styleUrls: ['./user-add-songs.component.scss'],
})
export class UserAddSongsComponent implements OnInit {
  @Input() song: string[];
  @Input() lobbyPlaylist: string[];
  newLobbyPlaylist: string[];
  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {

  }

  addToPlaylist(lobbyPlaylist, idToAdd: string) {
    this.newLobbyPlaylist = lobbyPlaylist;
    const temp = idToAdd;
    this.lobbyPlaylist.push(temp);
    // lobbyPlaylist.push(idToAdd);
    return this.lobbyPlaylist;
  }

}
