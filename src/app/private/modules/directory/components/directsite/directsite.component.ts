import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { API_URL } from 'src/app/core/constants/api-url';
import { CONFIG } from 'src/app/shared/utility/config.service';
import { UserManagementService } from '../../../user/services/user-management.service';

@Component({
  selector: 'app-directsite',
  templateUrl: './directsite.component.html',
  styleUrls: ['./directsite.component.css']
})
export class DirectsiteComponent implements OnInit {
  userData: any = [];
  selectedData: any = {};
  loading = false;
  profilePic = API_URL.readProfilePic;

  constructor(
    private userMgmtService: UserManagementService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.getUserList();
  }

  /**
   * @description This method will return list of all the Site Admins
   * Description: This method will return list of all the Site Admins
   */
  getUserList() {
    this.spinner.show();
    const userList = this.userMgmtService.getUserList('Admin');
    userList.subscribe(resp => {
      this.spinner.hide();
      this.userData = resp;
    }, error => {
      this.spinner.hide();
      this.toastr.error(error ? error.message : CONFIG.ERROR_MSG.LIST_SITE_EMPLOYEE , '', {
        timeOut: 3000,
        closeButton: true
      });
      this.spinner.hide();
    });
  }

  open(content: any, modalSize?: string) {
    const size = modalSize ? modalSize : 'xl';
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size, backdrop : 'static' }).result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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

  onImgError(event: any) {
    event.target.src = 'assets/images/default.svg';
  }
}
