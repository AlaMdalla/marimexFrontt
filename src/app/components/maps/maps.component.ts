import { Component ,
  
  ElementRef,
  AfterViewInit,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-maps',
  imports: [],
  templateUrl: './maps.component.html',
  styleUrl: './maps.component.scss'
})
export class MapsComponent {
  @ViewChild('map', { static: false }) mapElement!: ElementRef;
  @Output() locationSelected = new EventEmitter<google.maps.LatLngLiteral>();
  @Output() closed = new EventEmitter<void>();

  map!: google.maps.Map;
  marker!: google.maps.Marker;
  selectedLocation!: google.maps.LatLngLiteral;

  ngAfterViewInit() {
    const center = { lat: 36.8065, lng: 10.1815 }; // Example: Tunis center

    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center,
      zoom: 8,
    });

    this.map.addListener('click', (event: google.maps.MapMouseEvent) => {
      const coords = event.latLng!.toJSON();
      this.selectedLocation = coords;

      if (this.marker) {
        this.marker.setMap(null);
      }

      this.marker = new google.maps.Marker({
        position: coords,
        map: this.map,
      });
    });
  }

  validateLocation() {
    if (this.selectedLocation) {
      this.locationSelected.emit(this.selectedLocation);
    }
    this.closed.emit();
  }

  close() {
    this.closed.emit();
  }
}
