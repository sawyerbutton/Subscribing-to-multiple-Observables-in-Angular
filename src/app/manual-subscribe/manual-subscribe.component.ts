import {Component, OnDestroy, OnInit} from '@angular/core';
import {UtilService} from '../util.service';
import {Subscription} from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-manual-subscribe',
  templateUrl: './manual-subscribe.component.html',
  styleUrls: ['./manual-subscribe.component.css']
})
export class ManualSubscribeComponent implements OnInit, OnDestroy {
  show = false;
  first: string;
  second: string;
  third: number;
  thirdSubscription: Subscription;
  constructor(
    private utilService: UtilService
  ) { }

  ngOnInit() {
    this.utilService.getSingleValueObservable().subscribe( data => {
      this.first = data;
    });
    this.utilService.getDelayedValueObservable().subscribe( data => {
      this.second = data;
    });
    this.thirdSubscription = this.utilService.getMultipleValueObservables().subscribe( data => {
      this.third = data;
    });
  }
  ngOnDestroy() {
    // if your observable has not been unsubscribe after destroy, the internal operation is still in triggering
    // this.utilService.getMultipleValueObservables()
    this.thirdSubscription.unsubscribe();
  }

}
