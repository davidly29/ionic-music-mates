import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ServicePageModule} from '../service/service.module';
import {LobbyModel} from '../lobby.model';
import {FirebaseServiceService} from '../../firebase-service.service';
import {Observable} from 'rxjs';
import {LobbyServiceService} from '../lobby-service.service';
import {ToastController} from '@ionic/angular';

@Component({
  selector: 'app-view-lobby',
  templateUrl: './view-lobby.page.html',
  styleUrls: ['./view-lobby.page.scss'],
})
export class ViewLobbyPage implements OnInit {
  loadedLobby: LobbyModel;
  allLobbies: LobbyModel[];
  tempLobby: LobbyModel = {
    name: '',
    description: '',
    id: '',
    password: '',
    allowedUsers: 0
  };

  constructor(private activatedRoute: ActivatedRoute, private lobbyService: LobbyServiceService,
              private firebaseService: FirebaseServiceService, private toastCtrl: ToastController) { }

  ngOnInit() {
    this.firebaseService.getLobbies().subscribe(res => {
      this.allLobbies = res;
      console.log(this.allLobbies);
    });

    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        // redirect
        return;
      }
      const id = this.activatedRoute.snapshot.paramMap.get('id');
      this.firebaseService.getLobby(id).subscribe(tempLobby => {
        this.tempLobby = tempLobby;
      });
      // this.loadedLobby = this.allLobbies.find(i => i.id === id);
      // this.loadedLobby = this.allLobbies[0];
    });

  }

  showToast(msg) {
    this.toastCtrl.create({
      message: msg,
      duration: 2000
    }).then(toast => toast.present());
  }

}
