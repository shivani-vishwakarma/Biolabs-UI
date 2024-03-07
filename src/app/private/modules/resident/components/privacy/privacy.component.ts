
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PrivacyService } from 'src/app/core/services/privacy.service';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent implements OnInit {
  companyName: any = '';
  data: any;
  form!: FormGroup;

  constructor(
    private privacyService: PrivacyService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getPrivacyByCompanyId();
    this.form = this.formBuilder.group({
      patentsFiledAndGranted: [true ],
      clinicalTrialInformation: [true ],
      sharePitchDeck: [true ],
      fundingSource: [true ],
      fundingAmount: [ true],
      companySize: [true ],
      advisoryBoard: [true ],
      partnershipWithAcademia: [true ],
      partnershipsWithIndustry: [ true],
    });
  }


  async getPrivacyByCompanyId() {
    if (this.activatedRoute.parent) {
      this.activatedRoute.parent.params.subscribe(async params => {
        await (await this.privacyService.getPrivacyCompanyById(params.id)).subscribe(res => {
          this.data = res;
          this.companyName = res.companyName;
          this.form.patchValue(this.data);
        });
      });
    }
  }

  async updatePrivacydetails(e: any) {
    (await this.privacyService.updatePrivacyDataById(this.data.id, this.form.value))
      .subscribe(res => {
      });
  }
}



