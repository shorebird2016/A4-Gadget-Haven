import {Component, OnDestroy, OnInit} from '@angular/core';
import {StorageService} from '../../svc/storage.service';
import {Router} from '@angular/router';

const StateList = [
  { country: 'US', state: ['CA', 'NV', 'OR' ] },
  { country: 'China', state: ['Canton', 'Sichuan', 'Shandong' ] },
  { country: 'Canada', state: ['Ontario', 'Alberta', 'Quebec' ] }
];
const CityList = [
  { state: 'CA', city: ['San Francisco', 'San Jose', 'Los Angeles' ] },
  { state: 'NV', city: ['Las Vegas', 'Reno', 'Carson City' ] },
  { state: 'OR', city: ['Portland', 'Salem', 'Beaverton' ] },
  { state: 'Canton', city: ['Guangzhou', 'Foshan', 'Shenzhen' ] },
  { state: 'Shandong', city: ['Jinan', 'Qingdao', 'Yantai' ] },
  { state: 'Sichuan', city: ['Chengdu', 'Mianyang', 'Nanchong' ] },
  { state: 'Ontario', city: ['Upland', 'Pomona', 'Fontana' ] },
  { state: 'Alberta', city: ['McMurray', 'Edmonton', 'Calgary' ] },
  { state: 'Quebec', city: ['Wendake', 'Shannon', 'Beaumont' ] }
];

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})

export class AccountComponent implements OnInit, OnDestroy {
  constructor(private _stor_svc: StorageService, private _router: Router) { }

  subLiu; subUsers; // subscriptions
  users; // from storage service, full list
  loginUser; // object
  profileLoginName; // initially from storage service
  profilePassword;
  profilePasswordConfirm;
  profileEmail;
  profileCountry = StateList[0].country;
  profileState = StateList[0].state[0];
  profileCity = CityList[0].city[0];
  profileGender = 'male';
  profileAgree = 'on';
  msg;

  ngOnInit() {
    // attach to login user stream
    this.subLiu = this._stor_svc.obtainLoginUserStream().subscribe(payload => {
      console.log('[AccountComp] login user <= ', payload);
      this.loginUser = payload;
      this.profileLoginName = ''; // object can be null initially
      if (this.loginUser) { // init fields
        const usr_obj = this.loginUser;
        this.profileLoginName = usr_obj.loginName;
        this.profilePassword = usr_obj.password;
        this.profilePasswordConfirm = usr_obj.password;
        this.profileEmail = usr_obj.email;
        this.profileCountry = usr_obj.country;
        this.profileState = usr_obj.state;
        this.profileCity = usr_obj.city;
        this.profileGender = usr_obj.gender;
      }
    });

    // attach to users stream
    this.subUsers = this._stor_svc.obtainUsersStream().subscribe(payload => {
      console.log('[AccountComp] users <= ', payload);
      this.users = payload;
    });
  }
  ngOnDestroy() {
    this.subLiu.unsubscribe();
    this.subUsers.unsubscribe();
  }

  // if already login, consider an update, otherwise add new user
  saveProfile() {
    if (!this.profileLoginName || this.profileLoginName === ''
        || this.profileLoginName.length < 5) { // check length, alphanumeric
      const msg = 'Name must be at least 5 characters.  Please re-enter.';
      // showError('name-id', msg);
      // TODO...different ways to present error
      return false; // NOTE- must return false here to not continue
    }
    const alpha_numeric = /^[a-zA-z0-9-_]+$/.test(this.profileLoginName);
    if (!alpha_numeric) { // TODO...different ways to present error
      this.msg = 'Name must contain alpha-numeric, dash, underscore characters.  Please re-enter.';
      // showError('name-id', msg);
      return false;
    }

    // validate 2 passwords are identical and not empty
    if (!this.profilePassword || !this.profilePasswordConfirm ||
        this.profilePassword !== this.profilePasswordConfirm) {
      this.msg = 'Passwords do not confirm.  Please check.';
      // showError('pwd-id', msg);
      return false; // NOTE- must return false here to not continue
    }

    // verify email must not be empty
    if (!this.profileEmail) {
      this.msg = 'Email must NOT be emtpy'; return false;
    }

    // user must click agree
    if (!this.profileAgree) {
      this.msg = 'You must agree to the term of registration.  Please check the checbox';
      // showError('agree-id', msg);
      return false; // NOTE- must return false here to not continue
    }

    // create object to save away
    const profile = {
      loginName: this.profileLoginName,
      password: this.profilePassword,
      email: this.profileEmail,
      country: this.profileCountry,
      state: this.profileState,
      city: this.profileCity,
      gender: this.profileGender
    };

    // save/update LS
    if (!this.loginUser) {
      this._stor_svc.addUser(profile);
    } else {
      this._stor_svc.updateUser(profile);
    }
    this._router.navigate(['/home']);
  }

  // helper to look up list of countries - TODO maybe using geo services REST
  getCountryList() {
    const ret = [];
    for (let idx = 0; idx < StateList.length; idx++) {
      ret.push(StateList[idx].country);
    }
    return ret;
  }

  // must use this in addition to built-in ngModel change to modify city dropdown list
  handleCountryChange() {
    const state_list = this.getStatelistByCountry(this.profileCountry);
    this.profileState = state_list[0]; // set to first state
    const city_list = this.getCitylistByState(this.profileState);
    this.profileCity = city_list[0];
  }

  // helper to look up list of states
  getStatelistByCountry(country) {
    for (let idx = 0; idx < StateList.length; idx++) {
      const ct = StateList[idx].country;
      if (ct === country) {
        return StateList[idx].state; }
    }
    return null;
  }

  // must use this in addition to built-in ngModel change to modify city dropdown list
  handleStateChange() {
    const city_list = this.getCitylistByState(this.profileState);
    this.profileCity = city_list[0];
  }

  // helper to look up list of cities
  getCitylistByState(state) {
    for (let idx = 0; idx < CityList.length; idx++) {
      const st = CityList[idx].state;
      if (st === state) {
        return CityList[idx].city;
      }
    }
    return null;
  }

  private findUserByLogin(login_name) {
    for (let idx = 0; idx < this.users.length; idx++) {
      if (login_name === this.users[idx].loginName) {
        return this.users[idx];
      }
    }
    return null;
  }

}
