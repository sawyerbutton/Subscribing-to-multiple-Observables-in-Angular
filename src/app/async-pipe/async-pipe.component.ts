import { Component, OnInit } from '@angular/core';
import {UtilService} from '../util.service';

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

  ngOnInit() {
    this.first$ = this.utilService.getSingleValueObservable();
    this.second$ = this.utilService.getDelayedValueObservable();
    this.third$ = this.utilService.getMultipleValueObservables();
  }

}
