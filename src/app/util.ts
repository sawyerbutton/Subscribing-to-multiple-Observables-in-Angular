import {of} from 'rxjs';
import {delay} from 'rxjs/operators';
import {Observable} from 'rxjs/internal/Observable';

// use DI to inject service rather than this way
export function getSingleValueObservable() {
  return of('single value');
}

export function getDelayedValueObservable() {
  return of('delayed value').pipe(
    delay(1000)
  );
}

export function getMultipleValueObservables() {
  return new Observable<number>(observer => {
    let count = 0;
    const interval = setInterval(() => {
      observer.next(count++);
      console.log('interval has been fired');
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  });
}
