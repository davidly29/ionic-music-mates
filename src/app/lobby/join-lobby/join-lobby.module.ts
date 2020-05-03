import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { JoinLobbyPage } from './join-lobby.page';
import {LobbyManagerComponent} from './lobby-manager/lobby-manager.component';

const routes: Routes = [
  {
    path: '',
    component: JoinLobbyPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [JoinLobbyPage, LobbyManagerComponent],
  entryComponents: [LobbyManagerComponent]
})
export class JoinLobbyPageModule {}
