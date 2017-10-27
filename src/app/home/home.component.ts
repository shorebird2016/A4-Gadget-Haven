import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ProductService} from '../svc/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit, OnDestroy {
  constructor(private _svc: ProductService, private _router: Router) {}

  productData; // master DB from service, use for carousel images
  productList; // actual displayed in thumbnails below carousel
  subProduct; // observer for product data
  carouselImages;
  curCarouselProduct;
  carouselProductIndices;

  // use this formula to position sb-circle-box to center
  // dynamic circle button opacity
  styleOpacityCircle = [1]; // array of numbers matching each image, first one initially light up
  styleCircleBox; // style object for circle box
  styleSliderBoxLeft; // for sliding the view position
  // managing carousel related properties/methods
  curIndex = -1; forward = true; slideTimerId; cb_pos;

  ngOnDestroy() {
    clearInterval(this.slideTimerId); // in case the last one didn't stop
    this.subProduct.unsubscribe();
  }

  ngOnInit() {
    // attach to product listing from DB, when product data becomes available, setup carousel
    this.subProduct = this._svc.retrieveProducts().subscribe(payload => {
      console.log('[HomeComp] product listing <= ', payload);
      this.productData = payload;
      this.genCarouselImages(8); // after products data becomes available
      this.productList = this.productData;
      for (let idx = 1; idx < this.carouselImages.length; idx++) {
        this.styleOpacityCircle.push(0.3);
      }
      this.slideTimerId = setInterval(this.slideTimerTrigger.bind(this), 10000); // must use bind to keep context
      const bw = window.innerWidth;
      this.cb_pos = 100 * (bw - 35 * this.carouselImages.length) / ( bw * 2);
      this.styleCircleBox = { 'left':  this.cb_pos + '%' };
    });
  }

  // randomly select N images from 'full-image' folder of products and use for carousel slides
  genCarouselImages(count) {
    let cnt = count; const list = []; // index to product array
    while (cnt > 0) {
      const prd_idx = Math.floor(Math.random() * this.productData.length);
      if (!list.includes(prd_idx)) {
        list.push(prd_idx);
        cnt--;
      }
    }
    this.carouselProductIndices = list;
    console.log('Carousel product indices ==> ' + this.carouselProductIndices);
    const urls = [];
    for (let idx = 0; idx < list.length; idx++) {
      const pidx = list[idx];
      urls.push('../assets/product/' + this.productData[pidx].image_url + this.productData[pidx].images[0]);
    }
    this.carouselImages = urls;
    this.curCarouselProduct = this.productData[this.carouselProductIndices[0]];
  }

  // first class function to manage sliding images
  interruptSlideShow() { // stop interval, start timer 15s restart
    clearInterval(this.slideTimerId);
    this.slideTimerId = undefined;
    // start 15s timer to restart slide show
    setTimeout(this.restartTimer.bind(this), 30000); // must use bind to keep context
  }

  restartTimer() {
    console.log('========30 second timeout expired========');
    this.slideTimerId = setInterval(this.slideTimerTrigger.bind(this), 10000);
  }

  // next slide on the right
  slideForward() {
    this.interruptSlideShow();
    this.styleOpacityCircle[this.curIndex] = 0.3; // dim
    if (this.curIndex < this.carouselImages.length - 1) { // at end, don't slide further
      this.curIndex++;
      this.styleSliderBoxLeft = { 'left': (-100 * this.curIndex) + '%' };
      this.styleOpacityCircle[this.curIndex] = 1; // light up
      this.curCarouselProduct = this.productData[this.carouselProductIndices[this.curIndex]];
    }
  }

  // next slide on the left
  slideBackward() {
    this.interruptSlideShow();
    this.styleOpacityCircle[this.curIndex] = 0.3; // dim
    if (this.curIndex > 0) { // curIndex == 0 stop slide further
      this.curIndex--;
      this.styleSliderBoxLeft = {'left': (-100 * this.curIndex) + '%'};
      this.styleOpacityCircle[this.curIndex] = 1; // light up
      this.curCarouselProduct = this.productData[this.carouselProductIndices[this.curIndex]];
    }
  }

  goToSlide(index) {
    this.interruptSlideShow();
    this.curIndex = index;
    this.styleSliderBoxLeft = { 'left': (-100 * this.curIndex) + '%' };
    this.styleOpacityCircle[this.curIndex] = 1; // light up
    this.curCarouselProduct = this.productData[this.carouselProductIndices[this.curIndex]];
  }

  slideTimerTrigger() {
    const len = this.carouselImages.length;
    if (this.curIndex === len - 1 || this.curIndex === 0) { // reverse direction at boundary
      this.forward = !this.forward;
    }
    if (this.curIndex === -1) {
      this.curIndex = 0;
    } // first time
    this.styleOpacityCircle[this.curIndex] = 0.3; // dim
    if (this.forward) {
      this.curIndex++;
    } else {
      this.curIndex--;
    }
    this.styleSliderBoxLeft = { 'left': (-100 * this.curIndex) + '%' };
    this.styleOpacityCircle[this.curIndex] = 1; // light up
    this.curCarouselProduct = this.productData[this.carouselProductIndices[this.curIndex]];
      // console.log('==> ', this.curIndex, ' | ', this.styleSliderBoxLeft, ' | ', this.carouselImages[this.curIndex], ' | ',
      // this.forward ? ' Forward' : ' Backward' );
  }

  getOpacityObj(index) {
    return { 'opacity': this.styleOpacityCircle[index] };
  }

  // user clicks 'show me more' on carousel or click on thumbnail or item on search bar
  navToProduct(product_obj) { // use product id as routing param, nav to product page
    this._router.navigate(['/product', product_obj.id]);
  }

  getProductStatus(product_obj) {
    const stat = product_obj.inventory;
    return stat > 0 ? stat + ' in stock' : ( (stat === -5) ? 'Back order' : 'Out of stock');
  }

  // from header component - filtered list
  updateProductList(event) {
    this.productList = event;
  }

}
