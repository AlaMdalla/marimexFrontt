import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { MarblesService } from '../../services/marables.service';
import { ToastrService } from 'ngx-toastr';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective, } from 'ng2-charts'; // ✅ Import this


@Component({
  selector: 'app-display-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective ],
  templateUrl: './display-orders.component.html',
  styleUrls: ['./display-orders.component.scss']
})
export class DisplayOrdersComponent implements OnInit {
clearFilter() {
throw new Error('Method not implemented.');
}
  commandes: any[] = [];
  filteredCommandes: any[] = [];
  isLoading: boolean = true;
  sortField: string = 'totalPrice';
  sortDirection: 'asc' | 'desc' = 'asc';
  filterText: string = '';

  constructor(
    private cartService: CartService,
    private marblesService: MarblesService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadCommandes();
  }

  async loadCommandes(): Promise<void> {
    this.isLoading = true;
    try {
      const response = await this.cartService.getAllCommandes().toPromise();
      if (response.success) {
        this.commandes = response.data || [];
        await this.populateMarbleData();
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

  async populateMarbleData(): Promise<void> {
    const marbleIds = new Set<string>(
      this.commandes.flatMap((commande: any) =>
        commande.list_marbles.map((item: any) => item.marble)
      )
    );
    try {
      const marbleDataPromises = Array.from(marbleIds).map(id =>
        this.marblesService.getMarbleById(id).toPromise()
      );
      const marbleDataArray = await Promise.all(marbleDataPromises);
      const marbleMap = new Map(marbleDataArray.map((m: any) => [m._id, m]));
      this.commandes = this.commandes.map((commande: any) => ({
        ...commande,
        list_marbles: commande.list_marbles.map((item: any) => ({
          ...item,
          marbleData: marbleMap.get(item.marble) || { name: 'Unknown', imageurl: 'assets/placeholder.png' }
        }))
      }));
    } catch (error) {
      this.toastr.error('Failed to load marble details', 'Error');
    }
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

  applyFilterAndSort(): void {
    let result = [...this.commandes];

    if (this.filterText) {
      const lowerFilter = this.filterText.toLowerCase();
      result = result.filter((commande: any) =>
        (commande.totalPrice?.toString().includes(lowerFilter) || '') ||
        (`${commande.location?.lat || ''},${commande.location?.lng || ''}`.toLowerCase().includes(lowerFilter)) ||
        commande.list_marbles.some((item: any) =>
          item.marbleData?.name?.toLowerCase().includes(lowerFilter)
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
  // TODO: implement backend call or state update
  console.log('Validating commande:', commande);
  // You can also set a `status` field: commande.status = 'validated';
}

rejectCommande(commande: any): void {
  this.cartService.deleteCommande(commande.id).subscribe((next)=>
    {
    console.log("deleted")  
    this.loadCommandes();

  },error=>{
    console.log(error)
  }
)
  console.log('Rejecting commande:', commande);
}
//chartttt
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