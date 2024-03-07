import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { skipSiteFilterPages } from 'src/app/shared/utility/config.service';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private localStorageService: LocalStorageService,
    private router: Router,
    ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let userData = this.localStorageService.get('user');
    let selectedSite = null;
    const site = this.localStorageService.get('SELECTED_SITE');
    if (site && typeof site == 'string' && site != '{}') {
      selectedSite = site;
    } else if (site && typeof site == 'object' && Object.keys(site).length > 0) {
      selectedSite = site;
    } else if (site && typeof site == 'number') {
      selectedSite = site;
    }
    if (userData) {
      try {
        userData = typeof userData == 'string' ? JSON.parse(userData) : userData;
        if (userData && userData.accessToken) {
          let reqHeader = request.headers
            .set('Authorization', 'Bearer ' + userData.accessToken)
            .set('Access-Control-Allow-Origin', '*');

          // used to bypass the site filter for sponsor users BIOL-224 BIOL-225
          if (userData.user && userData.user.role !== 3) {
            reqHeader = request.headers
              .set('Authorization', 'Bearer ' + userData.accessToken)
              .set('Access-Control-Allow-Origin', '*')
              .set('x-site-id', '[' + (selectedSite ? selectedSite : (userData.user.site_id)) + ']');
          }
          request = request.clone({
            headers: reqHeader
          });
        }
      } catch (error) {
        console.error(error && error.message);
      }
    }
    // return next.handle(request);
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // error.url
        let errorMsg = '';
        if (error.error instanceof ErrorEvent) {
          errorMsg = `Error: ${error.error.message}`;
        } else {
          if (error.status == 401) {
            this.localStorageService.deleteAll();
            const param = {queryParams: { returnUrl: window.location.pathname }};
            // Append returnUrl only for the pages other then login
            if (!this.router.url.includes('/login')) {
              setTimeout(() => {
                alert('Session Expired: Please login again.');
              }, 100);
              this.router.navigate(['/login'], param);
            }
          }
        }
        // display a user oriented error message
        return throwError(error.error);
      })
    );
  }

  /**
   * Description: Not in use - Used to by pass site filter on specific pages like sponsor-view/search', '/sponsor-view/sponsor BIOL-224
   * @description Not in use - Used to by pass site filter on specific pages like sponsor-view/search', '/sponsor-view/sponsor BIOL-224
   */
  bypassSiteFilter() {
    let skipSiteFilter = true;
    for (const page of skipSiteFilterPages) {
      if (window.location.pathname.indexOf(page) > -1) {
        skipSiteFilter = false;
        break;
      }
    }
    return skipSiteFilter;
  }
}
