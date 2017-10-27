import { Injectable } from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';

const CATEGORIES = ['All Categories',
  'Sports & Outdoor', 'Travel Accessory', 'Camping Gear', 'Pool/Beach Accessory', 'Home Accessory',
  'Wearable Tech', 'Presentation Gadget', 'Computer Accessory', 'Workspace Gadget', 'Bedtime product',
  'Smart Living', 'Storage & Orgnization', '3D Printing', 'Home Media', 'Smart Home', 'Luxury', 'For Kids',
  'Time Keeping', 'Glow & Light', 'Loss Prevention & Security', 'Car Accessory', 'Smart Phone & Accessory',
  'Party Accessory', 'Robot', 'Headphones & Speakers', 'Garden'
];

@Injectable()

export class ProductService {
  constructor(private _svc: AngularFireDatabase) { }

  retrieveProducts() {
    return this._svc.list('/product').valueChanges();
  }

  getCategories() {
    return CATEGORIES;
  }

}
