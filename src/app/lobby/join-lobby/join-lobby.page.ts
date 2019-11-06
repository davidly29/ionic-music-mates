import { Component, OnInit } from '@angular/core';
import {ServicePage} from '../service/service.page';
import {LobbyModel} from '../lobby.model';

@Component({
  selector: 'app-join-lobby',
  templateUrl: './join-lobby.page.html',
  styleUrls: ['./join-lobby.page.scss'],
})
export class JoinLobbyPage implements OnInit {
  loadedLobbies: LobbyModel[];
  constructor(private lobbyService: ServicePage) { }

  ngOnInit() {
  this.loadedLobbies = this.lobbyService.lobbies;
  }

}
