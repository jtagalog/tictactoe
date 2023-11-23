export class IConfigService {
    getMatchFormat(): 'bo1' | 'bo2' | 'bo3' | 'bo5' | 'bo7' | 'evergreen' { return 'bo1'; };
    getHomeTeam(): string { return ''; };
    getVisitorTeam(): string { return ''; };
    getGameType(): 'beginner' | 'pro' { return 'beginner'; };
}