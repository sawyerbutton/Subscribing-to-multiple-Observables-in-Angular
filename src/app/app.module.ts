import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ManualSubscribeComponent } from './manual-subscribe/manual-subscribe.component';
import { AsyncPipeComponent } from './async-pipe/async-pipe.component';
import { ForkJoinComponent } from './fork-join/fork-join.component';
import { CombineLatestComponent } from './combine-latest/combine-latest.component';

@NgModule({
  declarations: [
    AppComponent,
    ManualSubscribeComponent,
    AsyncPipeComponent,
    ForkJoinComponent,
    CombineLatestComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
