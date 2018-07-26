import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormArray, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Meeting } from '../meeting.model';
import { Speaker } from '../../speakers/speaker.model';
import { ScheduleService } from '../schedule.service';

@Component({
  selector: 'app-meeting-edit',
  templateUrl: './meeting-edit.component.html',
  styleUrls: ['./meeting-edit.component.css']
})
export class MeetingEditComponent implements OnInit {
  subscription: Subscription;
  meeting: Meeting = new Meeting('', '', '', '', '', '', []);
  editMode = false;
  id: String;

  meetingForm: FormGroup;
  speakers: FormArray;

  constructor(private scheduleService: ScheduleService, 
    private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.meetingForm = this.formBuilder.group({
      meetingDate: new FormControl(null, Validators.required),
      conductor: new FormControl(null, Validators.required),
      openHymn: new FormControl(null, Validators.required),
      openPrayer: new FormControl(null, Validators.required),
      closeHymn: new FormControl(null, Validators.required),
      closePrayer: new FormControl(null, Validators.required),
      speakers: this.formBuilder.array([ this.createSpeaker() ])
    });

    this.route.params
    .subscribe(
      (params: Params) => {
        this.id = params['id'];
        if (!params['id']) {
          this.editMode = false;
          return;
        }
        console.log('getting data via id: ', this.id);
        this.subscription = this.scheduleService.getMeeting(this.id).subscribe(
          (data) => {
            console.log('data: ', data);
            console.log('speakers: ', data.speaker);
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
              speakers,
              data.id
            );
            this.meeting = meeting;
            if (!this.meeting) {
              return;
            }
            
            // for(let i = 0; i < this.meeting.speakers.length; i++) {
            //   this.speakers.push((<FormArray>this.meeting.speakers[i]));
              // if(this.meeting.speakers.length > i+1) {
              //   this.speakers.push(this.createSpeaker());
              // }
            // }
            this.editMode = true;
            this.meetingForm.setValue({
              'meetingDate': this.meeting.date,
              'conductor': this.meeting.conductor,
              'openHymn': this.meeting.openingHymn,
              'openPrayer': this.meeting.openingPrayer,
              'closeHymn': this.meeting.closingHymn,
              'closePrayer': this.meeting.closingPrayer,
              'speakers': this.meeting.speakers
            });
          }
        );
      }
    );
  }

  createSpeaker(): FormGroup {
    return this.formBuilder.group({
      lastName: '',
      firstName: '',
      topic: ''
    });
  }

  onAddSpeaker() {
    this.speakers = (<FormArray>this.meetingForm.get('speakers'));
    this.speakers.push(this.createSpeaker());
  }

  onSubmit() {
    // console.log('submit');
    // console.log(this.meetingForm.value);
    const value = this.meetingForm.value;
    const newSpeakers: any[] = [];
    for(let i = 0; i < value.speakers.length; i++) {
      newSpeakers.push(value.speakers[i]);
    }
    const newMeeting = new Meeting(
      value.meetingDate,
      value.openHymn,
      value.closeHymn,
      value.conductor,
      value.openPrayer,
      value.closePrayer,
      newSpeakers
    );
    if (this.editMode === true) {
      this.scheduleService.updateMeeting(this.meeting, newMeeting);
    } else {
      this.scheduleService.addMeeting(newMeeting);
    }

    this.router.navigate(['/schedule']);

  }

  onCancel() {
    this.router.navigate(['/schedule']);
  }

}
