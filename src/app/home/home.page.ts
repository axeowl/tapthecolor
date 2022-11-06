import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular'; 
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  ROW = 3;
  COL = 3;
  MIN_DIS = 7000;
  MAX_DIS = 7500;
  MIN_APP = 3000;
  MAX_APP = 3500;
  gameMatrix: any;
  points = 0;
  localScore: number;
  colors = [["#FECC2F","yellow"],
            ["#B2C225","green"],
            ["#40A4D8","blue"]];
  neutral = "#8E8E8E";
  probabilities = [0.3, 0.3, 0.4];
  modes = [0, 1, 2];

  constructor(private router: Router, 
              private storage: Storage) {


    this.storage.create();
    this.storage.get('score').then((val) => {
      if(val == undefined)
        this.localScore = 0;
      else
        this.localScore = val;
    });

  }

  ngOnInit() {
    this.initializeGame();
  }

  initializeGame() {
    this.gameMatrix = [];
    for(let i=0; i<this.ROW; i++) {
      this.gameMatrix[i] = [];
      for(let j=0; j<this.COL; j++) {
        let startTime = this.getRandomValue(this.MIN_DIS,this.MAX_DIS)
        let isCorrect = this.getRandomValueOnRate();
        this.gameMatrix[i][j] = this.generateBall(i*10+j, startTime, isCorrect)
        this.gameMatrix[i][j]["timeout"] = window.setTimeout(() => {
          this.gameMatrix[i][j].show = 0;
          this.gameMatrix[i][j].bg = this.neutral;
          this.gameMatrix[i][j].clickable = false;
          if(this.gameMatrix[i][j].correct && !this.gameMatrix[i][j].popped) {
            this.failed();
          }
          this.refillCell(i, j);
        }, startTime);
      }
    }
  }

  refillCell(row, col) {
    window.clearTimeout(this.gameMatrix[row][col].timeout);

    let startTime = this.getRandomValue(this.MIN_DIS,this.MAX_DIS)
    let refillTime = this.getRandomValue(this.MIN_APP,this.MAX_APP)

    window.setTimeout(() => {
      let isCorrect = this.getRandomValueOnRate();
      this.gameMatrix[row][col] = this.generateBall(row*10+col, startTime, isCorrect)
      this.gameMatrix[row][col]["timeout"] = window.setTimeout(() => {
        this.gameMatrix[row][col].show = 0;
        this.gameMatrix[row][col].bg = this.neutral;
        this.gameMatrix[row][col].clickable = false;
        if(this.gameMatrix[row][col].correct && !this.gameMatrix[row][col].popped) {
          this.failed();
        }
        this.refillCell(row, col);
      }, startTime);
    }, refillTime);
  }

  getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
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

  pop(row, col) {
    let clickedCell = this.gameMatrix[row][col];
    if(clickedCell.clickable) {
      if(clickedCell.correct) {
        this.gameMatrix[row][col].show = 0;
        this.gameMatrix[row][col].bg = this.neutral;
        this.gameMatrix[row][col].clickable = false;
        this.gameMatrix[row][col].popped = true;
        this.refillCell(row, col);
        this.increasePoint();
      }
      else {
        this.failed();
      }
    }
    
  }

  failed() {
    for(let i=0; i<this.ROW; i++) {
      for(let j=0; j<this.COL; j++) {
        window.clearTimeout(this.gameMatrix[i][j].timeout);
      }
    }
    this.storage.get('score').then((val) => {
      if(val < this.points) {
        this.storage.set('score', this.points);
      }
    });
    this.router.navigateByUrl("/stop")
  }

  generateBall(id, startTime, mode) {
    if(mode == 1) {
      let bgRndIndex = this.getRandomValue(0,this.colors.length);
      let labelRndIndex = this.getRandomValue(0,this.colors.length);
      while(bgRndIndex == labelRndIndex) {
        bgRndIndex = this.getRandomValue(0,this.colors.length);
        labelRndIndex = this.getRandomValue(0,this.colors.length);
      }
      console.log("Correct", id, this.colors[bgRndIndex][0], this.colors[labelRndIndex][0], this.colors[bgRndIndex][1]);
      return { "id": id, "show": 1, "time": startTime, "bg": this.colors[bgRndIndex][0], "labelBg": this.colors[labelRndIndex][0], "label": this.colors[bgRndIndex][1], "correct": true, "popped": false, "clickable": true }
    }
    else if(mode == 0) {
      let bgRndIndex1 = this.getRandomValue(0,this.colors.length);
      let labelRndIndex = this.getRandomValue(0,this.colors.length);
      let bgRndIndex2 = this.getRandomValue(0,this.colors.length);

      while(bgRndIndex1 == bgRndIndex2) {
        bgRndIndex1 = this.getRandomValue(0,this.colors.length);
        bgRndIndex2 = this.getRandomValue(0,this.colors.length);
      }
      while(bgRndIndex1 == labelRndIndex) {
        bgRndIndex1 = this.getRandomValue(0,this.colors.length);
        labelRndIndex = this.getRandomValue(0,this.colors.length);
      }
      console.log("Not correct", id, this.colors[bgRndIndex1][0], this.colors[bgRndIndex2][0], this.colors[labelRndIndex][1]);
      return { "id": id, "show": 1, "time": startTime, "bg": this.colors[bgRndIndex1][0], "labelBg": this.colors[bgRndIndex2][0], "label": this.colors[labelRndIndex][1], "correct": false, "popped": false, "clickable": true }
    }
    else {
      return { "id": id, "show": 0, "time": startTime, "bg": this.neutral, "labelBg": this.neutral, "label": '', "correct": false, "popped": false, "clickable": false }
    }
  }

  increasePoint() {
    this.points++;
    if(this.points%5 == 0) {
      this.MAX_APP = this.MAX_APP - this.MAX_APP/10;
      this.MIN_APP = this.MIN_APP - this.MIN_APP/10;
      this.MAX_DIS = this.MAX_DIS - this.MAX_DIS/10;
      this.MIN_DIS = this.MIN_DIS - this.MIN_DIS/10;
      if(this.probabilities[0] <= 0.5) {
        this.probabilities[0] += 0.05;
      }
      if(this.probabilities[1] <= 0.5) {
        this.probabilities[1] += 0.05;
      }
      if(this.probabilities[2] > 0) {
        this.probabilities[2] -= 0.05;
      }
    }
  }

}
