import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Speaker } from './speaker.model';
import { ScheduleService } from '../schedule/schedule.service';
import { SpeakersService } from './speakers.service';
import { Meeting } from '../schedule/meeting.model';

@Component({
  selector: 'app-speakers',
  templateUrl: './speakers.component.html',
  styleUrls: ['./speakers.component.css']
})
export class SpeakersComponent implements OnInit, OnDestroy {
  public speakers: Speaker[] = []
  public subscription: Subscription;

  constructor(public scheduleService: ScheduleService, public speakersService: SpeakersService) { }

  ngOnInit() {
    this.speakers = this.speakersService.getSpeakers();
    this.subscription = this.speakersService.speakersChanged
      .subscribe(
        (speakers: Speaker[]) => {
          this.speakers = speakers;
        }
      );
  }

  getMeetingDate(id: String) {
    const meeting: Meeting = this.scheduleService.getMeetingBySpeakerId(id);
    if(meeting) {
      return meeting.date;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
