import {Component, OnDestroy, OnInit} from '@angular/core';
import {StorageService} from '../../svc/storage.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit, OnDestroy {
  constructor(private _svc: StorageService) { }

  private subUser;
  private users;

  ngOnInit() {
    this.subUser = this._svc.obtainUsersStream().subscribe(data => this.users = data);
  }
  ngOnDestroy() {
    this.subUser.unsubscribe();
  }

  removeUser(usr) {
    this._svc.removeUser(usr);
  }

  logout() {
    // mark login user empty in local storage
    this._svc.setLoginUser(null);
  }
}
