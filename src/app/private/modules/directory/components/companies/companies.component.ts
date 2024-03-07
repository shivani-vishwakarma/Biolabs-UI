import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { API_URL } from 'src/app/core/constants/api-url';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { ResidentService } from 'src/app/core/services/resident.service';
import { ROLE } from 'src/app/shared/utility/config.service';
import { DefaultDataService } from 'src/app/shared/service/default-data.service';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements OnInit {
  companyList: any = [];
  logoFileSource = API_URL.readLogoURL;

  constructor(
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private residentService: ResidentService,
    private defaultDataService: DefaultDataService
  ) { }

  ngOnInit(): void {
    this.getCompanies();
  }

  /**
   * @description This method will return list of all the published resident applications
   * Description: This method will return list of all the published resident applications
   */
  getCompanies() {
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
    list.subscribe((resp) => {
      this.spinner.hide();
      this.companyList = resp;
    }, (error) => {
      this.spinner.hide();
      console.error(error && error.message);
    });
  }

  onImgError(event: any) {
    event.target.src = '/assets/images/blPlaceholder.png';
  }
}
