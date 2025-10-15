import { TestBed } from '@angular/core/testing';

import { RequestMonitorService } from './request-monitor-service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('RequestMonitorService', () => {
  let service: RequestMonitorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(RequestMonitorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
