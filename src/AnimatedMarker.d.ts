import { Marker, MarkerOptions, LatLng } from "leaflet";

export interface AnimatedMarkerOptions extends MarkerOptions {
  distance?: number | undefined;
  interval?: number | undefined;
  autoStart?: boolean | undefined;
  onNext?: (next: LatLng, id: number) => void | undefined;
  clickable?: boolean | undefined;
};

export class AnimatedMarker<P = any> extends Marker {
    constructor(latlng: LatLngExpression, options?: AnimatedMarkerOptions);
    

    options: AnimatedMarkerOptions;
}