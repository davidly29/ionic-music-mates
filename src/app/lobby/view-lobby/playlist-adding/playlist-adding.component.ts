import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../../auth/auth.service';
import {FirebaseServiceService} from '../../../firebase-service.service';
import {PlaylistModel} from '../../../playlist/PlaylistModel';
import {AlertController, ModalController} from '@ionic/angular';
import {LobbyModel} from '../../lobby.model';

@Component({
  selector: 'app-playlist-adding',
  templateUrl: './playlist-adding.component.html',
  styleUrls: ['./playlist-adding.component.scss'],
})
export class PlaylistAddingComponent implements OnInit {
  play: PlaylistModel = {
    userId: 'test',
    songs: [] = [],
    name: '',
    username: '',
  };
  allPlaylists: PlaylistModel[] = [];
  @Input() currentLobby: LobbyModel;
  // tslint:disable-next-line:max-line-length
  constructor(private authService: AuthService, private firebaseService: FirebaseServiceService, private alertCtrl: AlertController,  private modalCtrl: ModalController) { }

  ngOnInit() {
    this.firebaseService.getPlaylists().subscribe(data => {
      this.allPlaylists = data;
    });
    this.firebaseService.addPlaylist(this.play);
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.allPlaylists.length; i++) {
      // tslint:disable-next-line:no-conditional-assignment
      if (this.allPlaylists[i].userId === 'test') {
        this.firebaseService.deletePlaylist(this.allPlaylists[i].id);
      }
    }
  }
  async showPlaylistAlert(item: PlaylistModel) {
    const alert = await this.alertCtrl.create({
      header: 'Playlist Already Loaded',
      subHeader: 'There is already a loaded playlist',
      message: 'would you like to remove this playlist and load your own ?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
            this.alertCtrl.dismiss();
          }
        },
        {
          text: 'Override Playlist',
          handler: data => {
            this.loadSongs(item);
          }
        }
      ]
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    console.log(result);
  }
  loadSongs(item: PlaylistModel) {
    this.currentLobby.songs = item.songs;
    this.firebaseService.updateLobby(this.currentLobby, this.currentLobby.id);
    this.dismiss();
  }

  check(item: PlaylistModel) {
    if (this.currentLobby.songs.length > 0) {
      this.showPlaylistAlert(item).then(console.log);
    } else {
      this.loadSongs(item);
    }
  }
  dismiss() {
    this.modalCtrl.dismiss();
  }
}
