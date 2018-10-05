import { Component, OnInit } from '@angular/core';
import {UtilService} from '../util.service';
import {forkJoin} from 'rxjs';
import {map} from 'rxjs/operators';
// this component does not work correctly
@Component({
  selector: 'app-fork-join',
  templateUrl: './fork-join.component.html',
  styleUrls: ['./fork-join.component.css']
})
export class ForkJoinComponent implements OnInit {
  show = false;
  values$: any;
  constructor(
    private utilService: UtilService
  ) { }

  ngOnInit() {
    this.values$ = forkJoin(
      this.utilService.getSingleValueObservable(),
      this.utilService.getDelayedValueObservable()
      // this.utilService.getMultipleValueObservables(),
    ).pipe(
      map(([first, second]) => {
        return { first, second};
      })
    );
  }
}
