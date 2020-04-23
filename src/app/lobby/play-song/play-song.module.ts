import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PlaySongPage } from './play-song.page';
import {SongToPlaylistComponent} from '../../song-to-playlist/song-to-playlist.component';
import {ViewUserModalComponent} from '../view-lobby/view-user-modal/view-user-modal.component';

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
  declarations: [PlaySongPage, SongToPlaylistComponent],
  entryComponents: [SongToPlaylistComponent],
})
export class PlaySongPageModule {}
