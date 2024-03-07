import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.css']
})
export class ThankyouComponent implements OnInit {
  companyId = '';

  constructor(private activatedRoute: ActivatedRoute, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getCompanyId();
  }

  /**
   * Description : Get company id from active route.
   * @description : Get company id from active route.
   */
  getCompanyId() {
    if (this.activatedRoute.parent) {
      this.activatedRoute.parent.params.subscribe(params => {
        this.companyId = params.id;
      });
    }
  }

  /**
   * Description : To close the modal.
   * @description : To close the modal.
   */
  closeModal(): void {
    this.modalService.dismissAll();
  }

}
