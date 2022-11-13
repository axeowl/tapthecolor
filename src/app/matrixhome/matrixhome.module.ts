import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MatrixhomePageRoutingModule } from './matrixhome-routing.module';

import { IonicStorageModule } from '@ionic/storage-angular';
import { MatrixhomePage } from './matrixhome.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatrixhomePageRoutingModule,
    IonicStorageModule.forRoot()
  ],
  declarations: [MatrixhomePage]
})
export class MatrixhomePageModule {}
