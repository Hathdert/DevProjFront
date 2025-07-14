import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferViewCompany } from './offer-view-company';

describe('OfferViewCompany', () => {
  let component: OfferViewCompany;
  let fixture: ComponentFixture<OfferViewCompany>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferViewCompany]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferViewCompany);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
