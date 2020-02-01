import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ViewLobbyPage } from './view-lobby.page';
import { AutosizeModule} from 'ngx-autosize';

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
  declarations: [ViewLobbyPage]
})
export class ViewLobbyPageModule {}
