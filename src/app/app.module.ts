import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { FeaturedCollectionComponent } from './components/featured-collection/featured-collection.component';
import { AboutSectionComponent } from './components/about-section/about-section.component';
import { TestimonialsComponent } from './components/testimonials/testimonials.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { ProductGalleryComponent } from './components/product-gallery/product-gallery.component';
import { ProductFilterComponent } from './components/product-filter/product-filter.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app.routes';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    
  ],
  imports: [
   
    BrowserModule,
    FormsModule,
    AppRoutingModule,  // should include RouterModule.forRoot(routes)
    RouterModule,
    BrowserAnimationsModule,
    MatIconModule,
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    ProductsComponent,
    AboutComponent,
    ContactComponent,
    HeroSectionComponent,
    FeaturedCollectionComponent,
    AboutSectionComponent,
    TestimonialsComponent,
    ProductCardComponent,
    ProductGalleryComponent,
    ProductFilterComponent,
    ContactFormComponent,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
     FormsModule,
      ToastrModule.forRoot({
      timeOut:3000,
      positionClass:'toast-bottom-right',
      newestOnTop:false,
      
    })
  ],
  providers: [provideHttpClient()],
 
  bootstrap: []
})
export class AppModule { }