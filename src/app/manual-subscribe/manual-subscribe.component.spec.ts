import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualSubscribeComponent } from './manual-subscribe.component';

describe('ManualSubscribeComponent', () => {
  let component: ManualSubscribeComponent;
  let fixture: ComponentFixture<ManualSubscribeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualSubscribeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualSubscribeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
