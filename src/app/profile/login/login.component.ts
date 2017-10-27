import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../../svc/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild('MSG_DLG') dialog;
  constructor(private _router: Router,
              private _user_svc: UserService, private _rndr: Renderer2) {
  }

  users; subUsers; loginUser; subLiu;
  profileLogin; profilePassword; profilePasswordConfirm; profileEmail; profileCountry;
  profileState; profileCity; profileGender;

  // Life cycle callbacks
  ngOnInit() {
    this.subUsers = this._user_svc.getUserList().subscribe(payload => {
      this.users = payload;
      console.log('[LoginComp] users <= ', payload);
    });
  }

  ngOnDestroy() {
    this.subUsers.unsubscribe();
  }

  login(login_id, login_password) {
    // special user - hard coded name/password admin@admin.com/admin
    if (login_id === 'admin@admin.com' && login_password === 'admin') {
      this._router.navigate(['/admin']); // use special route for user management page
      return;
    }

    // look for this user in users
    let found = false;
    for (let idx = 0; idx < this.users.length; idx++) {
      const login = this.users[idx].login;
      const pwd = this.users[idx].password;
      if (login === login_id && pwd === login_password) { // found matching user, populate profile
        this.profileLogin = this.users[idx].login;
        this.profilePassword = pwd;
        this.profilePasswordConfirm = pwd;
        this.profileEmail = this.users[idx].email;
        this.profileCountry = this.users[idx].country;
        this.profileState = this.users[idx].state;
        this.profileCity = this.users[idx].city;
        this.profileGender = this.users[idx].gender;

        // let service track logged in user
        this._user_svc.setLoginUser(this.users[idx]); // send object
        this._router.navigate(['/home'/*, login_id*/]); // TODO handle ID
        found = true;
        break;
      }
    }
    if (!found) { // pop up dialog by manipulate DOM (display property of dialog)
      this._rndr.setStyle(this.dialog.nativeElement, 'display', 'block');
      // this.dialog.nativeElement.style.display = 'block'; NOT recommended
    }
  }
  hideDialog() {
    this._rndr.setStyle(this.dialog.nativeElement, 'display', 'none');
  }
}
