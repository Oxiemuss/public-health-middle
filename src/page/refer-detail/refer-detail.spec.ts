import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferDetail } from './refer-detail';

describe('ReferDetail', () => {
  let component: ReferDetail;
  let fixture: ComponentFixture<ReferDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(ReferDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
