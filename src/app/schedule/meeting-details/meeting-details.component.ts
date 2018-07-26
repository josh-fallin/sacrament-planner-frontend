import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Meeting } from '../meeting.model';
import { Speaker } from '../../speakers/speaker.model'
import { ScheduleService } from '../schedule.service';

@Component({
  selector: 'app-meeting-details',
  templateUrl: './meeting-details.component.html',
  styleUrls: ['./meeting-details.component.css']
})
export class MeetingDetailsComponent implements OnInit {
  subscription: Subscription;
  public id: String;

  public meeting: Meeting = new Meeting('empty','empty', 'empty', 'empty', 'empty', 'empty', []);

  constructor(private route: ActivatedRoute, private router: Router, private scheduleService: ScheduleService) {}

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
          this.subscription = this.scheduleService.getMeeting(this.id).subscribe(
            (data) => {
              const speakers: Speaker[] = [];
              for(let i = 0; i < data.speaker.length; i++) {
                speakers.push(data.speaker[i]);
              }
              const meeting: Meeting = new Meeting(
                data.date.slice(0,10), 
                data.hymnOpenning, 
                data.hymnClosing, 
                data.conducting, 
                data.prayerOpening, 
                data.prayerClosing, 
                speakers);
              this.meeting = meeting;
            }
          );
        }
      );
  }

  onBack() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  onDelete() {
    this.scheduleService.deleteMeeting(this.id);
    this.router.navigate(['../'], {relativeTo: this.route});
  }



}
