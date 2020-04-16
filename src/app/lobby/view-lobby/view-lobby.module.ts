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
  declarations: [ViewLobbyPage, ViewUserModalComponent, AddPlaylistLobbyComponent, BleDeviceScanComponent],
  entryComponents: [ViewUserModalComponent, AddPlaylistLobbyComponent, BleDeviceScanComponent]
})
export class ViewLobbyPageModule {}
