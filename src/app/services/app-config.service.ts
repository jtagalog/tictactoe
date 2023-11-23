import { Inject, Injectable } from '@angular/core';

import { APP_CONFIG } from '../app.config';
import { MatchDetails } from '../interfaces/match-details';
import { IConfigService } from '../interfaces/config.service';

@Injectable()
export class AppConfigService implements IConfigService {
    constructor(@Inject(APP_CONFIG) private config: MatchDetails) {}
    getMatchFormat(): 'bo3' | 'bo1' | 'bo2' | 'bo5' | 'bo7' | 'evergreen' {
        return this.config.matchFormat;
    }
    getHomeTeam(): string {
        return this.config.homeTeam;
    }
    getVisitorTeam(): string {
        return this.config.awayTeam;
    }
    getGameType(): 'beginner' | 'pro' {
        return this.config.gameType;
    }
}