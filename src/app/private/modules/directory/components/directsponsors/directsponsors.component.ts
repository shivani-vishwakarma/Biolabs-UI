import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserManagementService } from '../../../user/services/user-management.service';
import { ResidentService } from 'src/app/core/services/resident.service';
import { API_URL } from 'src/app/core/constants/api-url';
import { CONFIG, ROLE} from 'src/app/shared/utility/config.service';
import { DefaultDataService } from 'src/app/shared/service/default-data.service';
import { GlobalSponsorService } from '../../../sponsorusers/services/global-sponsor.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';

@Component({
  selector: 'app-directsponsors',
  templateUrl: './directsponsors.component.html',
  styleUrls: ['./directsponsors.component.css']
})
export class DirectsponsorsComponent implements OnInit {
  siteSponsorList: any = [];
  profilePic = API_URL.readSponsorLogoURL;

  constructor(
    private globalSponsorService: GlobalSponsorService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.getUserList();
  }

  getUserList() {
    this.spinner.show();
    const siteDet = this.localStorageService.get('SELECTED_SITE_DETAIL');
    this.globalSponsorService.getGlobalSiteSponsors(siteDet.id).subscribe((res) => {
      this.siteSponsorList = res.data;
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      this.toastr.error(error ? error.message : CONFIG.ERROR_MSG.LIST_SITE_SPONSOR, '', {
        timeOut: 3000,
        closeButton: true
      });
    });
  }

  onImgError(event: any) {
    event.target.src = 'assets/images/addresscard.png';
  }
}
