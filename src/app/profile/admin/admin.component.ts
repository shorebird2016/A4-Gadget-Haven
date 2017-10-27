import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../svc/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit, OnDestroy {
  constructor(private _usr_svc: UserService) { }

  private subUser;
  private usersRef; // db node for 'user'
  users;

  ngOnInit() {
    this.usersRef = this._usr_svc.getUserList();
    this.subUser = this.usersRef.subscribe(payload => { // subscription
      this.users = payload;
    });
  }
  ngOnDestroy() {
    this.subUser.unsubscribe();
  }

  removeUser(usr) {
    this.usersRef.remove(usr.$key);
  }

  logout() {
    // mark login user empty in local storage
    this._usr_svc.setLoginUser(null);
  }
}
