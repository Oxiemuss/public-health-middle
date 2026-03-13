import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SenderScreen } from './sender-screen';

describe('SenderScreen', () => {
  let component: SenderScreen;
  let fixture: ComponentFixture<SenderScreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SenderScreen],
    }).compileComponents();

    fixture = TestBed.createComponent(SenderScreen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
