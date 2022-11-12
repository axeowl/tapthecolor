import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { interval } from 'rxjs';
import { Storage } from '@ionic/storage-angular'; 
import { MetatagService } from '../services/metatag.service';

@Component({
  selector: 'app-matrixhome',
  templateUrl: './matrixhome.page.html',
  styleUrls: ['./matrixhome.page.scss'],
})
export class MatrixhomePage implements OnInit {

  ROW = 3;
  COL = 3;
  MATRIX_TIMEOUT = 4500;
  START_MATRIX_TIMEOUT = 4500;
  MIN_MATRIX_TIMEOUT = 2500;
  gameMatrix: any = [[]];
  points = 0;
  localScore: number;
  colors = [["#DB3937","red"],
            ["#FECC2F","yellow"],
            ["#B2C224","green"],
            ["#40A4D8","blue"],
            ["#A364D9","violet"],
            ["#EE6579","pink"],
            ["#000000","black"]];
  countCorrectCells = 0;
  colorIndex = 2;
  neutral = "#8E8E8E";
  generatedCells = 0;
  probabilities = [0.15, 0.30, 0.55];
  modes = [0, 1, 2];
  backbutton;
  timeout;
  interval;
  progress = 0;

  constructor(private router: Router, 
    private storage: Storage,
    private meta: MetatagService,
    private platform: Platform) {
      this.storage.create();
      this.storage.get('score').then((val) => {
      if(val == undefined)
      this.localScore = 0;
      else
      this.localScore = val;
    });

}

  ngOnInit() {
    this.meta.setTitle('TapTheColor.com | Your game');

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

  ionViewWillEnter() {
    this.storage.set('lscore', 0);
    this.initializeGame();
  }

  initializeGame() {
    
    this.gameMatrix = [];

    clearInterval(this.interval)
    this.interval = setInterval(() => {
      this.progress += 0.01;
      if (this.progress > 1) {
        this.progress = 0;
      }
    }, this.MATRIX_TIMEOUT/100);

    for(let i=0; i<this.ROW; i++) {
      this.gameMatrix[i] = [];
      for(let j=0; j<this.COL; j++) {
        let isCorrect = this.getRandomValueOnRate();
        if(isCorrect == 1) {
          this.countCorrectCells++;
        }
        this.gameMatrix[i][j] = this.generateBall(i*10+j, isCorrect);
      }
    }

    this.timeout = window.setTimeout(() => {
      if(this.countCorrectCells != 0) {
        this.failed();
      }
      else {
        this.success();
        this.initializeGame();
      }
    }, this.MATRIX_TIMEOUT);
  }

  generateBall(id, mode) {
    this.generatedCells++;
    if(mode == 1) {
      let bgRndIndex = this.getRandomValue(0,this.colorIndex);
      let labelRndIndex = this.getRandomValue(0,this.colorIndex);
      while(bgRndIndex == labelRndIndex) {
        bgRndIndex = this.getRandomValue(0,this.colorIndex);
        labelRndIndex = this.getRandomValue(0,this.colorIndex);
      }
      return { "id": id, "show": 1, "bg": this.colors[bgRndIndex][0], "labelBg": this.colors[labelRndIndex][0], "label": this.colors[bgRndIndex][1], "correct": true, "popped": false, "clickable": true }
    }
    else if(mode == 0) {
      let bgRndIndex1 = this.getRandomValue(0,this.colorIndex);
      let labelRndIndex = this.getRandomValue(0,this.colorIndex);
      let bgRndIndex2 = this.getRandomValue(0,this.colorIndex);

      while(bgRndIndex1 == bgRndIndex2 || bgRndIndex1 == labelRndIndex) {
        bgRndIndex1 = this.getRandomValue(0,this.colorIndex);
        bgRndIndex2 = this.getRandomValue(0,this.colorIndex);
        labelRndIndex = this.getRandomValue(0,this.colorIndex);
      }
      return { "id": id, "show": 1, "bg": this.colors[bgRndIndex1][0], "labelBg": this.colors[bgRndIndex2][0], "label": this.colors[labelRndIndex][1], "correct": false, "popped": false, "clickable": true }
    }
    else {
      return { "id": id, "show": 0, "bg": this.neutral, "labelBg": this.neutral, "label": '', "correct": false, "popped": false, "clickable": false }
    }
  }

  getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  failed() {
    this.storage.get('score').then((val) => {
      console.log(val < this.points, this.points)
      if(val == undefined) {
        this.storage.set('score', this.points);
      }
      else if(val < this.points) {
        this.storage.set('score', this.points);
      }
    });
    this.storage.set('lscore', this.points);
    let navigationExtras: NavigationExtras = {
      queryParams: {
        special: JSON.stringify(this.points)
      }
    };
    this.router.navigate(["/stop"], navigationExtras);
  }

  pop(row, col) {
    let clickedCell = this.gameMatrix[row][col];
    if(clickedCell.clickable) {
      if(clickedCell.correct) {
        this.gameMatrix[row][col].show = 0;
        this.gameMatrix[row][col].bg = this.neutral;
        this.gameMatrix[row][col].clickable = false;
        this.gameMatrix[row][col].popped = true;
        this.countCorrectCells--;
        // if(this.countCorrectCells == 0) {
        //   window.clearTimeout(this.timeouts[0]);
        //   this.initializeGame();
        // }
      }
      else {
        this.failed();
      }
    }
    
  }

  success() {
    this.points++;
    if(this.colorIndex < this.colors.length && this.points %3 == 0){
      this.colorIndex++;
    }
    if(this.probabilities[0] <= 0.48) {
      this.probabilities[0] += 0.04;
    }
    if(this.probabilities[1] <= 0.42) {
      this.probabilities[1] += 0.04;
    }
    if(this.probabilities[2] >= 0.1) {
      this.probabilities[2] -= 0.08;
    }
    // let newtime = this.MATRIX_TIMEOUT - 2^(this.points);
    // this.MATRIX_TIMEOUT = this.MATRIX_TIMEOUT - newtime <= this.MIN_MATRIX_TIMEOUT ? this.MIN_MATRIX_TIMEOUT : this.MATRIX_TIMEOUT - newtime;
    this.MATRIX_TIMEOUT -= 100;
  }
  getRandomValueOnRate() {
    var num = Math.random(),
        s = 0,
        lastIndex = this.probabilities.length - 1;

    for (var i = 0; i < lastIndex; ++i) {
        s += this.probabilities[i];
        if (num < s) {
            return this.modes[i];
        }
    }

    return this.modes[lastIndex];
  }

  ionViewWillLeave() {
    window.clearTimeout(this.timeout);
    window.clearInterval(this.interval);
    this.points = 0;
    this.MATRIX_TIMEOUT = this.START_MATRIX_TIMEOUT;
    this.colorIndex = 2;
    this.generatedCells = 0;
    this.countCorrectCells = 0;
    this.probabilities = [0.15, 0.30, 0.55];
    this.platform.backButton.observers.push(this.backbutton);
    this.progress = 0;

  }

}
