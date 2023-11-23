export interface MatchDetails {
    matchFormat: 'bo1' | 'bo2' | 'bo3' | 'bo5' | 'bo7' | 'evergreen' ;
    homeTeam: string;
    awayTeam: string;
    gameType: 'beginner' | 'pro' | 'hybrid';
}
