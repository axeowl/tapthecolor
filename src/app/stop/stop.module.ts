import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StopPageRoutingModule } from './stop-routing.module';

import { StopPage } from './stop.page';

import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StopPageRoutingModule,
    ShareButtonsModule.withConfig({
      debug: true,
    }),
    ShareIconsModule
  ],
  declarations: [StopPage]
})
export class StopPageModule {}
