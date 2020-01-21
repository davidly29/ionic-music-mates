import {Component, Injectable, OnInit} from '@angular/core';
import {LobbyModel} from '../lobby.model';
import {FirebaseServiceService} from '../../firebase-service.service';
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-service',
  templateUrl: './service.page.html',
  styleUrls: ['./service.page.scss'],
})
export class ServicePage implements OnInit {
  lobbies: LobbyModel[];
  constructor(private firebaseService: FirebaseServiceService) { }

  ngOnInit() {
    this.firebaseService.getLobbies().subscribe(res => {
      this.lobbies = res;
    });
  }

  getLobbies() {
    return [...this.lobbies];
  }

  getLobby(lobbyId: string) {
    return this.lobbies.find(lobby => {
      return lobby.id === lobbyId;
    });
  }

}
