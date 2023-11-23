import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SquareComponent } from './square.component';
import { MatchService } from '../services/match.service';

describe('SquareComponent', () => {
  let component: SquareComponent;
  let fixture: ComponentFixture<SquareComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SquareComponent],
      providers: [MatchService]
    });
    fixture = TestBed.createComponent(SquareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
