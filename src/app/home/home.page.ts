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
  MAX_DIS = 9000;
  MIN_APP = 4000;
  MAX_APP = 6000;
  gameMatrix: any;
  points = 0;
  localScore: number;
  colors = [["#FECC2F","yellow"],
            ["#B2C225","green"],
            ["#40A4D8","blue"]];
  neutral = "#8E8E8E";

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
        let isCorrect = this.getRandomValue(0,2)
        let content = this.generateBall(isCorrect)
        this.gameMatrix[i][j] = { "id": i*10+j, "show": 1, "time": startTime, "bg": content[0], "labelBg": content[1], "label": content[2], "correct": isCorrect, "popped": false }
        this.gameMatrix[i][j]["timeout"] = window.setTimeout(() => {
          this.gameMatrix[i][j].show = 0;
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
      let isCorrect = this.getRandomValue(0,2)
      let content = this.generateBall(isCorrect)
      this.gameMatrix[row][col] = { "id": row*10+col, "show": 1, "time": startTime, "bg": content[0], "labelBg": content[1], "label": content[2], "correct": isCorrect, "popped": false }
      this.gameMatrix[row][col]["timeout"] = window.setTimeout(() => {
        this.gameMatrix[row][col].show = 0;
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

  pop(row, col) {
    let clickedCell = this.gameMatrix[row][col];
    if(clickedCell.correct) {
      this.gameMatrix[row][col].show = 0;
      this.gameMatrix[row][col].bg = this.neutral;
      this.gameMatrix[row][col].popped = true;
      this.refillCell(row, col);
      this.points++;
    }
    else {
      this.failed();
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

  generateBall(isCorrect) {
    if(isCorrect) {
      let bgRndIndex = this.getRandomValue(0,this.colors.length);
      let labelRndIndex = this.getRandomValue(0,this.colors.length);
      while(bgRndIndex == labelRndIndex) {
        bgRndIndex = this.getRandomValue(0,this.colors.length);
        labelRndIndex = this.getRandomValue(0,this.colors.length);
      }
      return [this.colors[bgRndIndex][0], this.colors[labelRndIndex][0], this.colors[bgRndIndex][1]]
    }
    else {
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
      return [this.colors[bgRndIndex1][0], this.colors[bgRndIndex2][0], this.colors[labelRndIndex][1]]
    }
  }

}
