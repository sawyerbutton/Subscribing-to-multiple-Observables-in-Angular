import { Component, OnInit } from '@angular/core';
import {UtilService} from '../util.service';
import { map} from 'rxjs/operators';
import { combineLatest} from 'rxjs';

// this component does not work correctly
@Component({
  selector: 'app-combine-latest',
  templateUrl: './combine-latest.component.html',
  styleUrls: ['./combine-latest.component.css']
})
export class CombineLatestComponent implements OnInit {
  show = false;
  values$: any;
  constructor(
    private utilService: UtilService
  ) { }

  ngOnInit() {
    this.values$ = combineLatest(
      this.utilService.getSingleValueObservable(),
      this.utilService.getDelayedValueObservable(),
      this.utilService.getMultipleValueObservables()
    ).pipe(
      map(([first, second, third]) => {
        // combineLatest returns an array of values, here we map those values to an object
        return { first, second, third };
      })
    );
  }
}
