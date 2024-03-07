import { Component, OnInit } from '@angular/core';
import { GLOBAL } from 'src/app/shared/utility/config.service';

@Component({
  selector: 'app-biolabsmetrics',
  templateUrl: './biolabsmetrics.component.html',
  styleUrls: ['./biolabsmetrics.component.css']
})
export class BiolabsmetricsComponent implements OnInit {
  applicationId = '';

  constructor() { }

  ngOnInit(): void {
  }
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
  onSiteToggle(event: any){
  }
}
