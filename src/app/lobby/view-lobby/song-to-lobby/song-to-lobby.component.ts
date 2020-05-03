import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../../auth/auth.service';
import {FirebaseServiceService} from '../../../firebase-service.service';
import {ToastController} from '@ionic/angular';
import {SongModel} from '../../song.model';
import {LobbyModel} from '../../lobby.model';
import {PlaylistModel} from '../../../playlist/PlaylistModel';

@Component({
  selector: 'app-song-to-lobby',
  templateUrl: './song-to-lobby.component.html',
  styleUrls: ['./song-to-lobby.component.scss'],
})
export class SongToLobbyComponent implements OnInit {
  @Input() lobby: LobbyModel;
  playlists: PlaylistModel[] = [];

  songList: SongModel[] = [];
  // tslint:disable-next-line:max-line-length
  constructor(private authService: AuthService, private firebaseService: FirebaseServiceService, private toastController: ToastController) { }

  ngOnInit() {
    this.firebaseService.getPlaylists().subscribe(res => {
      this.playlists = res;
    });
  }
  getPlaylist() {
    this.firebaseService.getPlaylists().subscribe(res => {
      this.playlists = res;
    });
    return this.playlists;
  }
  addToLobby(item: SongModel) {
    this.lobby.songs = this.songList;
    this.songList.push(item);

    this.lobby.songs = this.songList;

    this.firebaseService.updateLobby(this.lobby, this.lobby.id).then(console.log);
    this.toastController.create({
      message: 'Song Added !',
      position: 'bottom',
      duration: 5000
    }).then((obj) => {
      obj.present();
    });
  }

}
