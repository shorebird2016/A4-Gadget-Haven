import { TestBed, inject } from '@angular/core/testing';

import { UserService } from './user.service';
import {AngularFireDatabase} from 'angularfire2/database-deprecated';
import {FirebaseApp} from 'angularfire2';

describe('UserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService, AngularFireDatabase, FirebaseApp]
    });
  });

  it('should be created', inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));
});
