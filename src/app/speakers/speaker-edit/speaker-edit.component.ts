import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Speaker } from '../speaker.model';
import { SpeakersService } from '../speakers.service';
import { ScheduleService } from '../../schedule/schedule.service';


@Component({
  selector: 'app-speaker-edit',
  templateUrl: './speaker-edit.component.html',
  styleUrls: ['./speaker-edit.component.css']
})
export class SpeakerEditComponent implements OnInit {
  originalSpeaker: Speaker;
  speaker: Speaker = new Speaker('', '', '', '');
  editMode = false;
  id: String;

  constructor(private speakersService: SpeakersService, private scheduleService: ScheduleService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params
    .subscribe(
      (params: Params) => {
        this.id = params['id'];
        if (!params['id']) {
          this.editMode = false;
          return;
        }
        this.originalSpeaker = this.speakersService.getSpeaker(this.id);
        if (!this.originalSpeaker) {
          return;
        }
        this.editMode = true;
        this.speaker = JSON.parse(JSON.stringify(this.originalSpeaker));
      }
    );
  }

  // onSubmit(form: NgForm) {
  //   const value = form.value;
  //   const meetingId = this.scheduleService.getMeetingId(value.meetingDate);

  //   const newSpeaker = { 
  //     'lastName':value.lastName, 
  //     'firstName': value.firstName, 
  //     'topic': value.topic 
  //   };
  //   if (this.editMode === true) {
  //     this.speakersService.updateSpeaker(this.originalSpeaker, newSpeaker);
  //   } else {
  //     this.speakersService.addSpeaker(newSpeaker, meetingId);
  //   }
  //   this.router.navigate(['/speakers']);
  // }

  onCancel() {
    this.router.navigate(['/speakers']);
  }
      

}
