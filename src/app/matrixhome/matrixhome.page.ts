import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { interval } from 'rxjs';
import { Storage } from '@ionic/storage-angular'; 
import { MetatagService } from '../services/metatag.service';
import { CookieService } from '../services/cookie.service';

@Component({
  selector: 'app-matrixhome',
  templateUrl: './matrixhome.page.html',
  styleUrls: ['./matrixhome.page.scss'],
})
export class MatrixhomePage implements OnInit {

  ROW = 3;
  COL = 3;
  MATRIX_TIMEOUT = 4000;
  START_MATRIX_TIMEOUT = 4000;
  MIN_MATRIX_TIMEOUT = 2500;
  gameMatrix: any = [[]];
  points = 0;
  localScore: number;
  colors = [["#DB3937","rosso"],
            ["#FECC2F","giallo"],
            ["#B2C224","verde"],
            ["#40A4D8","blu"],
            ["#A364D9","viola"],
            ["#EE6579","rosa"],
            ["#000000","nero"]];
  countCorrectCells = 0;
  colorIndex = 2;
  neutral = "#8E8E8E";
  generatedCells = 0;
  probabilities = [0.15, 0.30, 0.55];
  quantities = [0, 0, 9];
  filledCells = 3;
  minFilledCells = 0;
  timeStep = 100;
  minTimeStep = 40;
  modes = [0, 1, 2];
  backbutton;
  timeout;
  interval;
  progress = 0;

  constructor(private router: Router, 
    private storage: Storage,
    private meta: MetatagService,
    private platform: Platform,
    private cookie: CookieService) {
      this.storage.create();
      // this.storage.get('score').then((val) => {
      // if(val == undefined)
      // this.localScore = 0;
      // else
      // this.localScore = val;
      // });
      // this.storage.get('score').then((val) => {
    //   if(val == undefined)
    //     this.localScore = 0;
    //   else
    //     this.localScore = val;
    // });

      let best = this.cookie.getCookie('best');
      if(best == null) {
        this.localScore = 0;
        this.cookie.setCookie('best', "0", 1000)
      } else {
        this.localScore = parseInt(best);
      }

  }

  ngOnInit() {
    this.meta.setTitle('TapTheColor.com | Fai il tuo gioco');

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
    this.quantities[1] = this.getRandomValue(this.minFilledCells+1,this.filledCells);
    this.quantities[0] = this.getRandomValue(this.minFilledCells,this.filledCells-this.quantities[1]);
    this.quantities[2] = 9 - this.quantities[0] + this.quantities[1];
    this.localScore = parseInt(this.cookie.getCookie('best'));
    this.storage.set('lscore', 0);
    this.initializeGame();
  }

  initializeGame() {
    
    this.countCorrectCells = this.quantities[1];
    this.gameMatrix = [];

    clearInterval(this.interval);
    clearTimeout(this.timeout);
    this.interval = setInterval(() => {
      this.progress += 0.01;
      if (this.progress > 1) {
        this.progress = 0;
      }
    }, (this.MATRIX_TIMEOUT)/100);

    for(let i=0; i<this.ROW; i++) {
      this.gameMatrix[i] = [];
      // for(let j=0; j<this.COL; j++) {
      //   let isCorrect = this.getRandomValueOnRate();
      //   if(isCorrect == 1) {
      //     this.countCorrectCells++;
      //   }
      //   this.gameMatrix[i][j] = this.generateBall(i*10+j, isCorrect);
      // }
    }

    let matrixIdx = [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]];
    for(let i = 0; i<this.quantities[0]; i++) {
      let rndIdx = this.getRandomValue(0,matrixIdx.length);
      let rndRow = matrixIdx[rndIdx][0];
      let rndCol = matrixIdx[rndIdx][1];
      matrixIdx.splice(rndIdx,1);
      this.gameMatrix[rndRow][rndCol] = this.generateBall(rndRow*10+rndCol, 0);
    }
    for(let i = 0; i<this.quantities[1]; i++) {
      let rndIdx = this.getRandomValue(0,matrixIdx.length);
      let rndRow = matrixIdx[rndIdx][0];
      let rndCol = matrixIdx[rndIdx][1];
      matrixIdx.splice(rndIdx,1);
      this.gameMatrix[rndRow][rndCol] = this.generateBall(rndRow*10+rndCol, 1);
    }
    for(let i = 0; i<matrixIdx.length; i++) {
      let rndRow = matrixIdx[i][0];
      let rndCol = matrixIdx[i][1];
      this.gameMatrix[rndRow][rndCol] = this.generateBall(rndRow*10+rndCol, 2);
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
    // this.storage.get('score').then((val) => {
    //   console.log(val < this.points, this.points)
    //   if(val == undefined) {
    //     this.storage.set('score', this.points);
    //   }
    //   else if(val < this.points) {
    //     this.storage.set('score', this.points);
    //   }
    // });

    let best = this.cookie.getCookie('best');
    if(parseInt(best) < this.points) {
      this.cookie.setCookie('best', this.points, 1000);
    }

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
    if(this.colorIndex < this.colors.length && this.points % 3 == 0){
      this.colorIndex++;
    }
    // if(this.points % 3 == 0) {
    //   if(this.probabilities[0] <= 0.48) {
    //     this.probabilities[0] += 0.01;
    //   }
    //   if(this.probabilities[1] <= 0.42) {
    //     this.probabilities[1] += 0.01;
    //   }
    //   if(this.probabilities[2] >= 0.1) {
    //     this.probabilities[2] -= 0.02;
    //   }
    // }
    if(this.points % 5 == 0) {
      if(this.minFilledCells < Math.floor(this.filledCells/2))
        this.minFilledCells++;
    }
    if(this.points % 2 == 0) {
      if(this.filledCells < 9)
        this.filledCells++;
      this.quantities[1] = this.getRandomValue(this.minFilledCells + 1,this.filledCells-1);
      this.quantities[0] = this.getRandomValue(this.minFilledCells,this.filledCells-this.quantities[1]);
      this.quantities[2] = 9 - this.quantities[0] + this.quantities[1];
    }
    
    if(this.MATRIX_TIMEOUT + this.timeStep > this.MIN_MATRIX_TIMEOUT) {
      this.MATRIX_TIMEOUT -= this.timeStep;
      if(this.timeStep + 10 > this.minTimeStep)
        this.timeStep -= 10;
    }
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
