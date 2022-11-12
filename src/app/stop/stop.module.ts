import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StopPageRoutingModule } from './stop-routing.module';
import { StopPage } from './stop.page';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { IonicStorageModule } from '@ionic/storage-angular';

import { AdsenseModule } from 'ng2-adsense';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StopPageRoutingModule,
    IonicStorageModule.forRoot(),
    AdsenseModule.forRoot({
      adClient: 'ca-pub-9488590203218211',
      adSlot: 3053364783,
      adFormat: 'auto',
      fullWidthResponsive: true
    }),
    ShareButtonsModule.withConfig({
      debug: true,
    }),
    ShareIconsModule
  ],
  declarations: [StopPage]
})
export class StopPageModule {}
