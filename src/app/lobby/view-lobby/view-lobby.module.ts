import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ViewLobbyPage } from './view-lobby.page';
import { AutosizeModule} from 'ngx-autosize';
import {ViewUserModalComponent} from './view-user-modal/view-user-modal.component';
import {PasswordCheckComponent} from './password-check/password-check.component';
import {AddPlaylistLobbyComponent} from './add-playlist-lobby/add-playlist-lobby.component';
import {BleDeviceScanComponent} from './ble-device-scan/ble-device-scan.component';
import {ShowLobbySongsModalComponent} from './show-lobby-songs-modal/show-lobby-songs-modal.component';
import {PlaylistAddingComponent} from './playlist-adding/playlist-adding.component';
import {SongToLobbyComponent} from './song-to-lobby/song-to-lobby.component';

const routes: Routes = [
  {
    path: '',
    component: ViewLobbyPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    AutosizeModule
  ],
  // tslint:disable-next-line:max-line-length
  declarations: [ViewLobbyPage, ViewUserModalComponent, AddPlaylistLobbyComponent, BleDeviceScanComponent, ShowLobbySongsModalComponent, PlaylistAddingComponent,
    SongToLobbyComponent],
  // tslint:disable-next-line:max-line-length
  entryComponents: [ViewUserModalComponent, AddPlaylistLobbyComponent, BleDeviceScanComponent, ShowLobbySongsModalComponent, PlaylistAddingComponent,
    SongToLobbyComponent]
})
export class ViewLobbyPageModule {}
