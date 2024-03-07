import { Component, OnInit } from '@angular/core';
import { GLOBAL } from 'src/app/shared/utility/config.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * Description: This method is used to return the role.
   * @description This method is used to return the role.
   */
   getRole() {
    return GLOBAL.USER && GLOBAL.USER.user && GLOBAL.USER.user.role;
  }
}
