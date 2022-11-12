import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SocialsharingService } from '../services/socialsharing.service';
import { MetatagService } from '../services/metatag.service';
import { Storage } from '@ionic/storage-angular'; 

@Component({
  selector: 'app-stop',
  templateUrl: './stop.page.html',
  styleUrls: ['./stop.page.scss'],
})
export class StopPage implements OnInit {

  subscription;
  points = 0;
  bestScore;
  localScore;
  constructor(private platform:Platform,
              public socialSharing: SocialsharingService,
              private meta: MetatagService,
              private storage: Storage) { 
                this.storage.create();
                this.storage.get('score').then((val) => {
                  if(val == undefined)
                    this.bestScore = 0;
                  else
                    this.bestScore = val;
                });
                this.storage.get('lscore').then((val) => {
                  if(val == undefined)
                    this.localScore = 0;
                  else
                    this.localScore = val;
                });
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
