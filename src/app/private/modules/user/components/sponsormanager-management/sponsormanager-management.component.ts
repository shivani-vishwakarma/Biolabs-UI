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
import { DefaultDataService } from 'src/app/shared/service/default-data.service';
import { API_URL } from 'src/app/core/constants/api-url';


@Component({
  selector: 'app-sponsormanager-management',
  templateUrl: './sponsormanager-management.component.html',
  styleUrls: ['./sponsormanager-management.component.css']
})
export class SponsormanagerManagementComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  loading = false;
  config = {
    hasAllCheckBox: false,
    hasFilter: false,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
    maxHeight: 200,
    hasDivider: false
  };

  userData: any = [];

  closeResult: string | undefined;
  selectedData: any = {};
  buttonClass = '';
  userTypeArr: any = [];
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
      email: ['', [Validators.required,
        Validators.pattern(CONFIG.REGEX.EMAIL), ]],
      phone: ['', [Validators.minLength(10), Validators.maxLength(15), Validators.pattern(CONFIG.REGEX.CONTACT_NUMBER)]],
      title: [''],
      userType: [this.defaultUserType, Validators.required]
    });

  }

  ngOnInit(): void {
    this.getUserList();
    this.getUserType();
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

  async onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    const user = {
      email: this.form.value.email,
      role: ROLE.SPONSOR_MANAGER,
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
        this.toastr.success(CONFIG.SUCCESS_MSG.UPDATE_SPONSOR_MANAGER, '', {
          timeOut: 3000,
          closeButton: true
        });
        this.modalService.dismissAll();
      }, error => {
        this.getUserList();
        this.loading = false;
        // this.modalService.dismissAll()
        this.toastr.error(error ? error.message : CONFIG.ERROR_MSG.UPDATE_SPONSOR_MANAGER, '', {
          timeOut: 3000,
          closeButton: true
        });
      });
    } else {
      const response = this.userMgmtService.addUser(user);
      response.then(data => {

        this.getUserList();
        this.loading = false;
        this.toastr.success(CONFIG.SUCCESS_MSG.ADD_SPONSOR_MANAGER, '', {
          timeOut: 3000,
          closeButton: true
        });
        this.modalService.dismissAll();
      }, error => {
        this.getUserList();
        this.loading = false;
        // this.modalService.dismissAll()
        this.toastr.error(error ? error.message : CONFIG.ERROR_MSG.ADD_SPONSOR_MANAGER, '', {
          timeOut: 3000,
          closeButton: true
        });
      });

    }
  }

  getUserList() {
    this.spinner.show();
    const userList = this.userMgmtService.getUserList('Sponsor_Manager');
    userList.subscribe(resp => {
      this.spinner.hide();
      this.userData = resp;
    }, error => {
      this.spinner.hide();
      this.loading = false;
      this.toastr.error(error ? error.message : CONFIG.ERROR_MSG.LIST_SPONSOR_MANAGER, '', {
        timeOut: 3000,
        closeButton: true
      });
      this.spinner.hide();
    });
  }

  setEditData(userData: any) {
    this.selectedData = userData;
    this.form.patchValue({
      email: userData.email,
      fName: userData.firstName,
      lName: userData.lastName,
      title: userData.title,
      phone: userData.phoneNumber,
      userType: userData.userType,
    });
  }

  setAddModel() {
    this.submitted = false;
    this.selectedData = {};
  }

  async deleteUserData(): Promise<any> {
    this.loading = true;
    const response = this.userMgmtService.deleteUser(this.selectedData.id);
    response.then(data => {
      this.getUserList();
      this.loading = false;
      this.toastr.success(CONFIG.SUCCESS_MSG.DELETE_SPONSOR_MANAGER, '', {
        timeOut: 3000,
        closeButton: true
      });
      this.modalService.dismissAll();
    }, error => {
      this.getUserList();
      this.loading = false;
      this.toastr.error(error ? error.message : CONFIG.ERROR_MSG.DELETE_SPONSOR_MANAGER, '', {
        timeOut: 3000,
        closeButton: true
      });
    });
    return response;
  }

  async getUserType() {
    this.userTypeArr = await this.userMgmtService.getUserType();
  }

  onImgError(event: any) {
    event.target.src = 'assets/images/default.svg';
  }
}
