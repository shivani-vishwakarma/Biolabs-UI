import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsHubService {

  public setUserInfo$: Subject<any> = new Subject();
  private siteDropDown: Subject<any> = new Subject();
  constructor() { }

  public async setUserInfo(value: any) {
    this.setUserInfo$.next(value);
  }
  public setDropDownBySiteID(siteId: any) {
    this.siteDropDown.next(siteId);
  }
  onDropDownChange(): Observable<boolean> {
    return this.siteDropDown;
  }
}
