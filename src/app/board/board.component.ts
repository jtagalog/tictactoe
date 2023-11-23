import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, map } from 'rxjs/operators';

import { IConfigService } from '../interfaces/config.service';
import { MatchService } from '../services/match.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy {
  constructor(
    private config: IConfigService,
    private match: MatchService) {}
  
  gameType: 'beginner' | 'pro' | 'hybrid' = 'beginner';
  squares: any[] = Array(0).fill(null);
  disabled: boolean = false;

  private firstMove: 'home' | 'visitor' = 'home';
  private move: number = 0;
  private roundStarted: boolean = false;

  private get value(): 'X' | 'O' {
    return (this.move % 2 === 0) ? 'X': 'O';
  }

  ngOnDestroy(): void {
    this.match.firstMove$.complete();
    this.match.teamTurn$.complete();
    this.match.roundWinner$.complete();
  }

  ngOnInit(): void {
    this.gameType = this.config.getGameType();

    this.match.firstMove$.pipe(
      filter(n => n > -1),
      map(n => n > 0.5 ? 'home' : 'visitor')
    ).subscribe(x => {
      this.firstMove = x;
    });

    this.newRound();
  }

  newRound(): void {
    const size = this.gameType === 'beginner' ? 9 : 16;

    this.squares = Array(size).fill(null);
    this.move = 0;
    this.roundStarted = true;

    this.match.firstMove$.next(Math.random());
    this.match.teamTurn$.next(this.getPlayer('X'));
    // resets the squares' win-cell style
    this.match.roundWinner$.next({roundWinner: ''})
  }

  makeMove(idx: number): void {
    if(!this.roundStarted) {
      return;
    }

    if(!this.squares[idx]) {
      this.squares.splice(idx, 1, this.value);
      this.move++;

      // next team
      this.match.teamTurn$.next(this.getPlayer(this.value === 'X' ? 'X': 'O'))
    }

    const winLine = this.calculateWinner();

    if (winLine !== null) {
      this.roundStarted = false;
      this.match.teamTurn$.next('');
      this.match.roundWinner$.next({
        roundWinner: this.getPlayer(this.squares[winLine[0]]),
        winLine: winLine
      });
    }
  }

  declareWinner(event: any): void {
    this.disabled = true;
  }

  private getPlayer(value: 'X' | 'O'): 'home' | 'visitor' {
    if (value === 'X') {
      return this.firstMove;
    }

    return this.firstMove === 'home' ? 'visitor' : 'home';
  }

  private calculateWinner(): any {
    switch(this.gameType) {
      case 'beginner': {
        return this.calculateInBeginner([
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8],
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
          [0, 4, 8],
          [2, 4, 6]
        ]);
      } case 'pro': {
        return this.calculateInPro([
          [0, 1, 2, 3],
          [4, 5, 6, 7],
          [8, 9, 10, 11],
          [12, 13, 14, 15],
          [0, 4, 8, 12],
          [1, 5, 9, 13],
          [2, 6, 10, 14],
          [3, 7, 11, 15],
          [0, 5, 10, 15],
          [3, 6, 9, 12],
        ]);
      } case 'hybrid': {
        return this.calculateInHybrid([
          [0, 1, 2, 3],
          [4, 5, 6, 7],
          [8, 9, 10, 11],
          [12, 13, 14, 15],
          [0, 4, 8, 12],
          [1, 5, 9, 13],
          [2, 6, 10, 14],
          [3, 7, 11, 15],
          [0, 5, 10, 15],
          [3, 6, 9, 12],
        ], 
        [
          [2, 5, 8],
          [1, 6, 11],
          [7, 10, 13],
          [4, 9, 14]
        ]);
      }
    }
  }

  private calculateInBeginner(lines: number[][]): any {
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        this.squares[a] &&
        this.squares[a] === this.squares[b] &&
        this.squares[a] === this.squares[c]
      ) {
        return lines[i];
      }
    }

    return null;
  }

  private calculateInPro(lines: number[][]): any {
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c, d] = lines[i];
      if (
        this.squares[a] &&
        this.squares[a] === this.squares[b] &&
        this.squares[a] === this.squares[c] &&
        this.squares[a] === this.squares[d]
      ) {
        return lines[i];
      }
    }

    return null;
  }

  private calculateInHybrid(proLines: number[][], additionalLines: number[][]): any {
    let wLine = this.calculateInBeginner(additionalLines);

    if (wLine === null) {
      wLine = this.calculateInPro(proLines);
    }

    return wLine;
  }
}
