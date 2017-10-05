import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {NgxWarehouseModule, WarehouseConfig, DRIVER_TYPE} from 'ngx-warehouse';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProductComponent } from './product/product.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { HeaderComponent } from './common/header/header.component';
import { FooterComponent } from './common/footer/footer.component';
import { LoginComponent } from './profile/login/login.component';
import { ResetPasswordComponent } from './profile/reset-password/reset-password.component';
import { AccountComponent } from './profile/account/account.component';
import { AdminComponent } from './profile/admin/admin.component';
import { CompCommComponent } from './reference/comp-comm/comp-comm.component';
import {ProductService} from './svc/product.service';
import {StorageService} from './svc/storage.service';
import {CartService} from "./svc/cart.service";

const config: WarehouseConfig = {
  driver: DRIVER_TYPE.LOCALSTORAGE,
  name: 'Shopping App',
  version: 1.0,
  storeName: 'my_storage', // Should be alphanumeric, with underscores.
  description: 'My Online Shopping Application'
};

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'product', component: ProductComponent },
  { path: 'product/:id', component: ProductComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LoginComponent },
  { path: 'reset-pwd', component: ResetPasswordComponent },
  { path: 'account', component: AccountComponent },
  { path: 'admin', component: AdminComponent },
  { path: '', component: HomeComponent } // must have this to route to default
];

@NgModule({
  declarations: [
    AppComponent, HomeComponent, ProductComponent, CartComponent, CheckoutComponent,
    HeaderComponent, FooterComponent, LoginComponent, ResetPasswordComponent, AccountComponent,
    AdminComponent, CompCommComponent
  ],
  imports: [
    BrowserModule, RouterModule.forRoot(appRoutes), HttpModule, FormsModule,
    NgxWarehouseModule.configureWarehouse(config)
  ],
  providers: [ProductService, StorageService, CartService],
  bootstrap: [AppComponent]
})
export class AppModule { }