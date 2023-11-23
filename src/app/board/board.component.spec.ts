import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';

import { BoardComponent } from './board.component';
import { SquareComponent } from '../square/square.component';
import { ScoreComponent } from '../score/score.component';
import { MatchService } from '../services/match.service';
import { IConfigService } from '../interfaces/config.service';

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;
  let configService: IConfigService;
  let matchService: MatchService;
  let boardDe: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        BoardComponent, 
        SquareComponent, 
        ScoreComponent
      ],
      providers: [
        IConfigService,
        MatchService,
      ]
    });
    configService = TestBed.inject(IConfigService);
    matchService = TestBed.inject(MatchService);
    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    boardDe = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Gameplay', () => {
    beforeEach(() => {
      spyOn<IConfigService, any>(configService, 'getGameType').and.returnValue('beginner');
      spyOn<IConfigService, any>(configService, 'getMatchFormat').and.returnValue('bo2');
      fixture.detectChanges();
    });

    it('should declare visitor, with the first move, as the round winner', () => {
      matchService.roundWinner$.pipe(
        filter(round => round.roundWinner !== '')
      ).subscribe(round => expect(round.roundWinner).toBe('visitor'));

      matchService.firstMove$.next(0.2);

      component.makeMove(0);
      component.makeMove(8);
      component.makeMove(1);
      component.makeMove(7);
      component.makeMove(2);

      fixture.detectChanges();

      const winSquareElements = boardDe.queryAll(By.css('.win-cell'));
      expect(winSquareElements.length).toBe(3);
      expect(winSquareElements[0].nativeElement.textContent).toBe('X');
    });

    it('should be able to start a new round', () => {
      component.makeMove(0);

      const isNotNull = (val: any) => val != null;
      let arr = component.squares.filter(isNotNull);
      expect(arr.length).toBe(1);

      const newRoundBtnEl = boardDe.query(By.css('.btn-centered')).nativeElement;
      newRoundBtnEl.click();

      arr = component.squares.filter(isNotNull);
      expect(arr.length).toBe(0);
    });

    it('should be able to continue to the next round', () => {
      component.makeMove(0);
      component.makeMove(8);
      component.makeMove(1);
      component.makeMove(7);
      component.makeMove(2);

      fixture.detectChanges();

      const winSquareElements = boardDe.queryAll(By.css('.win-cell'));
      expect(winSquareElements.length).toBe(3);
      expect(winSquareElements[0].nativeElement.textContent).toBe('X');

      const newRoundBtnEl = boardDe.query(By.css('.btn-centered')).nativeElement;
      newRoundBtnEl.click();

      fixture.detectChanges();
      expect(boardDe.queryAll(By.css('.win-cell')).length).toBe(0);
    });

    it('should disable the new round button when match ended', () => {
      component.makeMove(0);
      component.makeMove(8);
      component.makeMove(1);
      component.makeMove(7);
      component.makeMove(2);

      const newRoundBtnEl = boardDe.query(By.css('.btn-centered')).nativeElement;
      newRoundBtnEl.click();

      component.makeMove(0);
      component.makeMove(8);
      component.makeMove(1);
      component.makeMove(7);
      component.makeMove(4);
      component.makeMove(6);

      fixture.detectChanges();

      expect(boardDe.query(By.css('.btn-centered')).nativeElement.disabled).toBeTrue();
    });
  });

  describe('Beginner', () => {
    beforeEach(() => {
      spyOn<IConfigService, any>(configService, 'getGameType').and.returnValue('beginner');
      fixture.detectChanges();
    });

    it('should create 9 squares in the canvas', () => {
      const squareElements = boardDe.nativeElement.querySelectorAll('app-square');
      expect(squareElements.length).toBe(9);
      expect(component.squares.length).toBe(9);
    });

    it('should put marks on random squares in the canvas', () => {
      component.makeMove(0);
      component.makeMove(8);

      fixture.detectChanges();

      const squareElements = boardDe.nativeElement.querySelectorAll('app-square');
      expect(squareElements[0].querySelector('button').textContent).toBe('X');
      expect(squareElements[8].querySelector('button').textContent).toBe('O');
    });

    it('should declare X as round winner after completing a line', () => {
      component.makeMove(0);
      component.makeMove(8);
      component.makeMove(1);
      component.makeMove(7);
      component.makeMove(2);

      fixture.detectChanges();

      const winSquareElements = boardDe.queryAll(By.css('.win-cell'));
      expect(winSquareElements.length).toBe(3);
      expect(winSquareElements[0].nativeElement.textContent).toBe('X');
    });

    it('should declare O as round winner after completing a line', () => {
      component.makeMove(0);
      component.makeMove(8);
      component.makeMove(1);
      component.makeMove(7);
      component.makeMove(4);
      component.makeMove(6);

      fixture.detectChanges();

      const winSquareElements = boardDe.queryAll(By.css('.win-cell'));
      expect(winSquareElements.length).toBe(3);
      expect(winSquareElements[0].nativeElement.textContent).toBe('O');
    });
  });

  describe('Pro', () => {
    beforeEach(() => {
      spyOn<IConfigService, any>(configService, 'getGameType').and.returnValue('pro');
      fixture.detectChanges();
    });

    it('should create 16 squares in the canvas', () => {
      const squareElements = boardDe.nativeElement.querySelectorAll('app-square');
      expect(squareElements.length).toBe(16);
      expect(component.squares.length).toBe(16);
    });

    it('should declare X as round winner after completing a line', () => {
      component.makeMove(0);
      component.makeMove(15);
      component.makeMove(1);
      component.makeMove(14);
      component.makeMove(2);
      component.makeMove(13);
      component.makeMove(3);

      fixture.detectChanges();

      const winSquareElements = boardDe.queryAll(By.css('.win-cell'));
      expect(winSquareElements.length).toBe(4);
      expect(winSquareElements[0].nativeElement.textContent).toBe('X');
    });

    it('should declare O as round winner after completing a line', () => {
      component.makeMove(0);
      component.makeMove(15);
      component.makeMove(1);
      component.makeMove(14);
      component.makeMove(2);
      component.makeMove(13);
      component.makeMove(4);
      component.makeMove(12);

      fixture.detectChanges();

      const winSquareElements = boardDe.queryAll(By.css('.win-cell'));
      expect(winSquareElements.length).toBe(4);
      expect(winSquareElements[0].nativeElement.textContent).toBe('O');
    });
  });
});
