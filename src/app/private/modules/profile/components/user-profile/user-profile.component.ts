import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { MustMatch } from 'src/app/shared/utility/must-match.validator';
import { UserManagementService } from '../../../user/services/user-management.service';
import { GLOBAL, CONFIG } from 'src/app/shared/utility/config.service';
import { DefaultDataService } from 'src/app/shared/service/default-data.service';
import { API_URL } from 'src/app/core/constants/api-url';
import { FileService } from 'src/app/core/services/file.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  loading = false;
  changePass = false;
  userTypeArr: { id: number; name: string; }[] = [];
  editMode = false;
  user: any;
  profilePic = API_URL.readProfilePic;
  displayImg = '';
  userTypeName: string | undefined;
  mailsRequest = false;
  mailsRequestType = '';

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
    private defaultService: DefaultDataService,
    private fileService: FileService,
    private cd: ChangeDetectorRef
  ) {

    this.form = this.formBuilder.group({
      fName: ['', [Validators.required, Validators.pattern(CONFIG.REGEX.NAME)]],
      lName: ['', [Validators.required, Validators.pattern(CONFIG.REGEX.NAME)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.minLength(10), Validators.maxLength(15), Validators.pattern(CONFIG.REGEX.CONTACT_NUMBER)]],
      title: [''],
      password: ['', [Validators.pattern(new RegExp('^(((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{8,})'))]],
      confirmPassword: ['', ],
      userType: [],
      chkBox: [false],
      file: [null]
    }, {
      validator: [MustMatch('password', 'confirmPassword')
        // ,requiredIfValidator('password', this.changePass)
      ],
    });
  }

  ngOnInit(): void {
    this.user = GLOBAL.USER;
    this.getUserType();
    this.assignMailRequestToVariables();
    // this.getUser(GLOBAL.USER.user.id);
    // this.getImage();
  }

  setEditData() {
    const userData = GLOBAL.USER.user;
    this.form.patchValue({
      email: userData.email,
      fName: userData.firstName,
      lName: userData.lastName,
      title: userData.title,
      phone: userData.phoneNumber,
      userType: userData.userType
    });
  }
  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }


  /**
   * @description Used to update profile data
   * Description: Used to update profile data
   */
  async onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    // return;
    const user = {
      email: this.form.value.email,
      firstName: this.form.value.fName,
      lastName: this.form.value.lName,
      title: this.form.value.title,
      phoneNumber: this.form.value.phone,
      id: this.user.user.id,
      userType: this.form.value.userType,
      password: this.form.value.password,
      passwordConfirmation: this.form.value.confirmPassword
    };
    // this.spinner.show();
    this.submitRequest(user);
  }

  /**
   * @description Used to update profile data
   * Description: Used to update profile data
   */
  submitRequest(user: any) {
    this.loading = true;
    const response = this.userMgmtService.updateUser(user);
    response.then(data => {
      this.loading = false;
      // this.spinner.show();
      this.editMode = false;
      this.defaultService.updateUserSession(data);
      this.toastr.success(CONFIG.SUCCESS_MSG.UPDATE_USER, '', {
        timeOut: 3000,
        closeButton: true
      });
    }, error => {
      this.loading = false;
      this.toastr.error(error ? error.message : CONFIG.ERROR_MSG.UPDATE_USER, '', {
        timeOut: 3000,
        closeButton: true
      });
    });
  }

  enableEditMode() {
    this.editMode = true;
    this.setEditData();
  }
  disableEditMode() {
    this.editMode = false;
  }

  onFileChange(event: any) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      if (this.checkImageSize(file)) {
        this.uploadFile(file);
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.form.patchValue({
            file: reader.result,
          });
          this.displayImg = reader.result as string;
          // need to run CD since file load runs outside of zone
          this.cd.markForCheck();
        };
      }
    }
  }

  uploadFile(file: File) {
    this.fileService.uploadFile('user', this.user.user.id, file).subscribe((resp: any) => {
      this.user.user.imageUrl = resp.fileName; // setting filename
      this.defaultService.updateUserSession(this.user.user);
      this.assignMailRequestToVariables();
      this.toastr.success(CONFIG.SUCCESS_MSG.UPDATE_USER_PIC, '', {
        timeOut: 3000,
        closeButton: true
      });
    }, (error) => {
      this.assignMailRequestToVariables();
      this.toastr.error(error ? error.message : CONFIG.ERROR_MSG.UPDATE_USER_PIC, '', {
        timeOut: 3000,
        closeButton: true
      });
    });
  }

  /**
   * @description get image from cloud
   */
  // getImage() {
  //   this.spinner.show();
  //   const imageUrl = this.profilePic + this.user.user.imageUrl;
  //   this.fileService.getFile(imageUrl).subscribe((resp) => {
  //     this.displayImg = imageUrl;
  //     this.spinner.hide();
  //   },
  //     (error) => {
  //       this.displayImg = 'assets/images/default.svg'
  //       this.spinner.hide();
  //     });
  // }

  onImgError(event: any) {
    event.target.src = 'assets/images/default.svg';
  }

  checkImageSize(image: any) {
    if (!image.name.match(/.(jpg|jpeg|png)$/i) || image.size == 0) {
      this.toastr.error(CONFIG.FILE_CONFIG.FILE_FORMAT, ' ', {
        timeOut: 3000
      });
      return false;
    } else {
      const file = Math.round((image.size / 1024));
      if (file >= 5000) {
        this.toastr.error(CONFIG.FILE_CONFIG.FILE_SIZE, ' ', {
          timeOut: 3000
        });
        return false;
      } else {
        return true;
      }
    }
  }

  async getUserType() {
    this.userTypeArr = await this.defaultService.getUserType();
    this.userTypeName = this.userTypeArr.find(ut => ut.id == this.user.user.userType)?.name;
  }

  async getUser(id: number) {
    this.user = await this.userMgmtService.getUserById(id);
  }

  /**
   * @description Used to update mail request of sponser user
   * Description: Used to update mail request of sponser user
   */
  updateMailsRequest() {
    this.submitRequest({ ...this.getUserObject(), ...{ isRequestedMails: this.mailsRequest } });
  }

  /**
   * @description Used to update mail request frequency of sponser user
   * Description: Used to update mail request frequency of sponser user
   */
  updateMailsRequestType() {
    this.submitRequest({ ...this.getUserObject(), ...{ mailsRequestType: this.mailsRequestType } });
  }

  /**
   * @description Used to get user object to update for mail request & frequency
   * Description: Used to get user object to update for mail request & frequency
   */
  getUserObject(){
    const globalUser = GLOBAL.USER.user;
    return {
      email: globalUser.email,
      firstName: globalUser.firstName,
      lastName: globalUser.lastName,
      title: globalUser.title,
      phoneNumber: globalUser.phoneNumber,
      id: globalUser.id,
      userType: globalUser.userType
    };
  }

  /**
   * @description Used to bind to html for mail request & mail request frequency
   * Description: Used to bind to html for mail request & mail request frequency
   */
  assignMailRequestToVariables() {
    this.mailsRequest = GLOBAL.USER.user.isRequestedMails;
    this.mailsRequestType = GLOBAL.USER.user.mailsRequestType;
  }
}
