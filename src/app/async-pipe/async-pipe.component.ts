import { Component, OnInit } from '@angular/core';
import {UtilService} from '../util.service';
import {getDelayedValueObservable, getSingleValueObservable, getMultipleValueObservables} from '../util';
@Component({
  selector: 'app-async-pipe',
  templateUrl: './async-pipe.component.html',
  styleUrls: ['./async-pipe.component.css']
})
export class AsyncPipeComponent implements OnInit {
  show = false;
  first$: any;
  second$: any;
  third$: any;
  constructor(
    private utilService: UtilService
  ) { }
  // async pipe automatically subscribe and unsubscribe to the observables,
  // starting to subscribe when init the component, ending with unsubscribe when destroy the component
  ngOnInit() {
    this.first$ = this.utilService.getSingleValueObservable();
    this.second$ = this.utilService.getDelayedValueObservable();
    this.third$ = this.utilService.getMultipleValueObservables();
    // this.first$ = getSingleValueObservable();
    // this.second$ = getDelayedValueObservable();
    // this.third$ = getMultipleValueObservables();
  }
}
