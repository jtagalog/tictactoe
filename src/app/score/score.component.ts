import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs';
import { filter } from 'rxjs/operators';

import { MatchService } from '../services/match.service';
import { IConfigService } from '../interfaces/config.service';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss']
})
export class ScoreComponent implements OnInit {
  constructor(
    private config: IConfigService,
    private match: MatchService) {}

  @Output() matchEnded: EventEmitter<any> = new EventEmitter();

  private homeScore: number = 0;
  private visitorScore: number = 0;
  private matchResult: 'home' | 'visitor' | 'draw' | null = null;

  matchFormat: string = '';
  matchFormatStr: string = '';
  gameType: string = '';
  homeTeam: string = '';
  visitorTeam: string = '';
  teamTurn: string | null = null;

  get winner(): 'home' | 'visitor' | 'draw' | null {
    return this.matchResult;
  }

  get homeTeamScore(): number {
    return this.homeScore;
  }

  get visitorTeamScore(): number {
    return this.visitorScore;
  }

  ngOnInit(): void {
    this.matchFormat = this.config.getMatchFormat();
    this.matchFormatStr = this.getMatchFormatStr(this.matchFormat);
    this.gameType = this.config.getGameType().toUpperCase();
    this.homeTeam = this.config.getHomeTeam();
    this.visitorTeam = this.config.getVisitorTeam();

    this.match.roundWinner$.pipe(
      takeUntil(this.matchEnded),
      filter(round => round.roundWinner !== '')
    ).subscribe(round => {
      round.roundWinner === 'home' ? this.homeScore++ : this.visitorScore++;
      
      this.matchResult = this.calculateWinner();

      if(this.matchResult !== null) {
        this.matchEnded.emit(this.matchResult);
      }
    });

    this.match.teamTurn$.pipe(
      takeUntil(this.matchEnded),
    ).subscribe(team => this.teamTurn = team);
  }

  calculateWinner(): 'home' | 'visitor' | 'draw' | null {
    let maxWinGames: number = 0;

    switch(this.matchFormat) { 
      case 'bo1': { 
        maxWinGames = Math.round((1+1)/2); 
        break;
      } 
      case 'bo2': { 
        maxWinGames = Math.round((2+1)/2);
        break;  
      }
      case 'bo3': { 
        maxWinGames = Math.round((3+1)/2);  
        break;
      }
      case 'bo5': { 
        maxWinGames = Math.round((5+1)/2);  
        break;  
      }
      case 'bo7': { 
        maxWinGames = Math.round((6+1)/2);  
        break;  
      }
      default: {
        maxWinGames = -1
        break;
      }
    }

    if (this.homeScore === maxWinGames) {
      return 'home';
    } else if (this.visitorScore === maxWinGames) {
      return 'visitor';
    } else if (this.homeScore === this.visitorScore && (this.homeScore + this.visitorScore) === maxWinGames) {
      return this.matchFormat === 'bo2' ? 'draw' : null;
    }

    return null;
  }

  private getMatchFormatStr(format: string): string {
    switch(format) { 
      case 'bo1': { 
        return 'Best of 1'; 
      } 
      case 'bo2': { 
        return 'Best of 2';  
      }
      case 'bo3': { 
        return 'Best of 3';  
      }
      case 'bo5': { 
        return 'Best of 5';  
      }
      case 'bo7': { 
        return 'Best of 7';  
      }
      default: { 
        return 'Evergreen'; 
      } 
    }
  }
}
