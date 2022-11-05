import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-stop',
  templateUrl: './stop.page.html',
  styleUrls: ['./stop.page.scss'],
})
export class StopPage implements OnInit {

  subscription;

  constructor(private platform:Platform) { }

  ngOnInit() {
  }

}
