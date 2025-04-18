import { Component } from '@angular/core';
import { HeroSectionComponent } from "../../components/hero-section/hero-section.component";
import { AboutComponent } from "../about/about.component";
import { ContactComponent } from "../contact/contact.component";
import { ContactFormComponent } from "../../components/contact-form/contact-form.component";
import { AboutSectionComponent } from "../../components/about-section/about-section.component";

@Component({
  selector: 'app-home',
  imports: [HeroSectionComponent, AboutComponent, ContactComponent, ContactFormComponent, AboutSectionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
