import { Injectable } from '@angular/core';
import {FirebaseServiceService} from '../firebase-service.service';
import {LobbyModel} from './lobby.model';

@Injectable({
  providedIn: 'root'
})
export class LobbyServiceService {
  lobbies: LobbyModel[] = [
    {
      id: 'one',
      name: 'hello',
      password: 'test',
      description: 'testing',
      allowedUsers: 2
    },
  ];
  constructor(private firebaseService: FirebaseServiceService) { }

  getLobbies() {
    this.firebaseService.getLobbies().subscribe(res => {
      this.lobbies = res;
    });
    return this.lobbies;
  }

  getLobby(lobbyId: string) {
      return {...this.lobbies.find(lobby => {
      return lobby.id === lobbyId;
    })};
  }
}
