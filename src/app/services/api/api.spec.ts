import { TestBed } from '@angular/core/testing';

import { Api } from './api';
import { provideHttpClient } from '@angular/common/http';

describe('Api', () => {
  let service: Api;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(Api);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
