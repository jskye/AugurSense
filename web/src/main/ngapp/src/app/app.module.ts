import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {CalendarModule} from 'primeng/primeng';

import {AppComponent} from "./app.component";
import {AppRoutingModule} from "./app-routing.module";
import {NavBarComponent} from "./nav-bar/nav-bar.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {AnalyticsService} from "./services/analytics.service";
import {HeatmapComponent} from "./heatmap/heatmap.component";
import { PeopleCountComponent } from './people-count/people-count.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    DashboardComponent,
    HeatmapComponent,
    PeopleCountComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    HttpModule,
    CalendarModule
  ],
  providers: [AnalyticsService],
  bootstrap: [AppComponent]
})

export class AppModule {
}