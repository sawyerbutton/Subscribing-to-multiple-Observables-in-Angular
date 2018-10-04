import { Component, OnInit } from '@angular/core';
import {UtilService} from '../util.service';

@Component({
  selector: 'app-async-pipe-objects',
  templateUrl: './async-pipe-objects.component.html',
  styleUrls: ['./async-pipe-objects.component.css']
})
export class AsyncPipeObjectsComponent implements OnInit {
  first$: any;
  second$: any;
  third$: any;
  show = false;
  constructor(
    private utilService: UtilService
  ) { }

  ngOnInit() {
    this.first$ = this.utilService.getSingleValueObservable();
    this.second$ = this.utilService.getDelayedValueObservable();
    this.third$ = this.utilService.getMultipleValueObservables();
  }

}
