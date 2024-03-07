import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DefaultDataService } from 'src/app/shared/service/default-data.service';
import { GLOBAL } from 'src/app/shared/utility/config.service';
import { GlobalSponsorService } from '../../services/global-sponsor.service';

@Component({
  selector: 'app-sptabprofile',
  templateUrl: './sptabprofile.component.html',
  styleUrls: ['./sptabprofile.component.css']
})
export class SptabprofileComponent implements OnInit {
  applicationId = '';
  globalSponsorsList: any;
  sitesList: any;
  siteName = 'Eisai';
  indusrtyItems: any;
  constructor(
    private route: ActivatedRoute,
    private globalSponsorService: GlobalSponsorService,
    private defaultDataService: DefaultDataService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params && params.id) {
        this.applicationId = params.id;
      }
    });
  }

  getRole() {
    return GLOBAL.USER && GLOBAL.USER.user && GLOBAL.USER.user.role;
  }

}
