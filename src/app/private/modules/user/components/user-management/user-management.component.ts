import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { TreeviewItem } from 'ngx-treeview';
import { UserManagementService } from '../../services/user-management.service';
import { ROLE, CONFIG, GLOBAL } from 'src/app/shared/utility/config.service';
import { DefaultDataService } from 'src/app/shared/service/default-data.service';
import { API_URL } from 'src/app/core/constants/api-url';


@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  loading = false;
  siteDropdown = [];
  config = {
    hasAllCheckBox: false,
    hasFilter: false,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
    maxHeight: 200,
    hasDivider: false
  };
  sitesList: any = [];
  sites: TreeviewItem[] = [];

  userData: any = [];

  closeResult: string | undefined;
  siteAll: TreeviewItem[] = [];
  selectedData: any = {};
  buttonClass = '';
  userTypeArr: UserType[] = [];
  defaultUserType = '0';
  profilePic = API_URL.readProfilePic;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private authService: AuthService,
    private localStorage: LocalStorageService,
    private userMgmtService: UserManagementService,
    private defaultService: DefaultDataService
    ) {

    this.form = this.formBuilder.group({
      fName: ['', [Validators.required, Validators.pattern(CONFIG.REGEX.NAME), ]],
      lName: ['', [Validators.required, Validators.pattern(CONFIG.REGEX.NAME), ]],
      email: ['',
        [Validators.required,
        Validators.pattern(CONFIG.REGEX.EMAIL), ]
        ],
      phone: ['', [Validators.minLength(10), Validators.maxLength(15), Validators.pattern(CONFIG.REGEX.CONTACT_NUMBER)]],
      title: [''],
      site: ['', Validators.required],
      userType: [this.defaultUserType, Validators.required]
    });

  }

  ngOnInit(): void {
    this.getSiteList();
    this.getUserList();
    this.getUserType();
  }

  open(content: any, modalSize?: string) {
    this.form.reset(); // used to reset all form data
    this.form.controls.userType.setValue(this.defaultUserType);
    const size = modalSize ? modalSize : 'xl';
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size, backdrop : 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  async onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    const user = {
      email: this.form.value.email,
      role: ROLE.SITE_ADMIN,
      site_id: this.form.value.site,
      firstName: this.form.value.fName,
      lastName: this.form.value.lName,
      title: this.form.value.title,
      phoneNumber: this.form.value.phone,
      userType: this.form.value.userType,
      id: null
    };
    if (this.selectedData && this.selectedData.id) {
      user.id = this.selectedData.id;
      const response = this.userMgmtService.updateUser(user);
      response.then(data => {
        this.defaultService.updateUserSession(data);
        this.getUserList();
        this.loading = false;
        this.toastr.success(CONFIG.SUCCESS_MSG.UPDATE_ADMIN, '', {
          timeOut: 3000,
          closeButton: true
        });
        this.modalService.dismissAll();
      }, error => {
        this.getUserList();
        this.loading = false;
        // this.modalService.dismissAll()
        this.toastr.error(error ? error.message : CONFIG.ERROR_MSG.UPDATE_ADMIN, '', {
          timeOut: 3000,
          closeButton: true
        });
      });
    } else {
      const response = this.userMgmtService.addUser(user);
      response.then(data => {
        this.getUserList();
        this.loading = false;
        this.toastr.success(CONFIG.SUCCESS_MSG.ADD_ADMIN, '', {
          timeOut: 3000,
          closeButton: true
        });
        this.modalService.dismissAll();
      }, error => {
        this.getUserList();
        this.loading = false;
        // this.modalService.dismissAll()
        this.toastr.error(error ? error.message : CONFIG.ERROR_MSG.ADD_ADMIN, '', {
          timeOut: 3000,
          closeButton: true
        });
      });
    }
  }
  onSelectedChange(event: any) {
    this.form.controls.site.setValue(event);
  }

  getUserList() {
    this.spinner.show();
    const userList = this.userMgmtService.getUserList('Admin');
    userList.subscribe(resp => {
      this.spinner.hide();
      this.userData = resp;
    }, error => {
      this.spinner.hide();
      this.loading = false;
      this.toastr.error(error ? error.message : CONFIG.ERROR_MSG.LIST_RESIDENT_ADMIN, '', {
        timeOut: 3000,
        closeButton: true
      });
      this.spinner.hide();
    });
  }

  async getSiteList() {
    this.sitesList = await this.userMgmtService.getSiteList();
    this.setSiteResponseintoDropDown();
  }
// BIOL-351 siteAdmin can access only primarySites
  setSiteResponseintoDropDown(selectedItem?: string[]) {
    const primarySites = this.defaultService.getAccesibleSites();
    this.sites = [];
    const accessibleSites: any = [];
    if (this.getRole() == ROLE.SITE_ADMIN) {
      this.sitesList.find((item: any) => {
        for (const primarySite of primarySites) {
          if (item.id == primarySite) {
            accessibleSites.push(item);
          }
        }
      });
      for (const element of accessibleSites) {
        this.checkSelectedSite(selectedItem, element);
      }
    } else {
      for (const element of this.sitesList) {
        this.checkSelectedSite(selectedItem, element);
      }
    }
  }

  private checkSelectedSite(selectedItem: string[] | undefined, element: any) {
    const checked = selectedItem && selectedItem.indexOf(element.id) > -1 ? true : false;
    const option: TreeviewItem = new TreeviewItem({ text: element.name, value: element.id, checked });
    this.sites.push(option);
  }

  setEditData(userData: any) {
    this.selectedData = userData;
    this.form.patchValue({
      email: userData.email,
      fName: userData.firstName,
      lName: userData.lastName,
      title: userData.title,
      phone: userData.phoneNumber,
      site: userData.site_id,
      userType: userData.userType
    });
    const allSites = Object.assign([], this.siteAll);
    this.setSiteResponseintoDropDown(userData.site_id);
  }

  setAddModel() {
    this.submitted = false;
    this.selectedData = {};
    this.setSiteResponseintoDropDown();
  }

  async deleteUserData(): Promise<any> {
    this.loading = true;
    const response = this.userMgmtService.deleteUser(this.selectedData.id);
    response.then(data => {
        this.getUserList();
        this.loading = false;
        this.toastr.success(CONFIG.SUCCESS_MSG.DELETE_ADMIN, '', {
          timeOut: 3000,
          closeButton: true
        });
        this.modalService.dismissAll();
      }, error => {
        this.getUserList();
        this.loading = false;
        this.toastr.error(error ? error.message : CONFIG.ERROR_MSG.DELETE_ADMIN, '', {
          timeOut: 3000,
          closeButton: true
        });
      });
    this.loading = false;
    return response;
  }

  async getUserType() {
    this.userTypeArr = await this.userMgmtService.getUserType();
  }

  onImgError(event: any) {
    event.target.src = 'assets/images/default.svg';
  }

  getRole() {
    return GLOBAL.USER && GLOBAL.USER.user && GLOBAL.USER.user.role;
  }

}

export interface UserType {
  id: number;
  name: string;
}
