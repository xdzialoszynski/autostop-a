import { TestBed } from '@angular/core/testing';

import { RequestMonitorService } from './request-monitor-service';

describe('RequestMonitorService', () => {
  let service: RequestMonitorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestMonitorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
