import { Injectable, OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Meeting } from './meeting.model';
import { Speaker } from '../speakers/speaker.model'


@Injectable({
  providedIn: 'root'
})
export class ScheduleService implements OnInit {
  scheduleChanged = new Subject<Meeting[]>();
  maxId: number;

  public schedule: Meeting[] = [];

  constructor(private http: Http) {
    this.initSchedule();
  }

  ngOnInit() {
    this.maxId = this.getMaxId();
  }

  initSchedule() {
    this.http.get('https://localhost:44301/api/Schedules').pipe(map(
      (response: Response) => {
        const data = response.json();
        return data;
      }
    )).subscribe(
      (data) => {
        const newSchedule: Meeting[] = [];
        for(let i = 0; i < data.length; i++) {
          const meeting = new Meeting( 
            data[i].date.slice(0,10), 
            data[i].hymnOpenning, 
            data[i].hymnClosing, 
            data[i].conducting, 
            data[i].prayerOpening, 
            data[i].prayerClosing, 
            data[i].speaker,
            data[i].id
          );
            for(let j = 0; j < data[i].speaker; j++) {
              const speaker = new Speaker(
                data[i].speaker[j].id, 
                data[i].speaker[j].lastName, 
                data[i].speaker[j].firstName, 
                data[i].speaker[j].topic
              );
              meeting.speakers.push(speaker);
            }
          newSchedule.push(meeting);
        }
        this.schedule = newSchedule;
        this.maxId = this.getMaxId();
        this.scheduleChanged.next(this.schedule.slice());
      }
    );
  }

  getMaxId(): number {
    let maxId = 0;
    this.schedule.forEach(function(meeting) {
      let currentId = +meeting.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    })
    return maxId;
  }

  // call from component
  getSchedule() {
    return this.schedule.slice();
  }

  getMeeting(id: String) {
  return this.http.get('https://localhost:44301/api/Schedules/' + id).pipe(map(
      (res: Response) => {
        console.log('response: ', res.json());
        const data = res.json();
        return data;
      }
    ));
  }

  getMeetingId(date: String) {
    for(let i = 0; i < this.schedule.length; i++) {
      if(this.schedule[i].date == date) {
        return this.schedule[i].id;
      }
    }
    return null;
  }

  getMeetingBySpeakerId(speakerId: String) {
    // console.log('searching for meeting by speaker id: ', speakerId);
    for(let i = 0; i < this.schedule.length; i++) {
      for(let j = 0; j < this.schedule[i].speakers.length; j++) {
        if(this.schedule[i].speakers[j].id == speakerId) {
          return this.schedule[i];
        }
      }
    }
    return null;
  }

  addMeeting(meeting: Meeting) {
    // console.log(JSON.stringify(meeting));
    const port = {
      'date': meeting.date,
      'hymnOpenning': meeting.openingHymn,
      'hymnClosing': meeting.closingHymn,
      'conducting': meeting.conductor,
      'prayerOpening': meeting.openingPrayer,
      'prayerClosing': meeting.closingPrayer,
      'speaker': meeting.speakers
    }
    const headers = new Headers({'Content-Type': 'application/json'});
    this.http.post('https://localhost:44301/api/Schedules', JSON.stringify(port), {headers: headers})
      .subscribe(
        (res: Response) => {
          if(res.status == 201) {
            console.log('meeting added');
            this.initSchedule();
          } else {
            console.log('something went awry');
          }
        }
      );
  } 

  updateMeeting(original: Meeting, newMeeting: Meeting) {
    if (original === null || newMeeting === null) {
      return;
    }

    const headers = new Headers({'Content-Type': 'application/json'});
    this.http.put('https://localhost:44301/api/Schedules/' + original.id, JSON.stringify(newMeeting), {headers: headers})
      .subscribe(
        (res: Response) => {
          if(res.status == 200) {
            console.log('update success')
            this.initSchedule();
          } else {
            console.log('something went wrong');
          }      
        }
      );
  }

  deleteMeeting(id: String) {
    if (id == null) { return; }

    this.http.delete('https://localhost:44301/api/Schedules/' + id)
      .subscribe(
        (res: Response) => {
          if(res.status == 200) {
            console.log('meeting delete success');
            this.initSchedule();
          } else {
            console.log('something went wrong');
          }
        }
      );
  }


}
