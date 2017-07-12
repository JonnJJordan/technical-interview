import { TestBed, inject } from '@angular/core/testing';

import { SemanticAnalizerService } from './semantic-analizer.service';

describe('SemanticAnalizerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SemanticAnalizerService]
    });
  });

  it('should be created', inject([SemanticAnalizerService], (service: SemanticAnalizerService) => {
    expect(service).toBeTruthy();
  }));
});
