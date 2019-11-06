import {Injectable, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CreateLobbyPage } from './create-lobby.page';

const routes: Routes = [
  {
    path: '',
    component: CreateLobbyPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CreateLobbyPage]
})
export class CreateLobbyPageModule {}
