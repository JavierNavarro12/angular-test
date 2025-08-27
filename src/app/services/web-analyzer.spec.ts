import { TestBed } from '@angular/core/testing';

import { WebAnalyzer } from './web-analyzer';

describe('WebAnalyzer', () => {
  let service: WebAnalyzer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebAnalyzer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
