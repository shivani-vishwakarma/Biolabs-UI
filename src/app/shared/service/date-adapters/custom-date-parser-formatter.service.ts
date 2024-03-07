import { Injectable } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

  readonly DELIMITER = ' ';
  constructor() {
    super();
  }

  parse(value: string): NgbDateStruct | null | any {
    if (value) {
      const date = value.split(this.DELIMITER);
      const months: any = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      if (months.includes(date[1])) {
        const index = months.findIndex((ele: any) => ele === date[1]);
        date[1] = index + 1;
      }
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10)
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null | any): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return date ? (date.day.toString().length === 2 ? date.day : `0${date.day}`) +
     this.DELIMITER + months[date.month - 1] + this.DELIMITER + date.year : '';
  }

  validateDate(date: any): any{
    const months: any = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dateValue = date.split('');
    const index = months.findIndex((ele: any) => ele === date[1]);
    date[1] = index + 1;
    const lastDayOfMonth = new Date(new Date().getFullYear(), Number(date[1]), 0);
    if (dateValue[0] > lastDayOfMonth.getDate() || !months.includes(dateValue[1])) {
      return 'Invalid Date';
    }
  }
}
