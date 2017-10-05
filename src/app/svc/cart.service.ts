// A service providing CRUD for shopping cart item information
import { Injectable } from '@angular/core';
import {Warehouse} from 'ngx-warehouse';
import {ICartItem} from '../intf/cart-item';

@Injectable()

export class CartService {
  constructor(private _svc: Warehouse) {
    this.getItem('cart').subscribe((data) => {
        this.cartData = data;
        if (data === null) { this.cartData = []; } // empty
        console.log('[CartService] Cart data <= ', data);
      }, () => { console.log('[CartService] Error reading cart data'); }
    );
  }

  private cartData: ICartItem[]; // get from LS at CTOR()

  // -----C of CRUD for cart data-----
  addItem(product_id, qty) {
    // if product exists, increase quantity, otherwise add new element
    const item = this.findItem(product_id);
    if (item === null) {
      this.cartData.push({ productId: product_id, quantity: qty });
    } else { item.quantity += qty; }
    this.setItem('cart', this.cartData).subscribe((data) => {
      console.log('[CartService] After adding new item => ', data);
    }, () => { console.log('[CartService] Error adding new item'); });
  }
  // -----R of CRUD for cart data-----
  getCartData() {
    return this.cartData;
  }
  // -----U of CRUD for cart data-----
  incItemQuantity(item_index) { this.cartData[item_index].quantity++; }
  decItemQuantity(item_index) { this.cartData[item_index].quantity--; }
  // -----D of CRUD for cart data-----
  removeItem(item_index) { this.cartData.splice(item_index, 1); }

  // helpers
  // find if a product is in cart
  findItem(product_id) {
    for (let idx = 0; idx < this.cartData.length; idx++) {
      const item = this.cartData[idx];
      if (item.productId === product_id) { return item; }
    }
    return null;
  }
  // lower layer access
  getItem(key) { return this._svc.get(key); }
  setItem(key, value) { return this._svc.set(key, value); }
}
