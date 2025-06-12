import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMarbleComponent } from './edit-marble.component';

describe('EditMarbleComponent', () => {
  let component: EditMarbleComponent;
  let fixture: ComponentFixture<EditMarbleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMarbleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMarbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
