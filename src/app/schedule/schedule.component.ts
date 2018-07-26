import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Meeting } from './meeting.model';
import { Speaker } from '../speakers/speaker.model';
import { SpeakersService } from '../speakers/speakers.service';
import { ScheduleService } from './schedule.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit, OnDestroy {
  public schedule: Meeting[] = []
  public subscription: Subscription;

  constructor(public scheduleService: ScheduleService, public speakersService: SpeakersService) {}

  ngOnInit() {
    this.schedule = this.scheduleService.getSchedule();
    this.subscription = this.scheduleService.scheduleChanged
      .subscribe(
        (schedule: Meeting[]) => {
          this.schedule = schedule;
        }
      );
  }

  onDelete() {}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
