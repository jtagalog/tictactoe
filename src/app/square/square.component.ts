import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MatchService } from '../services/match.service';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.scss']
})
export class SquareComponent implements OnInit, OnDestroy {
  constructor(private match: MatchService) {}
  
  @Input() value: 'X' | 'O' = 'O';
  @Input() index: number = -1;

  winLine: any = null;

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.match.roundWinner$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(round => this.winLine = round.winLine);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
