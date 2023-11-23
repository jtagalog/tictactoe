import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreComponent } from './score.component';
import { IConfigService } from '../interfaces/config.service';
import { MatchService } from '../services/match.service';

describe('ScoreComponent', () => {
  let component: ScoreComponent;
  let fixture: ComponentFixture<ScoreComponent>;
  let configService: IConfigService;
  let matchService: MatchService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScoreComponent],
      providers: [
        IConfigService,
        MatchService,
      ]
    });
    configService = TestBed.inject(IConfigService);
    matchService = TestBed.inject(MatchService);
    fixture = TestBed.createComponent(ScoreComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Players', () => {
    beforeEach(() => {
      spyOn<IConfigService, any>(configService, 'getHomeTeam').and.returnValue('Player X');
      spyOn<IConfigService, any>(configService, 'getVisitorTeam').and.returnValue('Player O');
    
      fixture.detectChanges();
    });

    it('should return the home team name', () => {
      expect(component.homeTeam).toBe('Player X');
    });
  
    it('should return the away team name', () => {
      expect(component.visitorTeam).toBe('Player O');
    });
  });

  describe('Evergreen', () => {
    beforeEach(() => {
      spyOn<IConfigService, any>(configService, 'getMatchFormat').and.returnValue('evergreen');
      fixture.detectChanges();
    });
    
    it('should add 1 score to home team', () => {
      matchService.roundWinner$.next({roundWinner: 'home'});
      expect(component.homeTeamScore).toBe(1);
    });

    it('should add 1 score to visitor team', () => {
      matchService.roundWinner$.next({roundWinner: 'visitor'});
      expect(component.visitorTeamScore).toBe(1);
    });

    it('should continue without an end in an evergreen match', () => {
      spyOn(component.matchEnded, 'emit');
  
      matchService.roundWinner$.next({roundWinner: 'home'});
      matchService.roundWinner$.next({roundWinner: 'visitor'});
      matchService.roundWinner$.next({roundWinner: 'home'});
      matchService.roundWinner$.next({roundWinner: 'home'});
      matchService.roundWinner$.next({roundWinner: 'visitor'});
      matchService.roundWinner$.next({roundWinner: 'home'});
      matchService.roundWinner$.next({roundWinner: 'home'});
      matchService.roundWinner$.next({roundWinner: 'visitor'});
      matchService.roundWinner$.next({roundWinner: 'home'});
      matchService.roundWinner$.next({roundWinner: 'visitor'});
   
      expect(component.winner).toBeNull();
      expect(component.matchEnded.emit).not.toHaveBeenCalled();
    });
  });
  
  describe('Best of 5', () => {
    beforeEach(() => {
      spyOn<IConfigService, any>(configService, 'getMatchFormat').and.returnValue('bo5');
      fixture.detectChanges();
    });

    it('should declare home team as winner in a best of 5 match', () => {
      spyOn(component.matchEnded, 'emit');
  
      matchService.roundWinner$.next({roundWinner: 'home'});
      matchService.roundWinner$.next({roundWinner: 'home'});
      matchService.roundWinner$.next({roundWinner: 'visitor'});
      matchService.roundWinner$.next({roundWinner: 'visitor'});
      matchService.roundWinner$.next({roundWinner: 'home'});
  
      expect(component.winner).toBe('home');
      expect(component.matchEnded.emit).toHaveBeenCalled();
      expect(component.matchEnded.emit).toHaveBeenCalledWith('home');
    });  
  });

  describe('Best of 1', () => {
    beforeEach(() => {
      spyOn<IConfigService, any>(configService, 'getMatchFormat').and.returnValue('bo1');
      fixture.detectChanges();
    });
  
    it('should return the bo1 match format', () => {
      expect(component.matchFormatStr).toBe('Best of 1');
    });

    it('should declare home team as winner in a best of 1 match', () => { 
      spyOn(component.matchEnded, 'emit');
  
      matchService.roundWinner$.next({roundWinner: 'home'});
  
      expect(component.winner).toBe('home');
      expect(component.matchEnded.emit).toHaveBeenCalled();
      expect(component.matchEnded.emit).toHaveBeenCalledWith('home');
    });

    it('should declare visitor team as winner in a best of 1 match', () => {
      spyOn(component.matchEnded, 'emit');
  
      matchService.roundWinner$.next({roundWinner: 'visitor'});
  
      expect(component.winner).toBe('visitor');
      expect(component.matchEnded.emit).toHaveBeenCalled();
      expect(component.matchEnded.emit).toHaveBeenCalledWith('visitor');
    });
  });

  describe('Best of 2', () => {
    beforeEach(() => {
      spyOn<IConfigService, any>(configService, 'getMatchFormat').and.returnValue('bo2');
      fixture.detectChanges();
    });

    it('should declare a draw in a best of 2 match', () => {  
      spyOn(component.matchEnded, 'emit');
  
      matchService.roundWinner$.next({roundWinner: 'home'});
      matchService.roundWinner$.next({roundWinner: 'visitor'});
  
      expect(component.winner).toBe('draw');
      expect(component.matchEnded.emit).toHaveBeenCalled();
      expect(component.matchEnded.emit).toHaveBeenCalledWith('draw');
    });

    it('should declare home team as winner in a best of 2 match', () => {
      spyOn(component.matchEnded, 'emit');

      matchService.roundWinner$.next({roundWinner: 'home'});
      matchService.roundWinner$.next({roundWinner: 'home'});

      expect(component.winner).toBe('home');
      expect(component.matchEnded.emit).toHaveBeenCalled();
      expect(component.matchEnded.emit).toHaveBeenCalledWith('home');
    });
  });

  describe('Best of 3', () => {
    beforeEach(() => {
      spyOn<IConfigService, any>(configService, 'getMatchFormat').and.returnValue('bo3');
      fixture.detectChanges();
    });

    it('should declare visitor team as winner in a best of 3 match', () => {
      spyOn(component.matchEnded, 'emit');
  
      matchService.roundWinner$.next({roundWinner: 'home'});
      matchService.roundWinner$.next({roundWinner: 'visitor'});
      matchService.roundWinner$.next({roundWinner: 'visitor'});
  
      expect(component.winner).toBe('visitor');
      expect(component.matchEnded.emit).toHaveBeenCalled();
      expect(component.matchEnded.emit).toHaveBeenCalledWith('visitor');
    });

    it('should declare home team as winner in 2 games of a best of 3 match', () => {
      spyOn(component.matchEnded, 'emit');

      matchService.roundWinner$.next({roundWinner: 'home'});
      matchService.roundWinner$.next({roundWinner: 'home'});
  
      expect(component.winner).toBe('home');
      expect(component.matchEnded.emit).toHaveBeenCalled();
      expect(component.matchEnded.emit).toHaveBeenCalledWith('home');
    });
  });

  describe('Best of 7', () => {
    beforeEach(() => {
      spyOn<IConfigService, any>(configService, 'getMatchFormat').and.returnValue('bo7');
      fixture.detectChanges();
    });

    it('should declare home team as winner in a sweep best of 7 match', () => {
      spyOn(component.matchEnded, 'emit');
  
      matchService.roundWinner$.next({roundWinner: 'home'});
      matchService.roundWinner$.next({roundWinner: 'home'});
      matchService.roundWinner$.next({roundWinner: 'home'});
      matchService.roundWinner$.next({roundWinner: 'home'});
  
      expect(component.winner).toBe('home');
      expect(component.matchEnded.emit).toHaveBeenCalled();
      expect(component.matchEnded.emit).toHaveBeenCalledWith('home');
    });

    it('should still be undecided who the winner is in a best of 7 match', () => {
      spyOn(component.matchEnded, 'emit');
  
      matchService.roundWinner$.next({roundWinner: 'home'});
      matchService.roundWinner$.next({roundWinner: 'home'});
      matchService.roundWinner$.next({roundWinner: 'home'});
      matchService.roundWinner$.next({roundWinner: 'visitor'});
   
      expect(component.winner).toBeNull();
      expect(component.matchEnded.emit).not.toHaveBeenCalled();
    });
  });
});
