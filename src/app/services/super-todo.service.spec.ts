import { TestBed } from '@angular/core/testing';

import { SuperTodoService } from './super-todo.service';

describe('SuperTodoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SuperTodoService = TestBed.get(SuperTodoService);
    expect(service).toBeTruthy();
  });
});
