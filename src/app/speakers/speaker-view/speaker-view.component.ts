import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Speaker } from '../speaker.model';
import { SpeakersService } from '../speakers.service';
import { ScheduleService } from '../../schedule/schedule.service';
import { Meeting } from '../../schedule/meeting.model';


@Component({
  selector: 'app-speaker-view',
  templateUrl: './speaker-view.component.html',
  styleUrls: ['./speaker-view.component.css']
})
export class SpeakerViewComponent implements OnInit {
  speaker: Speaker = new Speaker('', '', '', '');
  id: String = '';
  meetingId: String = '';
  meetingDate: String = '';

  constructor(private speakersService: SpeakersService, private scheduleService: ScheduleService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params
    .subscribe(
      (params: Params) => {
        this.id = params['id'];
        if (!params['id']) {
          this.router.navigate(['/speakers']);
        }
        this.speaker = this.speakersService.getSpeaker(this.id);
        const meeting: Meeting = this.scheduleService.getMeetingBySpeakerId(this.id);
        if(meeting) {
          this.meetingId = meeting.id;
          this.meetingDate = meeting.date;
        }
      }
    );
  }

  onDelete(speaker: Speaker) {
    this.speakersService.deleteSpeaker(speaker);
    this.router.navigate(['/speakers']);
  }

}
