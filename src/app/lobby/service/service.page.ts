import {Component, Injectable, OnInit} from '@angular/core';
import {LobbyModel} from '../lobby.model';
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-service',
  templateUrl: './service.page.html',
  styleUrls: ['./service.page.scss'],
})
export class ServicePage implements OnInit {
  lobbies: LobbyModel[] = [
      new LobbyModel('one', 'lobbyone', 'password', 'test lobby', 10),
      new LobbyModel('two', 'lobbytwo', 'password', 'test lobby 2', 10)
  ];
  constructor() { }
  getLobbies() {
    return [...this.lobbies];
  }

  ngOnInit() {
  }

}
