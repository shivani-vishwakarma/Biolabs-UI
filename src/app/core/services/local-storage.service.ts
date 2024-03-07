import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private storagePrefix: string;

  constructor() {
    this.storagePrefix = 'biolab'; // use from config file
  }

  /**
   * @description Used to set local storage.
   * Description : Used to set local storage.
   * @param name name of localstorage.
   * @param value value stored in the local storage.
   */
  public set(name: string, value: any): any {
    localStorage.setItem(`${this.storagePrefix}-${name}`, JSON.stringify(value));
  }

  /**
   * @description Used to get local storage by name.
   * Description : Used to get local storage by name.
   * @param name name of localstorage
   */
  public get(name: string) {
    const ls = JSON.parse(localStorage.getItem(`${this.storagePrefix}-${name}`) || '{}');
    return ls;
  }

  /**
   * @description Used to delete local storage by its name.
   * Description : Used to delete local storage by its name.
   * @param name name of localstorage
   */
  public delete(name: string): void {
    localStorage.removeItem(`${this.storagePrefix}-${name}`);
  }

  /**
   * @description Used to delete all the local storages
   * Description : Used to delete all the local storages.
   */
  public deleteAll(): void {
    localStorage.clear();
  }
}
