import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecieverScreen } from './reciever-screen';

describe('RecieverScreen', () => {
  let component: RecieverScreen;
  let fixture: ComponentFixture<RecieverScreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecieverScreen],
    }).compileComponents();

    fixture = TestBed.createComponent(RecieverScreen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
