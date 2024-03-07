import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';
import { Observable, throwError, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { CacheService } from './cache.service';

const BASE_SERVER_URL = environment.serverUrl;

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private options = { headers: new HttpHeaders().set('Content-Type', 'application/json') };

  constructor(private httpClient: HttpClient, private cacheService: CacheService) { }

  public get(path: string, cacheMins: number = 0): Observable<any> {
    const url = BASE_SERVER_URL + path;
    const data = this.cacheService.load(url);
    if (data !== null) {
      return of<any>(data);
    }
    return this.httpClient.get(url, this.options).pipe(
      switchMap(response => {
        if (cacheMins > 0) {
          // Data will be cached
          this.cacheService.save({
            key: url,
            data: response,
            expirationMins: cacheMins
          });
        }
        return of<any>(response);
      })
      // ,catchError(this.formatErrors)
    );
  }

  public getExternal(url: string, cacheMins: number = 0): Observable<any> {
    const data = this.cacheService.load(url);
    if (data !== null) {
      return of<any>(data);
    }
    return this.httpClient.get(url, this.options).pipe(
      switchMap(response => {
        if (cacheMins > 0) {
          // Data will be cached
          this.cacheService.save({
            key: url,
            data: response,
            expirationMins: cacheMins
          });
        }
        return of<any>(response);
      })
      // ,catchError(this.formatErrors)
    );
  }

  /**
   * @description used to get the reponse in file format.
   * @param path File path
   */
  public getDownloadData(path: string): Observable<any> {
    const url = BASE_SERVER_URL + path;
    return this.httpClient.get(url, { responseType: 'blob' as 'json', observe: 'response' });
    // .pipe(catchError(this.formatErrors));
  }

  public put(path: string, body: object = {}): Observable<any> {
    return this.httpClient
      .put(BASE_SERVER_URL + path, JSON.stringify(body), this.options);
    // .pipe(catchError(this.formatErrors));
  }

  public post(path: string, body: object = {}): Observable<any> {
    return this.httpClient
      .post(BASE_SERVER_URL + path, JSON.stringify(body), this.options);
    // .pipe(catchError(this.formatErrors));
  }

  public delete(path: string): Observable<any> {
    return this.httpClient.delete(BASE_SERVER_URL + path);
    // .pipe(catchError(this.formatErrors));
  }

  public formatErrors(error: any): Observable<any> {
    // window.alert("We are unable to procees. Please try again.");
    return throwError(error.error);
  }

  /**
   * Description: used to upload the file to azure.
   * @description used to upload the file to azure.
   * @param path URL
   * @param body Formdata
   */
  public postFormData(path: string, body: object = {}) {
    return this.httpClient.post(BASE_SERVER_URL + path, body);
  }

  /**
   * Description: Get image from azure
   * @description Get image from azure
   * @param imageInfoUrl path to image
   */
  getProfileImage(imageInfoUrl: string): Observable<Blob> { // imageId: string + imageId
    return this.httpClient.get(imageInfoUrl, { responseType: 'blob' });
  }

}
