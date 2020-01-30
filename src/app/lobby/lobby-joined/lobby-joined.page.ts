import { Component, OnInit } from '@angular/core';
import {LobbyModel} from '../lobby.model';
import {User} from '../../auth/user.model';

@Component({
  selector: 'app-lobby-joined',
  templateUrl: './lobby-joined.page.html',
  styleUrls: ['./lobby-joined.page.scss'],
})
export class LobbyJoinedPage implements OnInit {
  usersInLobby: User[];
  constructor() { }

  ngOnInit() {
  }
  getUsersInLobby() {
  }

}
