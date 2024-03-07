import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TreeviewItem } from 'ngx-treeview';
import { API_URL } from 'src/app/core/constants/api-url';
import { FileService } from 'src/app/core/services/file.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { DefaultDataService } from 'src/app/shared/service/default-data.service';
import { CONFIG, GLOBAL } from 'src/app/shared/utility/config.service';
import { GlobalSponsorService } from '../../../sponsorusers/services/global-sponsor.service';

@Component({
  selector: 'app-sponosredit',
  templateUrl: './sponosredit.component.html',
  styleUrls: ['./sponosredit.component.css']
})
export class SponosreditComponent implements OnInit {
  form: FormGroup;
  globalSponsorCompanyId: any;
  indusrtyItems: TreeviewItem[] = [];
  indusrtyItemsList: any = [];
  sites: any[] = [];
  sitesList: any[] = [];
  buttonClass = '';
  submitted: any;
  isFormSubmitted: any;
  logoFileData: any;
  sponsorLogoUrl: any = API_URL.readSponsorLogoURL;
  config = {
    hasAllCheckBox: false,
    hasFilter: false,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
    maxHeight: 500,
    hasDivider: false
  };

  @HostListener('window:beforeunload', ['$event'])
  public onPageUnload($event: BeforeUnloadEvent) {
    if (this.form.dirty && !this.isFormSubmitted) {
      $event.returnValue = true;
    }
  }
  @HostListener('document:click', ['$event'])
  async clickedOut(args: any) {
    const id = args.target.id;
    const value = this.defaultDataService.isNavigateTrue;
    if (value) {
      return;
    }
    if ((id == 'logout' || id == 'mainSiteDropdown')) {
      const isChangeVal = (this.form.dirty && !this.isFormSubmitted)
        ? window.confirm('You have unsaved changes. Are you sure you want to leave the page?')
        : true;
      this.defaultDataService.isNavigateTrue = isChangeVal;
      if (id == 'logout') {
        if (!isChangeVal) {
          return;
        }
        this.defaultDataService.logout();
      }
    }
  }

