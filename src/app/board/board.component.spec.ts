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

    ([
      [0, 15, 1, 14, 2, 13, 3],
      [4, 15, 5, 14, 6, 13, 7],
      [8, 15, 9, 14, 10, 13, 11],
      [12, 2, 13, 3, 14, 4, 15],
      [0, 15, 4, 14, 8, 13, 12],
      [1, 15, 5, 14, 9, 12, 13],
      [2, 15, 6, 11, 10, 12, 14],
      [3, 2, 7, 1, 11, 12, 15],
      [0, 2, 5, 1, 10, 12, 15],
      [3, 2, 6, 1, 9, 15, 12],
    ]).forEach((m, idx) => {
      it(`should accept these 4-square lines (testcase ${idx+1})`, () => {
        m.forEach(i => component.makeMove(i));
  
        fixture.detectChanges();
  
        const winSquareElements = boardDe.queryAll(By.css('.win-cell'));
        expect(winSquareElements.length).toBe(4);
        expect(winSquareElements[0].nativeElement.textContent).toBe('X');
      });
    });

    ([
      [2, 3, 5, 7, 8],
      [1, 3, 6, 7, 11],
      [4, 3, 9, 7, 14],
      [7, 3, 10, 8, 13]
    ]).forEach((m, idx) => {
      it(`should ignore these kind of lines (testcase ${idx+1})`, () => {
        m.forEach(i => component.makeMove(i));
  
        fixture.detectChanges();
  
        const winSquareElements = boardDe.queryAll(By.css('.win-cell'));
        expect(winSquareElements.length).toBe(0);
      });
    });
  });
 
  describe('Hybrid', () => {
    beforeEach(() => {
      spyOn<IConfigService, any>(configService, 'getGameType').and.returnValue('hybrid');
      fixture.detectChanges();
    });

    ([
      [0, 8, 1, 7, 2],
      [1, 8, 2, 7, 3],
      [4, 8, 5, 7, 6],
      [5, 8, 6, 9, 7],
      [0, 5, 4, 6, 8],
      [1, 3, 5, 4, 9],
      [0, 3, 5, 4, 10],
      [3, 4, 6, 5, 9],
      [6, 8, 9, 4, 12],
      [5, 8, 10, 4, 15],
      [5, 8, 9, 4, 13],
      [4, 9, 8, 5, 12],
      [6, 9, 10, 4, 14],
      [7, 9, 11, 4, 15],
      [8, 2, 9, 4, 10],
      [9, 2, 10, 4, 11],
      [12, 2, 13, 4, 14],
      [13, 2, 14, 4, 15],
    ]).forEach((m, idx) => {
      it(`should ignore these 3-square lines (testcase ${idx+1})`, () => {
        m.forEach(i => component.makeMove(i));
     
        fixture.detectChanges();
  
        const winSquareElements = boardDe.queryAll(By.css('.win-cell'));
        expect(winSquareElements.length).toBe(0);
      });
    });

    ([
      [2, 3, 5, 7, 8],
      [1, 3, 6, 7, 11],
      [4, 3, 9, 7, 14],
      [7, 3, 10, 8, 13]
    ]).forEach((m, idx) => {
      it(`should accept these 3-square lines (testcase ${idx+1})`, () => {
        m.forEach(i => component.makeMove(i));
  
        fixture.detectChanges();
  
        const winSquareElements = boardDe.queryAll(By.css('.win-cell'));
        expect(winSquareElements.length).toBe(3);
        expect(winSquareElements[0].nativeElement.textContent).toBe('X');
      });
    });

    ([
      [0, 15, 1, 14, 2, 13, 4, 12],
      [0, 11, 1, 10, 2, 9, 4, 8],
      [0, 7, 1, 6, 2, 5, 8, 4],
      [4, 3, 5, 2, 6, 1, 8, 0],
      [4, 3, 5, 7, 6, 11, 8, 15],
      [4, 2, 5, 6, 7, 10, 8, 14],
      [4, 1, 6, 5, 7, 9, 8, 13],
      [5, 0, 6, 4, 7, 8, 3, 12],
      [4, 0, 8, 5, 12, 10, 3, 15],
      [5, 3, 4, 6, 1, 9, 2, 12],
    ]).forEach((m, idx) => {
      it(`should accept these 4-square lines (testcase ${idx+1})`, () => {
      m.forEach(i => component.makeMove(i));
    
      fixture.detectChanges();
    
      const winSquareElements = boardDe.queryAll(By.css('.win-cell'));
      expect(winSquareElements.length).toBe(4);
      expect(winSquareElements[0].nativeElement.textContent).toBe('O');
      });
    });
  });

});
