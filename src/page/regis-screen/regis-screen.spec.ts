import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisScreen } from './regis-screen';

describe('RegisScreen', () => {
  let component: RegisScreen;
  let fixture: ComponentFixture<RegisScreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisScreen],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisScreen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
