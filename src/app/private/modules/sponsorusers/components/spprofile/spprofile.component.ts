import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { DefaultDataService } from 'src/app/shared/service/default-data.service';
import { TreeviewHelper, TreeviewItem } from 'ngx-treeview';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { CONFIG, GLOBAL } from 'src/app/shared/utility/config.service';
import { ToastrService } from 'ngx-toastr';
import { FileService } from 'src/app/core/services/file.service';
import { API_URL } from 'src/app/core/constants/api-url';
import { GlobalSponsorService } from '../../services/global-sponsor.service';
import { Router } from '@angular/router';
import { HasUnsavedData } from 'src/app/core/interfaces/has-unsaved-data';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';

@Component({
  selector: 'app-spprofile',
  templateUrl: './spprofile.component.html',
  styleUrls: ['./spprofile.component.css']
})
export class SpprofileComponent implements OnInit, HasUnsavedData {
  indusrtyItems: TreeviewItem[] = [];
  indusrtyPrimaryItems: TreeviewItem[] = [];
  selectedIndustryVal: any;
  selectedPrimaryIndustry: any;
  displayImg = '';
  logoFileData: any;
  sites: any[] = [];
  sitesList: any[] = [];
  sponsorLogoUrl: any = API_URL.readSponsorLogoURL;
  form: FormGroup;
  submitted = false;
  isFormSubmitted = false;
  buttonClass = '';
  config = {
    hasAllCheckBox: false,
    hasFilter: false,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
    maxHeight: 500,
    hasDivider: false
  };
  @ViewChild('f') private ngFormRef!: NgForm;
  @ViewChild('content') content !: ElementRef<HTMLElement>;
  @HostListener('window:beforeunload', ['$event'])
  public onPageUnload($event: BeforeUnloadEvent) {
    if (this.form.dirty && !this.isFormSubmitted) {
      $event.returnValue = true;
    }
  }
  @HostListener('document:click', ['$event'])
  async clickedOut(args: any) {
    const id = args.target.id;
    const value = this.defaultData.isNavigateTrue;
    if (value) {
      return;
    }
    if ((id == 'logout' || id == 'mainSiteDropdown')) {
      const isChangeVal = (this.form.dirty && !this.isFormSubmitted)
        ? window.confirm('You have unsaved changes. Are you sure you want to leave the page?')
        : true;
      this.defaultData.isNavigateTrue = isChangeVal;
      if (id == 'logout') {
        if (!isChangeVal) {
          return;
        }
        this.defaultData.logout();
      }
    }
  }

  constructor(
    private defaultData: DefaultDataService,
    private formBuilder: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private fileService: FileService,
    private toastr: ToastrService,
    private globalSponsorService: GlobalSponsorService,
    private router: Router,
    public localStorageService: LocalStorageService,
    private modalService: NgbModal,
  ) {
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
        this.defaultData.isNavigateTrue = false;
      }
    });
  }

  ngOnInit(): void {
    this.getIndustry();
    this.getSites();
  }

  async getIndustry() {
    const indusrtyItems = await this.defaultData.getIndustry();
    this.indusrtyItems = this.generateTreeViewOptions(indusrtyItems);
    return indusrtyItems;
  }

  public canExit(isYes?: any): any {
    const value = this.defaultData.isNavigateTrue;
    if (value) {
      return true;
    }
    const canExitVal = (this.form.dirty && !this.isFormSubmitted)
      ? window.confirm('You have unsaved changes. Are you sure you want to leave the page?')
      : true;
    this.defaultData.isNavigateTrue = canExitVal;
    return canExitVal;
  }

  async getSites() {
    this.sitesList = await this.defaultData.getSiteList();
    this.setSiteResponseintoDropDown();
  }

  // onYesBtnClick(){
  //   this.isNavigate = true;
  //   this.canExit();
  // }
  setSiteResponseintoDropDown(selectedItem?: string[]) {
    this.sites = [];
    this.sitesList.sort((a: any, b: any) => (a.name > b.name ? 1 : -1));
    if (this.sitesList && this.sitesList.length) {
      for (const element of this.sitesList) {
        const checked = selectedItem && selectedItem.indexOf(element.id) > -1 ? true : false;
        const option: TreeviewItem = new TreeviewItem({ text: element.name, value: element.id, checked });
        this.sites.push(option);
      }
    }
  }

  generateTreeViewOptions(data: any) {
    const options: TreeviewItem[] = [];
    for (const item of data) {
      let child: TreeviewItem[] = [];
      if (item.children && item.children.length > 0) {
        child = this.generateTreeViewOptions(item.children);
      }
      options.push(new TreeviewItem({
        text: item.name,
        value: item.id,
        collapsed: true,
        checked: false,
        children: child,
      }));
    }
    return options;
  }

  onSelectedIndustry(event: any) {
    if (this.form.controls.industry.value.length != event.length) {
      this.form.controls.industry.markAsDirty();
    }
    this.form.controls.industry.setValue(event);
  }

  onFilterChange(event: any){
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
        this.form.controls.logo.markAsDirty();
        this.defaultData.isNavigateTrue = false;
        this.sponsorLogoUrl = reader.result as string;
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

  uploadFile(file: File, globalSponsorCompanyId: any) {
    this.fileService.uploadFile('sponsorlogo', GLOBAL.USER.user.id, file, '', globalSponsorCompanyId).subscribe((resp: any) => {
      this.toastr.success(CONFIG.SUCCESS_MSG.ADD_SPONSOR_COMPANY, '', {
        timeOut: 3000,
        closeButton: true
      });
      this.defaultData.isNavigateTrue = true;
      this.router.navigate(['/spusertab/spdata']);
    }, (error) => {
      this.toastr.error(error ? error.message : CONFIG.ERROR_MSG.POST_SPONSOR_COMPANY, '', {
        timeOut: 3000,
        closeButton: true
      });
    });
  }

  onImgError(event: any){
    event.target.src = 'assets/images/default.svg';
  }

  onSelectedSiteChange(event: any) {
    if (this.form.controls.sites.value.length != event.length) {
      this.form.controls.sites.markAsDirty();
    }
    this.form.controls.sites.setValue(event);
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.isFormSubmitted = true;
    this.globalSponsorService.addGlobalSponsor(this.form.value).subscribe((res) => {
      if (res && res.id) {
        if (this.logoFileData) {
          this.uploadFile(this.logoFileData, res.id);
        } else {
          this.toastr.success(CONFIG.SUCCESS_MSG.ADD_SPONSOR_COMPANY, '', {
            timeOut: 3000,
            closeButton: true
          });
          this.defaultData.isNavigateTrue = true;
          this.router.navigate(['/spusertab/spdata']);
        }
      }
    }, (error: any) => {
      this.toastr.error(error ? error.message : CONFIG.ERROR_MSG.POST_SPONSOR_COMPANY, '', {
        timeOut: 3000,
        closeButton: true
      });
    });
  }
}
