// manage CRUD operations on orders, encapsulate Firebase order node access
import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import {Subscription} from 'rxjs/Subscription';

@Injectable()
export class OrderService {
  constructor(private _db: AngularFireDatabase) {
    // setup ref to DB
    this.ref_orders = this._db.list('/order');
     this.subOrders = this.ref_orders.valueChanges().subscribe(payload => {
       console.log('<OrderService> orders <= ', payload);
       this.orders = payload;
     });
  }

  private orders;
  private subOrders: Subscription;
  private ref_orders: AngularFireList<any>;

  // ----- public methods -----

  // -----C of CRUD for new orders---
  addOrder(login, items) {
    // find ref for this login
    const order = this.findOrderByLogin(login);
    this.ref_orders.push(items);
  }
  // -----C of CRUD for cart data-----
  addItem(login, product_id, qty) {// if product exists, increase quantity, otherwise add new element
    const order = this.findOrderByLogin(login);
    if (order === null) {return; }

    let item = this.findItemByOrder(order, product_id);
    const items_ref = this._db.list('/order/' + this.orders.$key + '/' + login + '/item'); // TODO replace /0??????
    if (item === null) { // new item
      item = { 'product-id': product_id, quantity: 1 };
      // items_ref.push(item);
      console.log('<OrderService> adding => ', item);
    } else {
      item.quantity += qty;
      const item_ref = this._db.list('/order/0' + login + '/item/0');
      // travrse array in item
      item_ref.update('item', item);
      console.log('<OrderService> increment quantity => ', item);
    }

    // persist to db, update order record
  }

  // ----- private methods: helpers -----
  // find if a product is already part of an order
  private findItemByOrder(order, product_id) {
    for (let idx = 0; idx < order.item.length; idx++) {
      const item = order.item[idx];
      if (item['product-id'] === product_id) { return item; }
    }
    return null;
  }

  findOrderByLogin(login) {
    for (const order of this.orders) {
      if (order.login === login) {
        return order;
      }
    }
  }
}
