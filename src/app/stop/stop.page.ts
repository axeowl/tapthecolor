import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SocialsharingService } from '../services/socialsharing.service';


@Component({
  selector: 'app-stop',
  templateUrl: './stop.page.html',
  styleUrls: ['./stop.page.scss'],
})
export class StopPage implements OnInit {

  subscription;
  points = 0;

  constructor(private platform:Platform,
              public socialSharing: SocialsharingService) { 

  }

  ngOnInit() {
  }

}
