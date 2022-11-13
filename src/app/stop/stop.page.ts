import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SocialsharingService } from '../services/socialsharing.service';
import { MetatagService } from '../services/metatag.service';
import { Storage } from '@ionic/storage-angular'; 
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-stop',
  templateUrl: './stop.page.html',
  styleUrls: ['./stop.page.scss'],
})
export class StopPage implements OnInit {

  subscription;
  points = 0;
  bestScore;
  localScore = 0;
  constructor(private platform:Platform,
              public socialSharing: SocialsharingService,
              private meta: MetatagService,
              private storage: Storage,
              private activatedRoute: ActivatedRoute) { 
                this.storage.create();

                
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.special) {
        this.localScore = JSON.parse(params.special);
      }
    });
    this.storage.get('score').then((val) => {
      if(val == undefined)
        this.bestScore = 0;
      else
        this.bestScore = val;
    });
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
