import { Component, OnInit } from '@angular/core';
import {FirebaseServiceService} from '../../firebase-service.service';
import {LobbyModel} from '../lobby.model';
import {ToastController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../auth/auth.service';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-create-lobby',
  templateUrl: './create-lobby.page.html',
  styleUrls: ['./create-lobby.page.scss'],
})
export class CreateLobbyPage implements OnInit {
  lobby: LobbyModel = {
    id: '',
    userId: 'one',
    name: 'test',
    password: 'pass',
    description: 'desc',
    allowedUsers: 2
  };
  lobbyId = null;
  constructor(private dbService: FirebaseServiceService, public toastController: ToastController, private route: ActivatedRoute,
              private authService: AuthService) {
  }

  saveLobby() {
    this.authService.userId.pipe(take(1)).subscribe(currentUserid => {
      this.lobby.userId = currentUserid;
      this.dbService.addLobby(this.lobby).then(r => this.toastController.dismiss());
    });
  }
  ngOnInit() {
    this.lobbyId = this.route.snapshot.params.id;
  }

}
