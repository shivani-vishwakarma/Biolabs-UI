import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserManagementService } from '../../../user/services/user-management.service';

@Component({
  selector: 'app-member-on-tab',
  templateUrl: './member-on-tab.component.html',
  styleUrls: ['./member-on-tab.component.css']
})
export class MemberOnTabComponent implements OnInit {

  selectedId: any;
  user: any;
  constructor(private route: ActivatedRoute, private router: Router, private userMgmtService: UserManagementService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params && params.id) {
        this.selectedId = params.id;
        this.getUserById(this.selectedId);
      }
    });
  }

  /**
   * @description : Gives company application by application id
   * Description : Gives company application by application id
   * @param applicationId application Id
   */
   async getUserById(applicationId: number) {
    this.user = await this.userMgmtService.getUserById(applicationId);
  }

}
