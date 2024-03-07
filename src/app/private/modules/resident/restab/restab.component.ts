import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { DefaultDataService } from 'src/app/shared/service/default-data.service';
import { GLOBAL } from 'src/app/shared/utility/config.service';

@Component({
  selector: 'app-restab',
  templateUrl: './restab.component.html',
  styleUrls: ['./restab.component.css']
})
export class RestabComponent implements OnInit {
  applicationId = '';

  constructor(
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService,
    public defaultService: DefaultDataService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params && params.id) {
        this.applicationId = params.id.split('_')[0];
      }
    });
  }
  // checkDisabled() {
  //   let userData = this.localStorageService.get('user');
  //   if (userData && Object.keys(userData).length > 0) {
  //       userData = JSON.parse(userData);
  //       if (userData && userData.user && userData.user.role == ROLE.RESIDENT) {
  //         return true;
  //       } else {
  //         return false;
  //       }
  //   } else {
  //     return false;
  //   }
  // }

  getRole() {
    return GLOBAL.USER && GLOBAL.USER.user && GLOBAL.USER.user.role;
  }

  viewCompanyDetails() {
    if (this.applicationId && GLOBAL.USER && GLOBAL.USER.user &&
      GLOBAL.USER.user.companyId &&
      this.applicationId == GLOBAL.USER.user.companyId) {
      return true;
    }
    return false;
  }

}
