import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../svc/product.service';
import {CartService} from '../svc/cart.service';

@Component({  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})

export class ProductComponent implements OnInit {
  constructor(private _route: ActivatedRoute, private _svc: ProductService, private _cart_svc: CartService) { }

  productData; // clone from product service
  curProduct; // for this page
  purchaseQuantity = 1; // user entry TODO need to be initialized from cart service
  comboList; // holds dynamic list of quantities
  activeImage;

  ngOnInit() {
    // attach to product stream in service
    this._svc.obtainProductStream().subscribe((payload) => {
      this.productData = payload;
      console.log('[ProductComp] product list <= ', payload);

      // obtain product ID from routing parameter; which inherently is a BehaviorSubject
      this._route.params.subscribe((data) => {
        console.log('[ProductComp] Got product ID: ', data);
        this.curProduct = this.findProductById(data.id); // somehow {id: '1120'} was sent
        this.comboList = [];
        if (!this.curProduct || this.curProduct.inventory <= 0) { return; }
        for (let qty = 1; qty <= this.curProduct.inventory; qty++) {
          this.comboList.push(qty);
        }
        this.activeImage = this.curProduct.images[0];
      });
    });
  }

  clickThumb(index) {
    this.activeImage = this.curProduct.images[index];
  }
  getProductStatus() {
    const stat = this.curProduct.inventory;
    return stat > 0 ? stat + ' in stock' : ( (stat === -5) ? 'Back order' : 'Out of stock');
  }
  addToCart(prod_id) { this._cart_svc.addItem(prod_id, this.purchaseQuantity); }

  // find product (object) from its ID, when not found return null
  private findProductById(id) {
    if (!this.productData) { return null; } // no products to search from
    for (let idx = 0; idx < this.productData.length; idx++) {
      const prod_obj = this.productData[idx];
      if (id === prod_obj.id.toString()) {
        return prod_obj;
      }
    }
    return null; // not found
  }
}
