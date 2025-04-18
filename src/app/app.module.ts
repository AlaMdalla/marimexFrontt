import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

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

@NgModule({
  declarations: [
    
  ],
  imports: [
    BrowserModule,
    
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
    ContactFormComponent
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }