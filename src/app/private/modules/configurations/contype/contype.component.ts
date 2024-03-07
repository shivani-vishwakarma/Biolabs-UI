import { Component, OnInit } from '@angular/core';
import { GLOBAL } from 'src/app/shared/utility/config.service';

@Component({
  selector: 'app-contype',
  templateUrl: './contype.component.html',
  styleUrls: ['./contype.component.css']
})
export class ContypeComponent implements OnInit {
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


}
