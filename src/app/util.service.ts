import { Injectable } from '@angular/core';
import {of} from 'rxjs/index';
import {delay} from 'rxjs/operators';
import {Observable} from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
// the util service has been injected into root, so every component which injected this service will share it together
export class UtilService {

  constructor() { }
  public getSingleValueObservable() {
    return of('single value');
  }
  public getDelayedValueObservable() {
    return of('delayed value').pipe(
      delay(1000)
    );
  }
  public getMultipleValueObservables() {
    return new Observable<number>(observer => {
      let count = 0;
      const interval = setInterval(() => {
        observer.next(count++);
        console.log(`interval has been fired, count ${count}`);
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    });
  }
}
