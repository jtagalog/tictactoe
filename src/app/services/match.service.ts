import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { RoundResult } from '../interfaces/round-result';

@Injectable()
export class MatchService {
    roundWinner$: BehaviorSubject<RoundResult> = new BehaviorSubject({roundWinner: ''});
    firstMove$: BehaviorSubject<number> = new BehaviorSubject(-1);
    teamTurn$: BehaviorSubject<string> = new BehaviorSubject('');
}