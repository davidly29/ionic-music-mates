import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PlaySongPage } from './play-song.page';
import {ModalPlayComponent} from './modal-play/modal-play.component';

const routes: Routes = [
  {
    path: '',
    component: PlaySongPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PlaySongPage]
})
export class PlaySongPageModule {}
