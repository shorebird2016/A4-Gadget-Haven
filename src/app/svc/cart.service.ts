import { Injectable } from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';

@Injectable()
export class CartService {
  constructor(private _db: AngularFireDatabase) { }

  retrieveOrders() {
    return this._db.list('order');
  }
}
