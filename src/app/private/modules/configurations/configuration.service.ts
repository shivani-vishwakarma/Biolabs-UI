import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from 'src/app/core/constants/api-url';
import { HttpService } from 'src/app/core/rest/http.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  constructor(private http: HttpService) { }
  /**
   * Description : This method is used to add product form data.
   * @description : This method is used to add product form data.
   * @param value : Form data
   */
  async addProduct(value: any) {
    return await this.http.post(API_URL.addProduct, value).toPromise();
  }
  /**
   * Description : This method is used to  get product form data.
   * @description :This method is used to  get product form data.
   */
  getProducts() {
    return this.http.get(API_URL.addProduct);
  }

  /**
   * Description : This method is used to  get productType form data.
   * @description : This method is used to  get productType form data.
   */
  getProductsType() {
    return this.http.get(API_URL.productType);
  }

  /**
   * @description :This method is used to  delete product by product Id.
   * Description :This method is used to  delete product by product Id.
   * @param productId This is product Id.
   */
  deleteProduct(id: number) {
    const url = API_URL.addProduct;
    return this.http.delete(`${url}/${id}`);
  }
  /**
   * @description : This method is used to update product information.
   * Description : This method is used to update product information.
   * @param value Form values.
   * @param productId This is product Id.
   */
  async updateProduct(value: any, id: number) {
    const url = `${API_URL.addProduct}/${id}`;
    return await this.http.put(url, value).toPromise();
  }

  /**
   * Description : This method is used to add conferenceRoom form data.
   * @description : This method is used to add conferenceRoom form data.
   * @param value : Form data
   */
  async addConferenceRoom(value: any) {
    return await this.http.post(API_URL.conferenceRoom, value).toPromise();
  }
  /**
   * Description : This method is used to  get conferenceRoom form data.
   * @description :This method is used to  get conferenceRoom form data.
   */
  getConferenceRoom() {
    return this.http.get(API_URL.conferenceRoom);
  }

  /**
   * @description :This method is used to  delete conferenceRoom by conferenceRoom Id.
   * Description :This method is used to  delete conferenceRoom by conferenceRoom Id.
   * @param productId This is product Id.
   */
  deleteConferenceRoom(id: number) {
    const url = API_URL.conferenceRoom;
    return this.http.delete(`${url}/${id}`);
  }
  /**
   * Description : This method is used to add conferenceRoom form data.
   * @description : This method is used to add conferenceRoom form data.
   * @param value : Form data
   */
  async addCostConfig(value: any) {
    return await this.http.post(API_URL.costConfig, value).toPromise();
  }
  /**
   * Description : This method is used to  get costConfig form data.
   * @description :This method is used to  get costConfig form data.
   */
  getCostConfigDetails() {
    return this.http.get(API_URL.costConfig);
  }
  /**
   * Description : This method is used to add Equipments form data.
   * @description : This method is used to add Equipments form data.
   * @param value : Form data
   */
  async addEquipments(value: any) {
    return await this.http.post(API_URL.equipment, value).toPromise();
  }
  /**
   * Description : This method is used to  get Equipments form data.
   * @description :This method is used to  get Equipments form data.
   */
  getEquipments() {
    return this.http.get(API_URL.equipment);
  }

  /**
   * @description :This method is used to  delete Equipments by Equipment Id.
   * Description :This method is used to  delete Equipments by Equipment Id.
   * @param productId This is product Id.
   */
  deleteEquipments(id: number) {
    const url = API_URL.equipment;
    return this.http.delete(`${url}/${id}`);
  }
  /**
   * Description : This method is used to add siteConfig form data.
   * @description : This method is used to add siteConfig form data.
   * @param value : Form data
   */
  async addSiteConfig(value: any) {
    return await this.http.post(API_URL.siteConfig, value).toPromise();
  }
  /**
   * Description : This method is used to  get costConfig form data.
   * @description :This method is used to  get costConfig form data.
   */
  getSiteConfigDetails(siteId: any) {
    return this.http.get(`${API_URL.siteConfig}/${siteId}`);
  }
  /**
   * Description : This method is used to add EventsandTrainings form data.
   * @description : This method is used to add EventsandTrainings form data.
   * @param value : Form data
   */
  async addEventsandTrainings(value: any) {
    return await this.http.post(API_URL.eventsandtraining, value).toPromise();
  }
  /**
   * Description : This method is used to  get EventsandTrainings form data.
   * @description :This method is used to  get EventsandTrainings form data.
   */
  getEventsandTrainings() {
    return this.http.get(API_URL.eventsandtraining);
  }

  /**
   * @description :This method is used to  delete EventsandTrainings by EventsandTrainings Id.
   * Description :This method is used to  delete EventsandTrainings by EventsandTrainings Id.
   * @param productId This is product Id.
   */
  deleteEventsandTraining(id: number) {
    const url = API_URL.eventsandtraining;
    return this.http.delete(`${url}/${id}`);
  }

  addOnboardingData(payload: any){
    return this.http.post(`${API_URL.companyOnboard}/company`, payload);
  }

  updateSequence(payload: any){
    return this.http.put(`${API_URL.companyOnboard}/sequence`, payload);
  }

  updateOnboardingData(payload: any){
    return this.http.post(`${API_URL.companyOnboard}/company`, payload);
  }

  getOnboardingData(){
    return this.http.get(`${API_URL.companyOnboard}/company`);
  }

  deleteOnboardingData(id: any){
    return this.http.delete(`${API_URL.companyOnboard}/company/${id}`);
  }

  addMemberOnboardingData(payload: any){
    return this.http.post(`${API_URL.companyOnboard}/member`, payload);
  }

  addPartnersData(payload: any){
    return this.http.post(`${API_URL.partners}`, payload);
  }

  updateMemberOnboardingData(payload: any){
    return this.http.post(`${API_URL.companyOnboard}/member`, payload);
  }

  getMemberOnboardingData(){
    return this.http.get(`${API_URL.companyOnboard}/member`);
  }

  getPartnersData(){
    return this.http.get(`${API_URL.partners}`);
  }

  getSponsorsData(){
    return this.http.get(`${API_URL.sponsors}`);
  }

  updateSponsors(payload: any){
    return this.http.put(`${API_URL.sponsors}`, payload);
  }

  deleteMemberOnboardingData(id: any){
    return this.http.delete(`${API_URL.companyOnboard}/member/${id}`);
  }

  deletePartner(id: any){
    return this.http.delete(`${API_URL.partners}/${id}`);
  }

  addOffboardingData(payload: any){
    return this.http.post(`${API_URL.companyOffboard}/company`, payload);
  }

  updateOffboardingData(payload: any){
    return this.http.post(`${API_URL.companyOffboard}/company`, payload);
  }

  getOffboardingData(){
    return this.http.get(`${API_URL.companyOffboard}/company`);
  }

  deleteOffboardingData(id: any){
    return this.http.delete(`${API_URL.companyOffboard}/company/${id}`);
  }

  addMemberOffboardingData(payload: any){
    return this.http.post(`${API_URL.companyOffboard}/member`, payload);
  }

  updateMemberOffboardingData(payload: any){
    return this.http.post(`${API_URL.companyOffboard}/member`, payload);
  }

  getMemberOffboardingData(){
    return this.http.get(`${API_URL.companyOffboard}/member`);
  }

  deleteMemberOffboardingData(id: any){
    return this.http.delete(`${API_URL.companyOffboard}/member/${id}`);
  }

  updateOffboardingSequence(payload: any){
    return this.http.put(`${API_URL.companyOffboard}/sequence`, payload);
  }
}

