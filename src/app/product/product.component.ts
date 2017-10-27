import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LsCartService} from '../svc/lscart.service';
import {ProductService} from '../svc/product.service';
import {UserService} from '../svc/user.service';
import {Subscription} from 'rxjs/Subscription';
import {OrderService} from '../svc/order.service';

@Component({  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})

export class ProductComponent implements OnInit, OnDestroy {
  constructor(private _route: ActivatedRoute, private _svc: ProductService, private _usr_svc: UserService,
              private _cart_svc: LsCartService,
              private _order_svc: OrderService) { }

  productData; // clone from product service
  curProduct; // for this page
  purchaseQuantity = 1; // user entry TODO need to be initialized from cart service
  comboList; // holds dynamic list of quantities
  activeImage;
  subLogin: Subscription;
  subProduct: Subscription;
  loginUser: string;

  // -----interface implementation-----
  ngOnInit() {
    // obtain login user
    this.subLogin = this._usr_svc.getLoginUser().subscribe(payload => {
      this.loginUser = (payload !== null) ? payload.login : null;
      console.log('[ProductComp] login user <= ', this.loginUser);
    });

    // attach to product stream in service
    this.subProduct = this._svc.retrieveProducts().subscribe((payload) => {
      this.productData = payload;
      console.log('[ProductComp] product listing <= ', payload);

      // obtain product ID from routing parameter; which inherently is a BehaviorSubject
      this._route.params.subscribe((data) => {
        console.log('[ProductComp] product ID: ', data);
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
  ngOnDestroy(): void {
    this.subProduct.unsubscribe();
    this.subLogin.unsubscribe();
  }

  // -----helpers-----
  clickThumb(index) {this.activeImage = this.curProduct.images[index]; }
  getProductStatus() {
    const stat = this.curProduct.inventory;
    return stat > 0 ? stat + ' in stock' : ( (stat === -5) ? 'Back order' : 'Out of stock');
  }
  addToCart(prod_id) {
    const items = [ {'product-id': 1010, quantity: 2 }, { 'product-id': 1030, quantity: 1 } ];
    const order = { login: this.loginUser, item: items };
    this._order_svc.addOrder(this.loginUser, order);

    // TODO this._order_svc.addItem(this.loginUser, prod_id, this.purchaseQuantity);

    // find if product is already in my order, yes to increment, no to add new item
    this._cart_svc.addItem(prod_id, this.purchaseQuantity);
  }

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
