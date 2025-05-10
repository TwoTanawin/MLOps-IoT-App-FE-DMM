import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistorationComponent } from './registoration.component';

describe('RegistorationComponent', () => {
  let component: RegistorationComponent;
  let fixture: ComponentFixture<RegistorationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistorationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistorationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
