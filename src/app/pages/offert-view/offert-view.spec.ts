import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffertView } from './offert-view';

describe('OffertView', () => {
  let component: OffertView;
  let fixture: ComponentFixture<OffertView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffertView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OffertView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
