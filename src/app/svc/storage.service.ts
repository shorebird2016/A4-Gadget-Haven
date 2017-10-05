// A service that provides CRUD for registered users
import { Injectable } from '@angular/core';
import {Warehouse} from 'ngx-warehouse';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class StorageService {
  constructor(public _svc: Warehouse) { // obtain user list from local storage initially
    this.getItem('users').subscribe((item) => {
      this.users = item;
      this.userSubject.next(this.users); // send to subscribers
      console.log('[StorageService] users <= ', item);
    }, () => { console.log('[StorageService] Error reading users'); }
    );

    // logged in user too
    this.getItem('log-in-user').subscribe((item) => {
      this.loginUser = item;
      this.liuSubject.next(this.loginUser); // to subscribers
      console.log('[StorageService] Login user ==> ', item);
    }, () => { console.log('[StorageService] Error reading login user...'); });
  }

  private users = [];
  private loginUser; // maybe undefined
  private userSubject = new BehaviorSubject(null); // for user array subscription
  private liuSubject = new BehaviorSubject(null); // for sending login user to subscribers

  // provide client subscription
  obtainLoginUserStream(): Observable<any> {
    return this.liuSubject.asObservable();
  }
  obtainUsersStream(): Observable<any> { return this.userSubject.asObservable(); }

  // -----C U of CRUD for login user, no D-----
  setLoginUser(user_obj) {
    if (user_obj === null) {
      this.loginUser = null;
      this.setItem('log-in-user', null);
      this.liuSubject.next(this.loginUser);
      return;
    }
    this.loginUser = user_obj;
    this.liuSubject.next(this.loginUser); // send object to subscribers
    this.setItem('log-in-user', user_obj).subscribe((item) => {
      console.log('[StorageService] Saving login user: ' + item);
    }, () => { console.log('[StorageService] Error writing login user...'); });
  }

  // -----C of CRUD for users-----
  addUser(profile_obj) {
    this.users.push(profile_obj);
    this.userSubject.next(this.users);
    this.setItem('users', this.users).subscribe((item) => {
      console.log('[StorageService] After adding new user => ', item);
    }, () => { console.log('[StorageService] Error adding new user'); });
  }

  // -----R of CRUD for users (use subscription automates it)-----
  // -----U of CRUD for users-----
  updateUser(profile_obj) {
    for (let idx = 0; idx < this.users.length; idx++) {
      if (profile_obj.loginName === this.users[idx].loginName) {
        this.users[idx] = profile_obj;  // TODO can this be done via associative array??????
        const usr_obj = this.users[idx];
        usr_obj.password = profile_obj.password;
        usr_obj.email = profile_obj.email;
        usr_obj.country = profile_obj.country;
        usr_obj.state = profile_obj.state;
        usr_obj.city = profile_obj.city;
        usr_obj.gender = profile_obj.gender;
        this.userSubject.next(this.users);
        this.setItem('users', this.users).subscribe((item) => {
          console.log('[StorageService] After replacement => ', item);
        }, () => { console.log('[StorageService] Error replacing user'); });

        // also need to update login user since it's an object
        this.setLoginUser(usr_obj);
        return;
      }
    }
  }

  // -----D of CRUD for users-----
  removeUser(profile_obj) {
    for (let idx = 0; idx < this.users.length; idx++) {
      if (profile_obj.loginName === this.users[idx].loginName) {
        this.users.splice(idx, 1);
        this.userSubject.next(this.users); // notify subscribers
        this.setItem('users', this.users).subscribe((item) => {
          console.log('[StorageService] After deletion => ', item);
        }, () => { console.log('[StorageService] Error deleting user'); });
      }
    }
  }

  // helpers
  // lower layer access
  getItem(key) { return this._svc.get(key); }
  setItem(key, value) { return this._svc.set(key, value); }
}
