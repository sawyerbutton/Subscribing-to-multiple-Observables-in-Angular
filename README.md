# SubscribeObservablesInAngular

## 如何订阅Angular组件中的多个Observable

> Angular应用程序高度依赖于`RXJS`的`Observable`, 在使用这些技术构建大型前端应用程序时, 需要学习如何在组件中管理订阅多个`Observable`

> 本文将会介绍五种不同的方式用以在Angular组件中订阅多个`Observables`以及其优点和缺点

> 在举例的组件中,我们拥有三种不同的`Observables`,每个`Observables`都拥有不同的表现

1. 第一个Observable将会立刻抛出一个单个的值
2. 第二个Observable将会延迟一会抛出一个单个的值
3. 第三个Observable将会每秒抛出一个值

> 下面的服务包含了将在组件中使用的返回上述`Observable`的函数

```typescript
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
        console.log('interval has been fired');
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    });
  }
}
```

### 直接手动订阅的方式

```typescript
import {Component, OnDestroy, OnInit} from '@angular/core';
import {UtilService} from '../util.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {getDelayedValueObservable, getSingleValueObservable, getMultipleValueObservables} from '../util';

@Component({
  selector: 'app-manual-subscribe',
  templateUrl: './manual-subscribe.component.html',
  styleUrls: ['./manual-subscribe.component.css']
})
export class ManualSubscribeComponent implements OnInit, OnDestroy{
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
    // not use dependency injection
  //   getSingleValueObservable()
  //     .subscribe(value => this.first = value);
  //
  //   getDelayedValueObservable()
  //     .subscribe(value => this.second = value);
  //
  //   this.thirdSubscription = getMultipleValueObservables()
  //     .subscribe(value => this.third = value);
  }
  ngOnDestroy() {
    // if your observable has not been unsubscribe after destroy, the internal operation is still in triggering
    // this.utilService.getMultipleValueObservables()
    this.thirdSubscription.unsubscribe();
  }
}
```

> 在这个组件中只需调用`.subscribe()`来获取Observables中的事件, 对于首次使用Angular和RxJS的用户, 直接订阅Observable是开始的地方

> 优点: 手动订阅的方式简单易懂适用于单个值得情况

> 缺点: 如果Observable有多个值,我们必须手动订阅`ngOnDestroy`生命周期钩子, 并在其中取消对于多个值Observables的订阅
> 如果在组件被销毁时没有取消订阅d额Observable将会存在内存泄漏的问题

### 使用异步管道的方式

> Angular可以使用异步管道功能用以简化之前组件的某些冗余
> Async管道帮助组件知晓哪些属性是Observables,因此它可以为了组件自动订阅和取消订阅这些属性

```typescript
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
```

> 在组建中我们直接把函数的结果直接分配给组件的属性
> 在使用Observables的时候,我们规约以$为变量属性的结尾用以区分Observable属性和常见的主要属性

```html
<h2>Async Pipe</h2>

<button (click)="show = !show">Toggle</button>

<ng-container *ngIf="show">
  <p>{{first$ | async}}</p>
  <p>{{second$ | async}}</p>
  <p>multi values {{third$ | async}}</p>
</ng-container>
```

> 在我们的模板中, Async管道自动订阅和处理组件中的Observables

> 优点: 将处理Observable的繁重工作交给angular来完成

> 缺点: 当有多个Observables订阅时,这种语法会变得有点复杂,但是这并不是大问题

### 使用ForkJoin和*ngIf的方式

> 有时我们需要同时订阅多个Observable, 典型情况是使用多个HTTP请求并期待同时处理响应时

```typescript
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
```
> 在组件中使用`forkJoin`将把多个Observable组合成一个值Observable

> `forkJoin`运算符将订阅传递给它的每个Observable, 并在从所有Observable接收到值时将使用每个Observable的值进行组合发出一个新值

> `forkJoin`适用于Angular HttpClient等单值Observable

> `forkJoin`可以与`Promise.All()`类比, 区别在于一个接收Promise一个接收Observable

```html
<h2>forkJoin Operator</h2>

<button (click)="show = !show">Toggle</button>

<ng-container *ngIf="show">
  <ng-container *ngIf="values$ | async; let values;">
    <p>{{values.first}}</p>
    <p>{{values.second}}</p>
    <p>{{values.third}}</p>
  </ng-container>
</ng-container>
```

> 在模板中将利用一些Angular模板功能来处理Observables

> ng-container允许使用像`*ngIf`这样的Angular指令,而不需要过多使用div来装在结构性指令

> 通过使用`*ngIf`指令,允许异步管道进行订阅,然后将Observable中的值分配给我们可以在模板中重用的临时模板变量,这样就不必重复使用异步管道了

> 使用`forkJoin`时,直到所有Observable都传回值之前是不会返回值的

> 在演示中延迟的Observable发出其值之前,我们在模板中看不到任何值, 

> `forkJoin`可以帮助处理多个传递单值得Observable, 但是在处理传递多个值得Observable时`forkJoin`就不那么好用了

### 使用combineLatest的方式

> `combineLatest`就像是`forkJoin`的高级版本,`combineLatest`可以处理接受多个值得Observables

```typescript
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
```

> 当`combineLatest`接受每个Observables发出的值时将会将会抛出一个混合的值

> 并将在每个Observables发出新的值时持续抛出混合值

> 简单来说就是新来的混作一团一起发出

```html
<h2>combineLatest Operator</h2>

<button (click)="show = !show">Toggle</button>

<ng-container *ngIf="show">
  <ng-container *ngIf="values$ | async; let values;">
    <p>{{values.first}}</p>
    <p>{{values.second}}</p>
    <p>{{values.third}}</p>
  </ng-container>
</ng-container>
```

> `*ngIf`在模板中的应用和之前没有区别, 但是遇到多个Observables时并不是一定需要使用`forkJoin`或者`combineLatest`

### 订阅Async管道的方式

> 我们也可以使用Async管道在模板中订阅多个Observables, 而不是在组件中订阅

```typescript
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
```

> 组件与之前的示例类似,而模板则是事情变得有趣的地方

```html
<h2>Async Pipe Object</h2>
<button (click)="show = !show">Toggle</button>
<ng-container *ngIf="show">
  <ng-container *ngIf="{first: first$ | async, second: second$ |async, third: third$ | async} as values;">
    <p>{{values.first}}</p>
    <p>{{values.second}}</p>
    <p>multi values {{values.third}}</p>
  </ng-container>
</ng-container>
```

> 使用`*ngIf`和异步管道可以将每个Observable分解为一个包含每个Observable的展开值的值对象

> `*ngIf`的这种使用方式并不常见,但这种方式允许在模板中订阅多个Observable以及多次引用之
