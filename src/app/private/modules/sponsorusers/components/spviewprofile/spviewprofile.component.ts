import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { API_URL } from 'src/app/core/constants/api-url';
import { DefaultDataService } from 'src/app/shared/service/default-data.service';
import { CONFIG, GLOBAL } from 'src/app/shared/utility/config.service';
import { GlobalSponsorService } from '../../services/global-sponsor.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-spviewprofile',
  templateUrl: './spviewprofile.component.html',
  styleUrls: ['./spviewprofile.component.css']
})
export class SpviewprofileComponent implements OnInit {
  @ViewChild('thankYou') thankYou: ElementRef | undefined;
  @ViewChild('msgToSponsor') msgToSponsor: ElementRef | undefined;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  globalSponsorsList: any;
  industryNameArr: string[] = [];
  modalityNameArr: string[] = [];
  sponsorLogoUrl: any = API_URL.readSponsorLogoURL;
  sitesList: any;
  companyId: any;
  company: any;
  likeToJoin: { id: number; name: string; } | undefined;
  siteName = 'Eisai';
  indusrtyItems: any;
  message: any;
  isConnected = false;
  isConnectAppValid = false;

  constructor(
    private globalSponsorService: GlobalSponsorService,
    private defaultDataService: DefaultDataService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private modalService: NgbModal
  ) { }
  ngOnInit(): void {
    this.route?.parent?.params.subscribe(async params => {
      this.companyId = params.id;
      this.getGlobalSponsors(this.companyId);
    });
  }
  async getGlobalSponsors(id: number) {
    this.spinner.show();
    this.sitesList = await this.defaultDataService.getSiteList();
    this.indusrtyItems = await this.defaultDataService.getIndustry();
    this.globalSponsorService.getGlobalSponsorCompanyById(id).subscribe((res) => {
      this.company = res.data;
      if (this.company.websiteLink) {
        this.company.websiteLink = this.addhttp(this.company.websiteLink);
      }
      this.spinner.hide();
      // this.getIndustryName(res.industry, res.sites);
    });
  }
  /**
   * Description: add http:// to a URL if it doesn't already include a protocol (e.g. http://, https://)
   * @description add http:// to a URL if it doesn't already include a protocol (e.g. http://, https://)
   * @param url website link
   */
  addhttp(url: string) {
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
      url = 'http://' + url;
    }
    return url;
  }
  filterSiteNames(sites: any) {
    let siteNames: any = [];
    if (sites && sites.length && this.sitesList && this.sitesList.length) {
      sites.forEach((element: any) => {
        const siteName = this.sitesList.find((item: any) => item.id == element);
        siteNames = siteNames.concat(siteName.name);
      });
    }
    return siteNames;
  }
  getMembers(members: any): any {
    let children: any = [];
    const flattenMembers = members.map((m: any) => {
      if (m.children && m.children.length) {
        children = [...children, ...m.children];
      }
      return m;
    });
    return flattenMembers.concat(children.length ? this.getMembers(children) : children);
  }
  filterIndustryNames(industries: any) {
    let industryNames: any = [];
    if (industries && industries.length && this.indusrtyItems && this.indusrtyItems.length) {
      const members = this.getMembers(this.indusrtyItems);
      industries.forEach((element: any) => {
        const res = members.find((item: any) => item.id == element);
        industryNames = industryNames.concat(res.name);
      });
    }
    return industryNames;
  }

  open(content: any, modalSize?: string) {
    const size = 'lg';
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size, backdrop : 'static' }).result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  closeModal(){
    this.modalService.dismissAll();
    // this.msgToSponsor?.nativeElement.click();
  }

  getRole() {
    return GLOBAL.USER && GLOBAL.USER.user && GLOBAL.USER.user.role;
  }

  async sendConnectRequest(message: any) {
    this.isConnected = true;
    const payload = {
      message: this.message,
      sponsorId: this.companyId
    };
    this.msgToSponsor?.nativeElement.click();
    this.open(this.thankYou);
    this.isConnected = false;
    this.globalSponsorService.sendConnectRequest(payload).subscribe(res => {
      this.message = null;
    });
    // const sendMail = await this.globalSponsorService.sendMail(message);
    // sendMail.subscribe(async (res) => {
    //   if (res && res.error){
    //     this.toastr.error(res.error ? res.message : CONFIG.ERROR_MSG.UPADTE_STATUS, '', {
    //       timeOut: 3000,
    //       closeButton: true
    //     });
    //     return;
    //   }
    //   this.isConnectAppValid = true;
    //   alert('thank you')
    //   // const todayDate = this.datepipe.transform(new Date(), 'dd MMM y');
    // }, (err) => {
    //   this.toastr.error(err ? err.message : CONFIG.ERROR_MSG.UPADTE_STATUS, '', {
    //     timeOut: 3000,
    //     closeButton: true
    //   });
    // });
  }
}
