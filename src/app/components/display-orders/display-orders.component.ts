import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { MarblesService } from '../../services/marables.service';

@Component({
  selector: 'app-display-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './display-orders.component.html',
  styleUrls: ['./display-orders.component.scss']
})
export class DisplayOrdersComponent implements OnInit {
  commandes: any[] = [];
  filteredCommandes: any[] = [];
  isLoading: boolean = true;
  sortField: string = 'totalPrice';
  sortDirection: 'asc' | 'desc' = 'asc';
  filterText: string = '';
  current_marble: any;
  list_marbles: any[] = [];

  constructor(
    private cartService: CartService,
    private toastr: ToastrService,
    private marblesService: MarblesService
  ) {}

  ngOnInit(): void {
    this.loadCommandes();
  }

  getmarabelName(id: string):string {
    console.log("id",id);
    this.marblesService.getMarbleById(id).subscribe((res) => {
      this.current_marble = res;
      console.log("marble",this.current_marble);

return "test";
    });
    return" this.current_marble.name";
  }
  async loadCommandes(): Promise<void> {
    this.isLoading = true;
    try {
      const response = await this.cartService.getAllCommandes().toPromise();
      if (response.success) {
        this.commandes = response.data || [];
        for (const commande of this.commandes) {
          for (const marble of commande.list_marbles) {
            this.getmarabelName(marble._id);
            this.current_marble=this.marblesService.getMarbleById(marble._id);

            console.log("marble",this.current_marble);
          }
        }
        console.log(this.commandes);
      } else {
        this.toastr.error(response.message, 'Error');
        this.commandes = [];
      }
    } catch (error) {
      this.toastr.error('Failed to load orders', 'Error');
      this.commandes = [];
    }
    this.isLoading = false;
    this.applyFilterAndSort();
  }

  sortBy(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.applyFilterAndSort();
  }

  filterOrders(): void {
    this.applyFilterAndSort();
  }

  clearFilter(): void {
    this.filterText = '';
    this.applyFilterAndSort();
  }

  applyFilterAndSort(): void {
    let result = [...this.commandes];

    if (this.filterText) {
      const lowerFilter = this.filterText.toLowerCase();
      result = result.filter((commande: any) =>
        (commande.totalPrice?.toString().includes(lowerFilter) || '') ||
        (`${commande.location?.lat || ''},${commande.location?.lng || ''}`.toLowerCase().includes(lowerFilter)) ||
        commande.list_marbles.some((item: any) =>
          item.marble?.toLowerCase().includes(lowerFilter)
        )
      );
    }

    result.sort((a: any, b: any) => {
      const valueA = this.sortField === 'location' ? (a[this.sortField]?.lat || 0) : (a[this.sortField] || 0);
      const valueB = this.sortField === 'location' ? (b[this.sortField]?.lat || 0) : (b[this.sortField] || 0);
      const modifier = this.sortDirection === 'asc' ? 1 : -1;
      return valueA < valueB ? -modifier : valueA > valueB ? modifier : 0;
    });

    this.filteredCommandes = result;
  }

  openMap(lat: number, lng: number): void {
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, '_blank');
  }

  validateCommande(commande: any): void {
    console.log('Validating commande:', commande);
  }

  rejectCommande(commande: any): void {
    this.cartService.deleteCommande(commande.id).subscribe(
      () => {
        console.log("deleted");
        this.loadCommandes();
      },
      error => {
        console.log(error);
      }
    );
    console.log('Rejecting commande:', commande);
  }

  public chartType: ChartType = 'pie';

  public chartData: ChartConfiguration['data'] = {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [
      {
        label: 'Votes',
        data: [12, 19, 3],
        backgroundColor: ['red', 'blue', 'yellow']
      }
    ]
  };
}
