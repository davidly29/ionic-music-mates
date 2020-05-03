import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PlaylistPage } from './playlist.page';
import {FirebaseServiceService} from '../firebase-service.service';
import {PlaylistOptionsComponent} from '../lobby/join-lobby/playlist-options/playlist-options.component';

const routes: Routes = [
  {
    path: '',
    component: PlaylistPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PlaylistPage, PlaylistOptionsComponent],
  entryComponents: [PlaylistOptionsComponent]
})
export class PlaylistPageModule {}
