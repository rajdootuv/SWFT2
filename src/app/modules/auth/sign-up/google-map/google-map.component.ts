import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss']
})
export class GoogleMapComponent implements OnInit {

  constructor(private _mdr: MatDialogRef<GoogleMapComponent>) {

  }

  display: any;
  // moveMap(event: google.maps.MapMouseEvent) {
  //   if (event.latLng != null) this.center = (event.latLng.toJSON());
  // }

  markerPositions: google.maps.LatLngLiteral[] = [];
  addMarker(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.markerPositions.push(event.latLng.toJSON());
  }


  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.display = event.latLng.toJSON();
  }

  center: google.maps.LatLngLiteral = {
    lat: 24,
    lng: 12
  };
  zoom = 5;
  // center: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom: 15,
    minZoom: 5,

  };
  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });
  }


  CloseDialog() {

    this._mdr.close(false)

  }

  Submit() {
    this._mdr.close(false)

  }

}
