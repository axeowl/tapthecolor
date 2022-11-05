import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { HomePageRoutingModule } from './home-routing.module';
import { IonicStorageModule } from '@ionic/storage-angular';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    TooltipModule.forRoot(),
    IonicStorageModule.forRoot()
  ],
  declarations: [HomePage],
})
export class HomePageModule {}
