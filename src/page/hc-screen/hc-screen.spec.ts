import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HcScreen } from './hc-screen';

describe('HcScreen', () => {
  let component: HcScreen;
  let fixture: ComponentFixture<HcScreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HcScreen],
    }).compileComponents();

    fixture = TestBed.createComponent(HcScreen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
