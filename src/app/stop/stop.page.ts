import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SocialsharingService } from '../services/socialsharing.service';
import { MetatagService } from '../services/metatag.service';

@Component({
  selector: 'app-stop',
  templateUrl: './stop.page.html',
  styleUrls: ['./stop.page.scss'],
})
export class StopPage implements OnInit {

  subscription;
  points = 0;

  constructor(private platform:Platform,
              public socialSharing: SocialsharingService,
              private meta: MetatagService) { 
              
              
  }

  ngOnInit() {
    this.meta.setTitle('TapTheColor.com | Your Score');

    this.meta.updateMeta(
      'description',
      'Test your attention matching the right colors and backgrounds and challenge your friends!'
    );

    this.meta.setSocialTag(
      'Home',
      'Test your attention matching the right colors and backgrounds and challenge your friends!',
      'assets/logo.png',
      '',
      true
    );
  }

}
