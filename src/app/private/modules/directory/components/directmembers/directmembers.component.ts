import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserManagementService } from '../../../user/services/user-management.service';
import { ResidentService } from 'src/app/core/services/resident.service';
import { API_URL } from 'src/app/core/constants/api-url';
import { CONFIG, ROLE} from 'src/app/shared/utility/config.service';
import { DefaultDataService } from 'src/app/shared/service/default-data.service';

@Component({
  selector: 'app-directmembers',
  templateUrl: './directmembers.component.html',
  styleUrls: ['./directmembers.component.css']
})
export class DirectmembersComponent implements OnInit {
  userData: any = [];
  profilePic = API_URL.readProfilePic;

  constructor(
    private userMgmtService: UserManagementService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private residentService: ResidentService,
    private defaultDataService: DefaultDataService
  ) { }

  ngOnInit(): void {
    this.getUserList();
  }

  getUserList() {
    this.spinner.show();
    const userList = this.userMgmtService.getUserList('Resident');
    userList.subscribe(resp => {
      // this.spinner.hide();
      // this.userData = resp;
      this.getCompanies(resp);
    }, error => {
      this.spinner.hide();
      this.toastr.error(error ? error.message : CONFIG.ERROR_MSG.LIST_SITE_EMPLOYEE, '', {
        timeOut: 3000,
        closeButton: true
      });
      this.spinner.hide();
    });
  }

  getCompanies(userData: []) {
    const reqParamObj: any = {
      companyVisibility: true
    };

    /** BIOL-390: Resident Admin should see only Current Member and Published companies */
    if (this.defaultDataService.getRole() == ROLE.RESIDENT) {
      reqParamObj.companyStatus = 1; // 'Current Member'
    }
    if (this.defaultDataService.getRole() == ROLE.RESIDENT_USER) {
      reqParamObj.companyStatus = 1; // 'Current Member'
    }

    this.spinner.show();
    const list = this.residentService.getCompanies(reqParamObj);
    list.subscribe((compResp: any) => {
      this.spinner.hide();
      if (userData && userData.length && compResp && compResp.length) {
        this.userData = userData.filter((o: any) => compResp.some(({ id }: any) => o.companyId === id));
      }
    }, (error) => {
      this.spinner.hide();
      console.error(error && error.message);
    });
  }

  onImgError(event: any) {
    event.target.src = 'assets/images/default.svg';
  }
}
