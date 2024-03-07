import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { HasUnsavedData } from '../interfaces/has-unsaved-data';

@Injectable({ providedIn: 'root' })
export class CanDeactivateGuard implements CanDeactivate<HasUnsavedData> {
  canDeactivate(
    component: HasUnsavedData,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | any {
    return component.canExit ? component.canExit() : true;
  }
}
