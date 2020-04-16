import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DeviceDetailsPage } from './device-details.page';
import {NgCircleProgressModule} from 'ng-circle-progress';

const routes: Routes = [
  {
    path: '',
    component: DeviceDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    NgCircleProgressModule
  ],
  declarations: [DeviceDetailsPage]
})
export class DeviceDetailsPageModule {}
