import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsyncPipeObjectsComponent } from './async-pipe-objects.component';

describe('AsyncPipeObjectsComponent', () => {
  let component: AsyncPipeObjectsComponent;
  let fixture: ComponentFixture<AsyncPipeObjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsyncPipeObjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsyncPipeObjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
