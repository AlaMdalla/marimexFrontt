import { CommonModule } from '@angular/common';
import { Component, ElementRef, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss'],
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  standalone: true
})
export class MapsComponent implements AfterViewInit {
  @ViewChild('map') mapElement!: ElementRef;
  @Output() locationSelected = new EventEmitter<google.maps.LatLngLiteral>();
  @Output() closed = new EventEmitter<void>();

  map!: google.maps.Map;
  marker!: google.maps.Marker;
  selectedLocation!: google.maps.LatLngLiteral;

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    const center = { lat: 36.8065, lng: 10.1815 }; // Tunis center

    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center,
      zoom: 8,
    });

    this.map.addListener('click', (event: google.maps.MapMouseEvent) => {
      const coords = event.latLng!.toJSON();
      this.updateMarker(coords);
    });
  }

  private updateMarker(coords: google.maps.LatLngLiteral): void {
    this.selectedLocation = coords;

    if (this.marker) {
      this.marker.setMap(null);
    }

    this.marker = new google.maps.Marker({
      position: coords,
      map: this.map,
    });
  }

  centerMapOnLocation(location: google.maps.LatLngLiteral): void {
    this.map.setCenter(location);
    this.map.setZoom(15);
  }

  getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.centerMapOnLocation(pos);
          this.updateMarker(pos);
        },
        (error) => {
          console.error('Error getting location', error);
          alert('Impossible d\'obtenir votre position actuelle');
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert("La géolocalisation n'est pas supportée par votre navigateur");
    }
  }

  validateLocation(): void {
    if (this.selectedLocation) {
      this.locationSelected.emit(this.selectedLocation);
    }
    this.close();
  }

  close(): void {
    this.closed.emit();
  }
}