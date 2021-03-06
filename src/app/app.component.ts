import { Component, OnInit } from '@angular/core';
import { AlgorithmService } from './services/algorithm.service';
import { Process } from 'src/model/algorithm';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'demoOS';

  resultArray: Array<any> = [
    ['Name', 'State', 'From', 'To'],
  ];
  chosenAlgo = 'RR';
  public chart: any = {
    chartType: 'Timeline',
    dataTable: this.resultArray,
  };

  // correct
  // arriveTime = [0, 1, 2];
  // cpu = [[3, 3], [1, 1], [2, 3]];
  // io = [[2], [2], [3]];

  // unconfirmed
  // arriveTime = [0, 0, 0];
  // cpu = [[1, 1, 1, 1, 1], [2, 2, 3], [13, 2]];
  // io = [[4, 4, 4, 4], [7, 7], [6]];

  // Correct
  // arriveTime = [0, 1, 2];
  // cpu = [[3, 3], [2, 2], [1, 5]];
  // io = [[4], [2], [1]];

  phases: Array<string> = [];
  arriveTime: Array<number> = [];
  cpu: Array<Array<number>> = [];
  io: Array<Array<number>> = [];

  // input data
  inputFlag = false;
  buttonFlag = true;
  numOfProcess: number;
  flagChart = false;
  flagRun = false;
  constructor(
    public algorithm: AlgorithmService
  ) {}

  ngOnInit() {
  }

  run() {
    let procList = new Array<Process>();
    procList = this.algorithm.initProcess(this.phases, this.arriveTime, this.cpu, this.io);
    const tempArray = this.algorithm.runAlgo(procList, this.phases, this.io, this.arriveTime, this.chosenAlgo);
    tempArray.forEach(i => {
      this.resultArray.push(i);
    });

    this.flagChart = true;
  }

  confirmNOP() {
    if (this.buttonFlag) {
      for (let i = 0; i < this.numOfProcess; i++) {
        this.phases[i] = 'P' + (i + 1).toString();
        this.cpu.push([]);
        this.io.push([]);
      }
      this.buttonFlag = false;
    }
  }
  // add process
  add() {
    this.phases.push('P' + (this.phases.length + 1).toString());
    this.cpu.push([]);
    this.io.push([]);
  }

  // minus process
  minus() {
    this.phases.pop();
    this.cpu.pop();
    this.io.pop();
  }

  save() {
    for (let i = 0; i < this.cpu.length; i++) {
      this.cpu[i] = this.transformData(this.cpu[i]);
      this.io[i] = this.transformData(this.io[i]);
    }
    this.flagRun = true;
  }

  transformData(value: any) {
    const result = value.split`,`.map(x => +x);
    return result;
  }
}
