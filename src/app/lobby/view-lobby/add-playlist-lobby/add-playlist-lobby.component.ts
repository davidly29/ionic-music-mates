import {Component, Input, OnInit} from '@angular/core';
import {LobbyModel} from '../../lobby.model';
import {ModalController} from '@ionic/angular';
import {FirebaseServiceService} from '../../../firebase-service.service';
import {AuthService} from '../../../auth/auth.service';
import {PlaylistModel} from '../../../playlist/PlaylistModel';

@Component({
  selector: 'app-add-playlist-lobby',
  templateUrl: './add-playlist-lobby.component.html',
  styleUrls: ['./add-playlist-lobby.component.scss'],
})
export class AddPlaylistLobbyComponent implements OnInit {
  @Input() lobby: LobbyModel;
  userPlaylist: PlaylistModel = {
    username: 'test',
    userId: 'test',
    name: 'test',
    id: 'test',
    songs: [] = [],
  };

  tempSongs = [];
  allPlaylists: PlaylistModel[];
  constructor(private  modalCtrl: ModalController, private firebaseService: FirebaseServiceService,  private authService: AuthService) { }

  ngOnInit() {
    this.firebaseService.getPlaylists().subscribe(res => {
          this.allPlaylists = res;
        }
    );

  }

  addPlaylistToLobby() {
    const temp = this.authService.user.getValue().id;
    if (this.allPlaylists.find(x => x.userId === temp) != null) {
      this.userPlaylist = this.allPlaylists.find(x => x.userId === temp);
    }
    this.lobby.songs = this.userPlaylist.songs;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.lobby.songs.length; i++) {
      this.tempSongs.push(this.lobby.songs[i].id);
    }
    this.firebaseService.updateLobby(this.lobby, this.lobby.id);
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }

}
