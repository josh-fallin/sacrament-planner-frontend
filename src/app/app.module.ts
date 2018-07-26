import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';


import { AppComponent } from './app.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { SpeakersComponent } from './speakers/speakers.component';
import { MeetingDetailsComponent } from './schedule/meeting-details/meeting-details.component';
import { MeetingEditComponent } from './schedule/meeting-edit/meeting-edit.component';
import { SpeakerEditComponent } from './speakers/speaker-edit/speaker-edit.component';
import { HeaderComponent } from './header/header.component';
import { SpeakerViewComponent } from './speakers/speaker-view/speaker-view.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/schedule', pathMatch: 'full' },
  { path: 'schedule', component: ScheduleComponent },
  { path: 'schedule/new', component: MeetingEditComponent },
  { path: 'schedule/:id', component: MeetingDetailsComponent },
  { path: 'schedule/:id/edit', component: MeetingEditComponent },
  { path: 'speakers', component: SpeakersComponent },
  { path: 'speakers/:id/view', component: SpeakerViewComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    ScheduleComponent,
    SpeakersComponent,
    MeetingDetailsComponent,
    MeetingEditComponent,
    SpeakerEditComponent,
    HeaderComponent,
    SpeakerViewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
