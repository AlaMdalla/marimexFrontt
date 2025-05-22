import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMarbelsDisplayComponent } from './admin-marbels-display.component';

describe('AdminMarbelsDisplayComponent', () => {
  let component: AdminMarbelsDisplayComponent;
  let fixture: ComponentFixture<AdminMarbelsDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMarbelsDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMarbelsDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
