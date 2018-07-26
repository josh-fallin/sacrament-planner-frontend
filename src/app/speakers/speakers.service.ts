import { Injectable, OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Speaker } from './speaker.model';
import { Meeting } from '../schedule/meeting.model';
import { ScheduleService } from '../schedule/schedule.service';

@Injectable({
  providedIn: 'root'
})
export class SpeakersService implements OnInit {
  speakersChanged = new Subject<Speaker[]>();

  public speakers: Speaker[] = [];

  constructor(private http: Http, private scheduleService: ScheduleService) {
    this.initSpeakers();
  }

  ngOnInit() {}

  initSpeakers() {
    this.http.get('https://localhost:44301/api/Speakers').pipe(map(
      (response: Response) => {
        const data = response.json();
        return data;
      }
    )).subscribe(
      (data) => {
        const newSpeakers: Speaker[] = [];
        for(let i = 0; i < data.length; i++) {
          const speaker = new Speaker(
            data[i].id,
            data[i].lastName,
            data[i].firstName,
            data[i].topic
          );
          newSpeakers.push(speaker);
        }
        this.speakers = newSpeakers;
        this.speakersChanged.next(this.speakers.slice());
      }
    );
  }

  storeSpeakers() {
    const headers = new Headers({'Content-Type': 'application/json'});
    this.http.put('https://localhost:44301/api/Speakers', JSON.stringify(this.speakers), {headers: headers})
      .subscribe(
        () => {
          this.speakersChanged.next(this.speakers.slice());
        }
      );
  }

  getSpeakers() {
    return this.speakers.slice();
  }

  getSpeaker(id: String) {
    for (let i = 0; i < this.speakers.length; i++) {
      if (this.speakers[i].id == id) {
        return this.speakers[i];
      }
    }
    return null;
  }

  // updateSpeaker(original: Speaker, newSpeaker: any) {
  //   if (original === null || newSpeaker === null) {
  //     return;
  //   }

  //   let pos = this.speakers.indexOf(original);
  //   if (pos < 0) {
  //     return;
  //   }

  //   newSpeaker.id = original.id;
  //   this.speakers[pos] = newSpeaker;
    
  //   this.storeSpeakers();
  // }

  deleteSpeaker(speaker: Speaker) {
    if (speaker == null) { return; }

    this.http.delete('https://localhost:44301/api/Speakers/' + speaker.id)
      .subscribe(
        (res: Response) => {
          if(res.status == 200) {
            console.log('speaker delete success');
            this.initSpeakers();
          } else {
            console.log('something went wrong');
          }
        }
      );
  }

}
