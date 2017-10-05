import { Component, OnInit } from '@angular/core';
import {CartService} from '../svc/cart.service';
import {ProductService} from '../svc/product.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})

export class CartComponent implements OnInit {
  constructor(private _cart_svc: CartService, private _prod_svc: ProductService, private _router: Router) { }

  productData; subProd;

  ngOnInit() {
    // attach to product stream
    this.subProd = this._prod_svc.obtainProductStream().subscribe(payload => {
      this.productData = payload;
    });
  }

  getCartData() { return this._cart_svc.getCartData(); }
  getProductObj(item) {
    if (!this.productData) { return; }
    for (let idx = 0; idx < this.productData.length; idx++) {
      const prod = this.productData[idx];
      if (prod.id === item.productId) {
        return prod;
      }
    }
  }
  getItemImage(item) {
    const prod = this.getProductObj(item);
    if (prod === null) { return null; }
    return '../assets/product/' + prod.image_url + prod.images[0];
  }
  incItemQuantity(item_index) {this._cart_svc.incItemQuantity(item_index); }
  decItemQuantity(item_index) {this._cart_svc.decItemQuantity(item_index); }
  getItemQuantity(item_index) { return this._cart_svc.getItemQuantity(item_index); }
  removeItem(item_index) {
    if (this._cart_svc.getItemQuantity(item_index) === 0) { return; }
    this._cart_svc.removeItem(item_index); }
  calcItemSubtotal(item) {
    const prod = this.getProductObj(item);
    return prod.price * item.quantity;
  }
  calcCartTotal() {
    const cd = this.getCartData(); let sum = 0;

    cd.forEach((item, idx) => {
      const prod = this.getProductObj(cd[idx]);
      sum += prod.price * cd[idx].quantity;
    });
    return sum;
  }

  navTo(route) { this._router.navigate([route]); }
}
