import { Component, OnInit } from '@angular/core';
import { MetatagService } from '../services/metatag.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {

  constructor(private meta: MetatagService) { 
    
  }

  ngOnInit() {
    
    this.meta.setTitle('TapTheColor.com | Start');

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
