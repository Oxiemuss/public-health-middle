import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HisScreen } from './his-screen';

describe('HisScreen', () => {
  let component: HisScreen;
  let fixture: ComponentFixture<HisScreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HisScreen],
    }).compileComponents();

    fixture = TestBed.createComponent(HisScreen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
