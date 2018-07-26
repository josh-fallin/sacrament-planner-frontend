import { Component } from '@angular/core';
import { ScheduleService } from './schedule/schedule.service';
import { SpeakersService } from './speakers/speakers.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public scheduleService: ScheduleService, public speakersService: SpeakersService) {}
}
