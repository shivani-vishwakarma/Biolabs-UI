import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate, NavigationEnd } from '@angular/router';
import { ROLE, siteAdminRestrictUrlArr, siteAdminAllowedUrlArr } from 'src/app/shared/utility/config.service';
import { LocalStorageService } from '../services/local-storage.service';
import { EventsHubService } from '../services/events-hub.service';
import { DefaultDataService } from 'src/app/shared/service/default-data.service';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    skipArr = ['', 'login', 'apply', 'home', 'register', 'forgot-password',
        'reset-password', 'sponsor', 'error', 'success'];
    activeSite: any = +this.localStorage.get('SELECTED_SITE');

    constructor(
        private router: Router,
        // private accountService: AccountService
        private localStorage: LocalStorageService,
        private eventsHubService: EventsHubService,
        private defaultDataService: DefaultDataService
    ) {
        // Check Route's Navigation URL
        router.events.subscribe(event => {
            this.activeSite = +this.localStorage.get('SELECTED_SITE'); // + sign converts the value into integer.
            if (event instanceof NavigationEnd) {
                let userData = this.localStorage.get('user');
                if (userData && Object.keys(userData).length > 0) {
                    userData = JSON.parse(userData);
                    const p = userData.permissions.permissions;
                    const currentURL = event.url.split('/');
                    if (currentURL.length >= 2 && this.skipArr.indexOf(currentURL[1]) == -1 &&
                        !(p && p[currentURL[1]] && p[currentURL[1]].view == true)) {
                        this.router.navigate(['/error'], { queryParams: {} });
                    } else if (currentURL.length == 4 && this.isNumeric(currentURL[2]) && p[currentURL[1]].hasOwnProperty('dynamic')
                        && !(p[currentURL[1]].dynamic[currentURL[3]].view == true)) {
                        this.router.navigate(['/error'], { queryParams: {} });
                    } else if (currentURL.length == 4
                        && p[currentURL[1]].hasOwnProperty('child') && p[currentURL[1]].child[currentURL[2]].hasOwnProperty('dynamic')
                        && this.isNumeric(currentURL[3]) && !(p[currentURL[1]].child[currentURL[2]].dynamic.view == true)) {
                        this.router.navigate(['/error'], { queryParams: {} });
                        // BIOL-351 SiteAdmin Url routing restricts url for non-primarySites
                    } else if (userData.user.role == ROLE.SITE_ADMIN &&
                        siteAdminRestrictUrlArr.includes(currentURL[1]) && this.activeSite &&
                        !userData.user.site_id.includes(this.activeSite)) {
                        if (!siteAdminAllowedUrlArr.includes(currentURL[currentURL.length - 1])) {
                            this.router.navigate(['/error'], { queryParams: {} });
                        }
                    }
                }
            }
        });
    }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // Works on direct hitting the URL
        let userData = this.localStorage.get('user');
        if (userData && Object.keys(userData).length > 0) {
            userData = JSON.parse(userData);
            const p = userData.permissions.permissions;
            const currentURL = window.location.pathname.split('/');
            const companyUrl = currentURL.find(i => /[@_]/.test(i));
            if (companyUrl) {
                const companies = companyUrl.split('@');
                if (companies.length > 0) {
                    const companyWithSIte: any = {};
                    companies.forEach(i => {
                        const splittedValue = i.split('_');
                        if (splittedValue.length > 0) {
                            companyWithSIte[splittedValue[1]] = splittedValue[0];
                        }
                    });
                    const selectedSite = this.localStorage.get('SELECTED_SITE');
                    const companyId = companyWithSIte[selectedSite];
                    let url = '';
                    if (Object.keys(companyWithSIte).includes(selectedSite + '')) {
                        if (companyId) {
                            url = window.location.pathname.replace(companyUrl, companyWithSIte[selectedSite]);
                            this.router.navigate([`/${url}`]);
                        }
                    } else {
                        if ((Object.keys(companyWithSIte).length > 1)) {
                            this.localStorage.set('SELECTED_SITE', Object.keys(companyWithSIte)[0]);
                            const sites = await this.defaultDataService.getSiteList();
                            const selectedSiteDet = (sites && sites.length) ?
                                sites.filter((site: any) => Object.keys(companyWithSIte)[0] == site.id)[0] : {};
                            this.localStorage.set('SELECTED_SITE_DETAIL', selectedSiteDet);
                            this.eventsHubService.setDropDownBySiteID(Object.keys(companyWithSIte)[0]);
                            url = window.location.pathname.replace(companyUrl, companyWithSIte[Object.keys(companyWithSIte)[0]]);
                            this.router.navigate([`/${url}`]);
                        }
                    }
                }
            }
            if (currentURL.length >= 2 && this.skipArr.indexOf(currentURL[1]) == -1) {
                if (p && p[currentURL[1]] && p[currentURL[1]].view == true) {
                    // Checking for child
                    if (currentURL.length > 2 && p[currentURL[1]].hasOwnProperty('child')
                        && !(p[currentURL[1]].child[currentURL[2]].view == true)) {
                        this.router.navigate(['/error'], { queryParams: { returnUrl: state.url } });
                        return false;
                    } else if (currentURL.length == 4 && this.isNumeric(currentURL[2]) && p[currentURL[1]].hasOwnProperty('dynamic')
                        && !(p[currentURL[1]].dynamic[currentURL[3]].view == true)) {
                        this.router.navigate(['/error'], { queryParams: { returnUrl: state.url } });
                        return false;
                    } else if (currentURL.length == 4
                        && p[currentURL[1]].hasOwnProperty('child') && p[currentURL[1]].child[currentURL[2]].hasOwnProperty('dynamic')
                        && this.isNumeric(currentURL[3]) && !(p[currentURL[1]].child[currentURL[2]].dynamic.view == true)) {
                        this.router.navigate(['/error'], { queryParams: { returnUrl: state.url } });
                        return false;
                        // BIOL-351 SiteAdmin Url routing restricts url for non-primarySites
                    } else if (userData.user.role == ROLE.SITE_ADMIN &&
                        siteAdminRestrictUrlArr.includes(currentURL[1]) && this.activeSite &&
                        !userData.user.site_id.includes(this.activeSite)) {
                        if (!siteAdminAllowedUrlArr.includes(currentURL[currentURL.length - 1])) {
                            if (state.url != '/applications') {
                                this.router.navigate(['/error'], { queryParams: { returnUrl: state.url } });
                                return false;
                            }
                        }
                    }
                    return true;
                } else {
                    this.router.navigate(['/error'], { queryParams: { returnUrl: state.url } });
                    return false;
                }
            } else {
                return true;
            }
        } else {
            // not logged in so redirect to login page with the return url
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            return false;
        }
    }

    /**
     * Description: Returns true if passed string contains only numeric value otherwise returns false.
     * @description returns true if the passed value is a number.
     * @param val string which may contain a numberic value.
     * @returns true or false
     */
    isNumeric(val: string) {
        return !Number.isNaN(Number(val));
    }
}
