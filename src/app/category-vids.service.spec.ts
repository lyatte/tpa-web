import { TestBed } from '@angular/core/testing';

import { CategoryVidsService } from './category-vids.service';

describe('CategoryVidsService', () => {
  let service: CategoryVidsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryVidsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
