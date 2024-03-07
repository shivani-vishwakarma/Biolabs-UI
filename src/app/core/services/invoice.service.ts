import { Injectable } from '@angular/core';
import { HttpService } from '../rest/http.service';
import { API_URL } from '../constants/api-url';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  constructor(private http: HttpService) { }

  /**
   * Description : add product form data
   * @description : add product form data
   * @param value : Form data
   */
  async addProduct(value: any) {
    const url = API_URL.invoiceOrderProduct;
    return await this.http.post(url, value).toPromise();
  }

  /**
   * @description : update product information.
   * Description : Update product information
   * @param value Form values
   * @param id OrderId.
   */
  async updateProduct(value: any, id: number) {
    const url = `${API_URL.invoiceOrderProduct}/${id}`;
    return await this.http.put(url, value).toPromise();
  }

  /**
   * @description : Get list of company applications
   * Description : Get list of company applications
   * @param OrderId OrderId.
   * @param companyId CompanyId.
   */
  getinvoiceData(OrderId: number, companyId: number) {
    const url = 'https://l-lin.github.io/angular-datatables/data/data.json';
    return this.http.get('https://l-lin.github.io/angular-datatables/data/data.json');
  }

  /**
   * @description : Get Invoice by company id and Month.
   * Description : Get Invoice by company id and Month
   * @param companyId Company Id
   * @param Month Month
   * @param year Year
   */
  getInvoiceByMonth(companyId: number, month: number, year: number) {
    let url = API_URL.invoiceOrderProduct + '?month=' + month + '&year=' + year ;
    if (companyId && companyId > 0) {
      url = url + '&companyId=' + companyId;
    }
    return this.http.get(url);
  }

  deleteProduct(id: number) {
    const url = `${API_URL.invoiceOrderProduct}/${id}`;
    return this.http.delete(url);
  }

  /**
   * Description : Get All Invoice by Month.
   * @description : Get All Invoice by Month.
   * @param month month
   * @param year Year
   * @returns return
   */
  getALLInvoiceByMonth(month: number, year: number) {
    const url = `${API_URL.invoiceOrderProduct}/all-invoice` + '?month=' + month + '&year=' + year;
    return this.http.get(url);
  }

  /**
   * Description : Get All Invoice by Month for all the sites associated with the user .
   * @description : Get All Invoice by Month for all the sites associated with the user.
   * @param month month
   * @param year Year
   * @returns return
   */
  getALLInvoiceByMonthAllSite(month: number, year: number, range: number) {
    const url = `${API_URL.invoiceOrderProduct}/all-site-invoice` + '?month=' + month + '&year=' + year + '&range=' + range;
    return this.http.get(url);
  }

  // /order-product/retainer
  async addRetainerPaidToDate(value: any){
    const url = API_URL.retainerProductToDate;
    return await this.http.post(url, value).toPromise();
  }
}
