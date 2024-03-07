import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';
import { ROLE } from 'src/app/shared/utility/config.service';
import { DefaultDataService } from 'src/app/shared/service/default-data.service';

// import { AccountService } from '../_services';

@Injectable({ providedIn: 'root' })
export class PublicGuard implements CanActivate {
    constructor(
        private router: Router,
        private localStorage: LocalStorageService,
        private defaultService: DefaultDataService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let userData = this.localStorage.get('user');
        if (userData && Object.keys(userData).length > 0) {
            userData = typeof userData == 'string' ? JSON.parse(userData) : userData;
            // Role based Dashboard redirecion for "/"
            this.defaultService.roleBasedDashboardNavigation(userData.user.role, this.router);
            return false;
        } else {
            return true;
        }

    }
}
