import {Component, EventEmitter, Input, OnInit, Output, OnDestroy} from '@angular/core';
import {ProductService} from '../../svc/product.service';
import {Router} from '@angular/router';
import {StorageService} from '../../svc/storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy {
  @Output() filter = new EventEmitter();
  constructor(private _stor_svc: StorageService, private _prod_svc: ProductService,
              private _router: Router) {
// console.log('[HeaderComp] CTOR()');
  }
  curCategory = 'All Categories';
  searchString: string;
  productList; // subset after filtering
  matchingProducts;
  showMatchList;

  productData; // full list from service
  categories;
  loginUser; // just name
  users;
  subLiu; subUsers; subProd;

  ngOnInit() {
    // attach to product stream
    this.subProd = this._prod_svc.obtainProductStream().subscribe(payload => {
      this.productData = payload;
    });
    this.categories = this._prod_svc.getCategories(); // need no subscription, static data

    // attch to login user stream
    this.subLiu = this._stor_svc.obtainLoginUserStream().subscribe(payload => {
      console.log('[HeaderComp] login user <= ', payload);
      this.loginUser = payload ? payload.loginName : ''; // stream update
    });

    // attach to users stream
    this.subUsers = this._stor_svc.obtainUsersStream().subscribe(payload => {
      console.log('[HeaderComp] users <= ', payload);
      this.users = payload;
    });
// console.log('[HeaderComp] ngOnInit()');
  }
  ngOnDestroy() {
    this.subProd.unsubscribe();
    this.subLiu.unsubscribe();
    this.subUsers.unsubscribe();
  }

  logout() { this._stor_svc.setLoginUser(null); }

  showCategoryProducts(category) {
    this.curCategory = category;
    if (category === 'All Categories') {
      this.productList = this.productData;  // pass-in product data
      this.filter.emit(this.productList); // inform listeners  TODO who is listening to this???
      return;
    }

    // subset of products of this category
    const list = []; // of product objects
    for (let idx = 0; idx < this.productData.length; idx++) {
      const cats = this.productData[idx].category;
      for (let cat_idx = 0; cat_idx < cats.length; cat_idx++) {
        if (category === cats[cat_idx]) {
          list.push(this.productData[idx]);
        }
      }
    }
    this.productList = list; // set to a smaller list
    this.filter.emit(this.productList); // inform listeners
  }

  searchStringChange(event) {
    if (event) { // is actually keys typed
      this.matchingProducts = this.findMatchingProducts(event);
      this.showMatchList = true;
    } else { // go empty
      this.showMatchList = false;
    }
  }

  getThumbnailByName(name) {
    const prd = this.getProductByName(name);
    return './assets/product/' + prd.image_url + prd.images[0];
  }

  // maybe later
  private findMatchingProducts(text) {
    const ret = []; // array of strings
    for (let idx = 0; idx < this.productData.length; idx++) {
      const dscr = this.productData[idx].name;
      if (dscr.toLowerCase().indexOf(text.toLowerCase()) >= 0) { ret.push(dscr); }
    }
    return ret;
  }
  private getProductByName(name) {
    for (let idx = 0; idx < this.productData.length; idx++) {
      if (this.productData[idx].name === name) {
        return this.productData[idx]; }
    }
    return null;
  }
  private selectProduct(index) {
    const prd_obj = this.getProductByName(this.matchingProducts[index]);
    // route to product view
    this._router.navigate(['/product', prd_obj.id]); // /product/:id
  }
}
