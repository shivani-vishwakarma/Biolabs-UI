import { Injectable } from '@angular/core';
import { HttpService } from '../rest/http.service';
import { API_URL } from '../constants/api-url';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpService) { }

  /**
   * Description: This method is used for login
   * @description This method is used for login
   * @param email email address of user
   * @param password password of user
   */
  login(email: string, password: string): Observable<any>  {
    const body = {
      email,
      password
    };
    const url = API_URL.login;
    return this.http.post(url, body);
  }

  /**
   * Description: This method is used to verify user
   * @description This method is used to verify user
   * @param token auth token
   */
  async verifyUser(token: string) {
    const url = API_URL.verifyUser;
    console.table({url: url + token});
    return this.http.get(url + token);
  }

  /**
   * Description: This method is used to resetPassword
   * @description This method is used to resetPassword
   * @param body password object
   */
  async resetPassword(body: object) {
    const url = API_URL.setNewPassword;
    return this.http.put(url, body);
  }

  /**
   * Description: This method is used to forgotPassword
   * @description This method is used to forgotPassword
   * @param body password object
   */
  async forgotPassword(body: object) {
    const url = API_URL.forgotPassword;
    return this.http.post(url, body);
  }

/**
 * Description: This method is used for refresh token
 * @description This method is used for refresh token
 * @param token access token
 */
 refreshToken(accessToken: string): Observable<any>  {
  const body = {
    accessToken
  };
  const url = API_URL.refreshToken;
  return this.http.post(url, body);
}

}
