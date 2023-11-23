import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SquareComponent } from './square/square.component';
import { BoardComponent } from './board/board.component';
import { ScoreComponent } from './score/score.component';
import { AppConfigService } from './services/app-config.service';
import { MatchService } from './services/match.service';
import { APP_CONFIG } from './app.config';
import { IConfigService } from './interfaces/config.service';

@NgModule({
  declarations: [
    AppComponent,
    SquareComponent,
    BoardComponent,
    ScoreComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    { provide: IConfigService, useClass: AppConfigService },
    { 
      provide: APP_CONFIG, 
      useValue: { 
        matchFormat: 'bo3', 
        homeTeam: 'Anthony', 
        awayTeam: 'Ivyrez', 
        gameType: 'hybrid' 
      }
    },
    MatchService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
