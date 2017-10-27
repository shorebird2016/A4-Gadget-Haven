// A Firebase managed user list
import { Injectable } from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {Observable} from "rxjs/Observable";

@Injectable()

export class UserService {
  constructor(private _db: AngularFireDatabase) { }

  getUserList(): Observable<[any]> { return this._db.list('/user').valueChanges(); } // url already in environment.ts
  getLoginUser(): Observable<any> { // observable returned
    return this._db.object('/login-user').valueChanges();
  }
  setLoginUser(usr_obj) {
    this._db.object('/login-user').set(usr_obj);
  }

}
