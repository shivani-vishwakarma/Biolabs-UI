import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResidentService } from 'src/app/core/services/resident.service';

@Component({
  selector: 'app-onboarding-tab',
  templateUrl: './onboarding-tab.component.html',
  styleUrls: ['./onboarding-tab.component.css']
})
export class OnboardingTabComponent implements OnInit {
  selectedId: any;
  company: any;
  constructor(private route: ActivatedRoute, private router: Router, private residentService: ResidentService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params && params.id) {
        this.selectedId = params.id;
        this.getCompanyById(this.selectedId);
      }
    });
  }
  /**
   * @description : Gives company application by application id
   * Description : Gives company application by application id
   * @param applicationId application Id
   */
   getCompanyById(applicationId: number) {
    this.residentService.getCompanyById(applicationId).subscribe((resp) => {
      this.company = resp;
    }, (err) => {
      if (err.statusCode == 406) {
        this.router.navigate(['/error'], { queryParams: {} });
      }
    });
  }

}
