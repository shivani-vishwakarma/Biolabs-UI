import { Observable } from 'rxjs';

export interface HasUnsavedData {
    canExit: () => Observable<boolean> | Promise<boolean> | boolean;
}
