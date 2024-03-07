import { Component, OnInit } from '@angular/core';
import { GLOBAL } from 'src/app/shared/utility/config.service';

@Component({
  selector: 'app-invoice-waitlist',
  templateUrl: './invoice-waitlist.component.html',
  styleUrls: ['./invoice-waitlist.component.css']
})
export class InvoiceWaitlistComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  /**
   * Description: Returns the role
   * @description Returns the role
   */
   getRole() {
    return GLOBAL.USER && GLOBAL.USER.user && GLOBAL.USER.user.role;
  }

}