  constructor(
    private formBuilder: FormBuilder,
    private globalSponsorService: GlobalSponsorService,
    private route: ActivatedRoute,
    private defaultDataService: DefaultDataService,
    public localStorageService: LocalStorageService,
    private router: Router,
    private toastr: ToastrService,
    private cdRef: ChangeDetectorRef,
    private fileService: FileService) {

    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      contactEmail: ['', [Validators.pattern(CONFIG.REGEX.EMAIL)]],
      contactPhoneNumber: ['', [Validators.minLength(10), Validators.maxLength(15),
      Validators.pattern(CONFIG.REGEX.CONTACT_NUMBER)]],
      contactTitle: ['', [Validators.maxLength(100)]],
      logo: [''],
      active: [true],
      allowConnect: [true],
      industry: ['', [Validators.required]],
      description: ['', [Validators.maxLength(1000)]],
      contactName: ['', [Validators.maxLength(100)]],
      services_Offering: ['', [Validators.maxLength(1000)]],
      sites: [[]],
      websiteLink: ['', [Validators.pattern(CONFIG.REGEX.WEBSITE)]]
    });
    this.form.valueChanges.subscribe(data => {
      if (this.form.dirty && !this.isFormSubmitted) {
        this.defaultDataService.isNavigateTrue = false;
      }
    });
  }

  async ngOnInit() {
    await this.getIndustry();
    await this.getSites();
    this.route?.parent?.params.subscribe(async params => {
      this.globalSponsorCompanyId = params.id;
      await this.getGlobalSponsorCompanyById(this.globalSponsorCompanyId);
    });
  }

  getGlobalSponsorCompanyById(globalSponsorCompanyId: any) {
    this.globalSponsorService.getGlobalSponsorCompanyById(globalSponsorCompanyId).subscribe((res) => {
      const globalSponsorData = res.data[0];
      this.form.patchValue({
        ...globalSponsorData
      });
      this.setSiteResponseintoDropDown(globalSponsorData.sites);
      this.indusrtyItems = this.generateTreeViewOptions(this.indusrtyItemsList, globalSponsorData.industry);
    });
  }

  public async canExit(isYes?: any) {
    const value = this.defaultDataService.isNavigateTrue;
    if (value) {
      return true;
    }
    const canExitVal = (this.form.dirty && !this.isFormSubmitted)
      ? window.confirm('You have unsaved changes. Are you sure you want to leave the page?')
      : true;
    this.defaultDataService.isNavigateTrue = canExitVal;
    return canExitVal;
  }

  onSelectedIndustry(event: any) {
    if (this.form.controls.industry.value.length != event.length) {
      if (this.form.controls.industry.value.length && !event.length) {
        return;
      }
      this.form.controls.industry.markAsDirty();
    }
    this.form.controls.industry.setValue(event);
  }

  onSelectedSiteChange(event: any) {
    if (this.form.controls.sites.value.length != event.length) {
      if (this.form.controls.sites.value.length && !event.length) {
        this.form.controls.sites.setValue(event);
        return;
      }
      this.form.controls.sites.markAsDirty();
    }
    this.form.controls.sites.setValue(event);
    // this.form.controls.industry.markAsDirty();
  }

  async getIndustry() {
    this.indusrtyItemsList = await this.defaultDataService.getIndustry();
    this.indusrtyItems = this.generateTreeViewOptions(this.indusrtyItemsList);
    return this.indusrtyItemsList;
  }

  async getSites() {
    this.sitesList = await this.defaultDataService.getSiteList();
    this.setSiteResponseintoDropDown();
  }

  setSiteResponseintoDropDown(selectedItem?: string[]) {
    this.sites = [];
    if (this.sitesList && this.sitesList.length) {
      for (const element of this.sitesList) {
        const checked = selectedItem && selectedItem.indexOf(element.id) > -1 ? true : false;
        const option: TreeviewItem = new TreeviewItem({ text: element.name, value: element.id, checked });
        this.sites.push(option);
      }
    }
  }

  generateTreeViewOptions(data: any, selectedItem?: any) {
    const options: TreeviewItem[] = [];
    for (const item of data) {
      let child: TreeviewItem[] = [];
      if (item.children && item.children.length > 0) {
        child = this.generateTreeViewOptions(item.children, selectedItem);
      }
      const check = selectedItem && selectedItem.indexOf(item.id) > -1 ? true : false;
      options.push(new TreeviewItem({
        text: item.name,
        value: item.id,
        collapsed: true,
        checked: check,
        children: child
      }));
    }
    return options;
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.isFormSubmitted = true;
    const data = { ...this.form.value, id: parseInt(this.globalSponsorCompanyId, 10) };
    this.globalSponsorService.addGlobalSponsor(data).subscribe((res) => {
      if (!res) {
        return;
      }
      if (this.logoFileData) {
        this.uploadFile(this.logoFileData, this.globalSponsorCompanyId);
      } else {
        this.toastr.success(CONFIG.SUCCESS_MSG.UPDATE_SPONSOR_COMPANY, '', {
          timeOut: 3000,
          closeButton: true
        });
        this.defaultDataService.isNavigateTrue = true;
        this.router.navigate([`/sponsor-companies/${this.globalSponsorCompanyId}/sponsorview`]);
      }
    }, (error: any) => {
      this.toastr.error(error ? error.message : CONFIG.ERROR_MSG.POST_SPONSOR_COMPANY, '', {
        timeOut: 3000,
        closeButton: true
      });
    });
  }

  uploadFile(file: File, globalSponsorCompanyId: any) {
    this.fileService.uploadFile('sponsorlogo', GLOBAL.USER.user.id, file, '', globalSponsorCompanyId).subscribe((resp: any) => {
      this.toastr.success(CONFIG.SUCCESS_MSG.UPDATE_SPONSOR_COMPANY, '', {
        timeOut: 3000,
        closeButton: true
      });
      this.defaultDataService.isNavigateTrue = true;
      this.router.navigate([`/sponsor-companies/${this.globalSponsorCompanyId}/sponsorview`]);
    }, (error) => {
      this.toastr.error(error ? error.message : CONFIG.ERROR_MSG.POST_SPONSOR_COMPANY, '', {
        timeOut: 3000,
        closeButton: true
      });
    });
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      if (this.checkImageSize(file, 'logo')) {
        this.logoFileData = file;
        const reader = new FileReader();
        reader.readAsDataURL(this.logoFileData);
        reader.onload = () => {
          this.form.patchValue({
            file: reader.result,
          });
          this.sponsorLogoUrl = reader.result as string;
          this.form.controls.logo.markAsDirty();
          this.defaultDataService.isNavigateTrue = false;
          // need to run CD since file load runs outside of zone
          this.cdRef.markForCheck();
        };
      }
    }
  }

  checkImageSize(image: File, type: string) {
    if (type === 'logo') {
      if ((!image.name.match(/.(jpg|jpeg|png|svg)$/i)) || image.size == 0) {
        this.toastr.error(CONFIG.FILE_CONFIG.FILE_FORMAT, ' ', {
          timeOut: 3000
        });
        this.form.controls.logo.patchValue('');
        return false;
      } else {
        const file = Math.round((image.size / 1024));
        if (file >= 2 * 1024) {
          this.toastr.error(CONFIG.FILE_CONFIG.COMP_LOGO_SIZE, ' ', {
            timeOut: 3000
          });
          this.form.controls.logo.patchValue('');
          return false;
        } else {
          return true;
        }
      }
    }
    return true;
  }

  onImgError(event: any) {
    event.target.src = 'assets/images/default.svg';
  }
}
