import { Component } from '@angular/core';
import { Marble } from '../../models/marble';
import { MarblesService } from '../../services/marables.service';

@Component({
  selector: 'app-products',
  
  imports: [],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  marbles: Marble[] = [];
  
  constructor(private marbleService: MarblesService){
    console.log('AppComponent injecting MarbleService');

  }
  
  
  ngOnInit() {
    alert('AppComponent injecting MarbleService');

    this.marbleService.getAll().subscribe(
      data => console.log('API response:', data),
      error => console.error('API error:', error)
    );
  }
}
