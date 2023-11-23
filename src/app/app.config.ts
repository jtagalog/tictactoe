import { InjectionToken } from '@angular/core';
import { MatchDetails } from './interfaces/match-details';

export const APP_CONFIG = new InjectionToken<MatchDetails>('MatchDetails');
