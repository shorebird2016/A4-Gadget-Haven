import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

const ENDPOINT = '../assets/products.json'; // TODO later from server
const CATEGORIES = ['All Categories',
  'Sports & Outdoor', 'Travel Accessory', 'Camping Gear', 'Pool/Beach Accessory', 'Home Accessory',
  'Wearable Tech', 'Presentation Gadget', 'Computer Accessory', 'Workspace Gadget', 'Bedtime product',
  'Smart Living', 'Storage & Orgnization', '3D Printing', 'Home Media', 'Smart Home', 'Luxury', 'For Kids',
  'Time Keeping', 'Glow & Light', 'Loss Prevention & Security', 'Car Accessory', 'Smart Phone & Accessory',
  'Party Accessory', 'Robot', 'Headphones & Speakers', 'Garden'
];

@Injectable()
export class ProductService {
  private productData;
  private subject = new BehaviorSubject(null);

  // get data right away
  constructor(private _http: Http) { this.retrieveProductsFromSource(); }

  // ---provide subscription
  obtainProductStream(): Observable<any> {
    return this.subject.asObservable();
  }

  // ---read data from external source, save internally, also send to subscribers
  retrieveProductsFromSource() {
    this._http.get(ENDPOINT).subscribe((res: Response) => {
      this.productData = res.json();
      console.log('[StorageService] products => ', this.productData);
      this.subject.next(this.productData); // send to subscribers
    });
  }

  getCategories() {
    return CATEGORIES;
  }
  getProductsByCategory(category) {
    const ret = [];
    for (let prod_idx = 0; prod_idx < this.productData.length; prod_idx++) {
      // try to match all categories of this product
      const cats = this.productData[prod_idx].category;
      for (let cats_idx = 0; cats_idx < cats.length; cats_idx++) {
        if (cats[cats_idx] === category) {
          ret.push(this.productData[prod_idx]);
          break;
        }
      }
    }
    return ret;
  }

}
