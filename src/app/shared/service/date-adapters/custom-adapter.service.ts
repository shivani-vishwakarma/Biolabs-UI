import { Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {

  readonly DELIMITER = '-';

  fromModel(value: string | null): NgbDateStruct | null | any{
    if (value) {
      let date = value.split(this.DELIMITER);
      if (date.length === 1) {
        date =  value.split(' ');
        const months: any = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const index = months.findIndex((ele: any) => ele === date[1]);
        date[1] = index + 1;
      }
      return {
        day : parseInt(date[0], 10),
        month : parseInt(date[1], 10),
        year : parseInt(date[2], 10)
      };
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): string | null | any{
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;
    // return date;
  }
}
