import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SongsAddingPage } from './songs-adding.page';

const routes: Routes = [
  {
    path: '',
    component: SongsAddingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SongsAddingPage]
})
export class SongsAddingPageModule {}
