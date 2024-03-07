import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BnNgIdleService } from 'bn-ng-idle';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from './core/services/local-storage.service';
import { GLOBAL } from './shared/utility/config.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from './core/services/auth.service';
import { DefaultDataService } from 'src/app/shared/service/default-data.service';
import { EventsHubService } from 'src/app/core/services/events-hub.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('sessionModal') sessionModal: ElementRef | undefined;
  title = 'bio-lab-ui';
  timeout: any = 10;
  onTimeout: any = null;
  eventHandler: any;
  timeoutTracker: any;
  interval: any;
  expired = false;
  modalReference: any;
  constructor(
    private bnIdle: BnNgIdleService,
    private router: Router,
    private localStorage: LocalStorageService,
    private modalService: NgbModal,
    private authService: AuthService,
    private defaultService: DefaultDataService,
    private eventsHubService: EventsHubService
  ) {
   }

  ngOnInit(): void {
    window.addEventListener('storage', (event) => {
      if (event.storageArea == localStorage) {
        const token = localStorage.getItem('biolab-user');
        const expiredTime = localStorage.getItem('_expiredTime');
        if ((!expiredTime || !token) && !this.router.url.includes('/login')) {
          this.cleanUp();
        }
      }
    });
    this.eventHandler = this.updateExpiredTime.bind(this);
    this.tracker();
    this.startInterval();
  }

  /**
   * Description: This method is used to initialize the timer.
   * @description This method is used to initialize the timer.
   */
  startInterval() {
    this.updateExpiredTime();
    this.interval = setInterval(() => {
      const user = Object.keys(this.localStorage.get('user')).length > 0 ? true : false;
      if (localStorage.getItem('_expiredTime') && user) {
        const expiredTime = parseInt(localStorage.getItem('_expiredTime') || '', 10);
        if (!this.router.url.includes('/login') && user) {
          const expiry = JSON.parse(this.localStorage.get('user')).expires;
          if (expiry <= Date.now() && (expiry + (60 * 1000)) > expiry) {
            if (expiredTime && expiredTime > (expiry + (60 * 1000))) {
              this.expired = true;
              this.refreshToken();
            }
          }
        }
        if ((expiredTime < Date.now()) && !this.router.url.includes('/login')) {
          this.cleanUp();
        }
      }
    }, 1000);
  }

  /**
   * Description: This method is used to update the idle time.
   * @description This method is used to track the idle time.
   */
  updateExpiredTime() {
    if (this.timeoutTracker) {
      clearTimeout(this.timeoutTracker);
    }

    this.timeoutTracker = setTimeout(() => {
      const user = Object.keys(this.localStorage.get('user')).length > 0 ? true : false;
      if (!this.router.url.includes('/login') && user) {
        const expiresIn = JSON.parse(this.localStorage.get('user')).expiresIn;
        localStorage.setItem('_expiredTime', (new Date(new Date().getTime() + Number(expiresIn) * 1000).getTime()).toString());
      }
    }, 300);
  }

  /**
   * Description: This method is used to track the events such as mousemove, scroll, keydown.
   * @description This method is used to track the events such as mousemove, scroll, keydown.
   */
  tracker() {
    window.addEventListener('mousemove', this.eventHandler);
    window.addEventListener('scroll', this.eventHandler);
    window.addEventListener('keydown', this.eventHandler);
  }

  /**
   * Description: This method is used to clear the localstorage and navigate to login.
   * @description This method is used to clear the localstorage and navigate to login.
   */
  cleanUp() {
    this.modalService.dismissAll();
    GLOBAL.USER = {};
    this.localStorage.deleteAll();
    this.router.navigate(['/login']);
    clearInterval(this.interval);
    setTimeout(() => {
      alert('Session Expired: Please login again.');
    }, 100);
  }

  /**
   * Description: This method is used to refresh token.
   * @description This method is used to refresh token.
   */
  refreshToken() {
    const userObject = Object.keys(this.localStorage.get('user')).length > 0 ? JSON.parse(this.localStorage.get('user')) : false;
    const accessTokenKey = 'accessToken';
    this.authService.refreshToken(userObject[accessTokenKey]).subscribe(async (resp) => {
      if (resp && resp.accessToken) {
        const ms = (resp.expiresIn * 1000) - (60 * 1000);
        resp.expires = new Date(new Date().getTime() + ms).getTime();
      }
      this.expired = false;
      if (localStorage.getItem('_expiredTime')) {
        this.defaultService.createUserSession(resp);
      }
    });
  }
}
