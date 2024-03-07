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
import { ROLE, CONFIG } from 'src/app/shared/utility/config.service';
import { ResidentService } from 'src/app/core/services/resident.service';
import { DefaultDataService } from 'src/app/shared/service/default-data.service';
import { API_URL } from 'src/app/core/constants/api-url';

@Component({
  selector: 'app-residentuser-management',
  templateUrl: './residentuser-management.component.html',
  styleUrls: ['./residentuser-management.component.css']
})
export class ResidentuserManagementComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  loading = false;
  // siteDropdown = []; // BIOL-207
  config = {
    hasAllCheckBox: false,
    hasFilter: false,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
    maxHeight: 200,
    hasDivider: false
  };
  // sitesList: any = []; // BIOL-207
  // sites: TreeviewItem[] = []; // BIOL-207

  userData: any = [];

  closeResult: string | undefined;
  // siteAll: TreeviewItem[] = []; // BIOL-207
  selectedData: any = {};
  buttonClass = '';
  userTypeArr: { id: number; name: string; }[] = [];
  companyArr: { id: number; companyName: string; }[] = [];
  defaultUserType = '0';
  profilePic = API_URL.readProfilePic;
  selecteSiteId: any;

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
    private residentService: ResidentService,
    private defaultService: DefaultDataService
  ) {
    this.form = this.formBuilder.group({
      fName: ['', [Validators.required, Validators.pattern(CONFIG.REGEX.NAME), ]],
      lName: ['', [Validators.required, Validators.pattern(CONFIG.REGEX.NAME), ]],
      email: ['', [Validators.required,
        Validators.pattern(CONFIG.REGEX.EMAIL), ]],
      phone: ['', [Validators.minLength(10), Validators.maxLength(15), Validators.pattern(CONFIG.REGEX.CONTACT_NUMBER)]],
      title: [''],
      // site: [null, Validators.required], // BIOL-207
      userType: [this.defaultUserType, Validators.required],
      company: [null, [Validators.required]]
    });
    // this.form.controls.site.setValue('Select Option'); // BIOL-207
  }

  ngOnInit(): void {
    // this.getSiteList(); // BIOL-207
    this.getUserList();
    this.getUserType();
    this.getCompanyList();
  }

  open(content: any, modalSize?: string) {
    this.form.reset();
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

  saveUser(userData: any) {
  }

  async onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    const user: any = {
      email: this.form.value.email,
      role: ROLE.RESIDENT_USER,
      site_id: [this.selecteSiteId],
      firstName: this.form.value.fName,
      lastName: this.form.value.lName,
      title: this.form.value.title,
      phoneNumber: this.form.value.phone,
      userType: this.form.value.userType,
      companyId: this.form.value.company,
      id: null
    };
    // if (this.selectedData && this.selectedData.id) {
    //   user["id"] = this.selectedData.id;
    //   const response = await this.userMgmtService.updateUser(user);
    //   this.getUserList();
    //   this.loading = false;
    //   this.modalService.dismissAll()
    // } else {
    //   const response = await this.userMgmtService.addUser(user);
    //   this.getUserList();
    //   this.loading = false;
    //   this.modalService.dismissAll()
    // }
    if (this.selectedData && this.selectedData.id) {
      user.id = this.selectedData.id;
      const response = this.userMgmtService.updateUser(user);
      response.then(data => {
        this.defaultService.updateUserSession(data);
        this.getUserList();
        this.loading = false;
        this.toastr.success(CONFIG.SUCCESS_MSG.UPDATE_RESIDENT_USER, '', {
          timeOut: 3000,
          closeButton: true
        });
        this.modalService.dismissAll();
      }, error => {
        this.getUserList();
        this.loading = false;
        // this.modalService.dismissAll()
        this.toastr.error(error ? error.message : CONFIG.ERROR_MSG.UPDATE_RESIDENT_USER, '', {
          timeOut: 3000,
          closeButton: true
        });
      });
    } else {
      const response = this.userMgmtService.addUser(user);
      response.then(data => {
        this.getUserList();
        this.loading = false;
        this.toastr.success(CONFIG.SUCCESS_MSG.ADD_RESIDENT_USER, '', {
          timeOut: 3000,
          closeButton: true
        });
        this.modalService.dismissAll();
      }, error => {
        this.getUserList();
        this.loading = false;
        // this.modalService.dismissAll()
        this.toastr.error(error ? error.message : CONFIG.ERROR_MSG.ADD_RESIDENT_USER, '', {
          timeOut: 3000,
          closeButton: true
        });
      });
    }
  }

  getUserList() {
    this.spinner.show();
    const userList = this.userMgmtService.getUserList('Resident_User');
    userList.subscribe(resp => {
      this.spinner.hide();
      this.userData = resp;
    }, error => {
      this.spinner.hide();
      this.loading = false;
      this.toastr.error(error ? error.message : CONFIG.ERROR_MSG.LIST_RESIDENT_USER, '', {
        timeOut: 3000,
        closeButton: true
      });
    });
  }

  /**
   * Description: Not in use
   * @description Not in use
   */
  // async getSiteList() {
  //   this.sitesList = await this.userMgmtService.getSiteList();
  //   this.setSiteResponseintoDropDown();
  // }

  /**
   * Description: Not in use
   * @description Not in use
   */
  // setSiteResponseintoDropDown(selectedItem?: string[]) {
  //   this.sites = [];
  //   for (const element of this.sitesList) {
  //     const checked = selectedItem && selectedItem.indexOf(element.id) > -1 ? true : false;
  //     const option: TreeviewItem = new TreeviewItem({ text: element.name, value: element.id, checked });
  //     this.sites.push(option);
  //   }
  // }

  setEditData(userData: any) {
    this.selectedData = userData;
    this.form.patchValue({
      email: userData.email,
      fName: userData.firstName,
      lName: userData.lastName,
      title: userData.title,
      phone: userData.phoneNumber,
      // site: userData.site_id[0], // BIOL-207
      userType: userData.userType,
      company: userData.companyId
    });
    // const allSites = Object.assign([], this.siteAll); // BIOL-207
    // this.setSiteResponseintoDropDown(userData.site_id); // BIOL-207
  }

  setAddModel() {
    this.submitted = false;
    this.selectedData = {};
    // this.setSiteResponseintoDropDown(); // BIOL-207
  }

  async deleteUserData(): Promise<any> {
    this.loading = true;
    const response = this.userMgmtService.deleteUser(this.selectedData.id);
    response.then(data => {
      this.getUserList();
      this.loading = false;
      this.toastr.success(CONFIG.SUCCESS_MSG.DELETE_RESIDENT_USER, '', {
        timeOut: 3000,
        closeButton: true
      });
      this.modalService.dismissAll();
    }, error => {
      this.getUserList();
      this.loading = false;
      this.toastr.error(error ? error.message : CONFIG.ERROR_MSG.DELETE_RESIDENT_USER, '', {
        timeOut: 3000,
        closeButton: true
      });
    });
    return response;
  }

  async getUserType() {
    this.userTypeArr = await this.userMgmtService.getUserType();
  }

  /**
   * @description This method will return list of all the resident applications
   * Description: This method will return list of all the resident applications
   */
  getCompanyList() {
    this.spinner.show();
    const list = this.residentService.getCompanies({});
    list.subscribe((resp) => {
      this.spinner.hide();
      this.companyArr = resp;
      this.companyArr.sort((a: any, b: any) => (a.companyName.toLowerCase() > b.companyName.toLowerCase() ? 1 : -1));
      this.selecteSiteId = resp && resp.length ? resp[0].siteId : '';
    }, (error) => {
      this.spinner.hide();
      console.error(error && error.message);
    });
  }

  onImgError(event: any) {
    event.target.src = 'assets/images/default.svg';
  }
}
