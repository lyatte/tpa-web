import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryGameComponent } from './category-game.component';

describe('CategoryGameComponent', () => {
  let component: CategoryGameComponent;
  let fixture: ComponentFixture<CategoryGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
