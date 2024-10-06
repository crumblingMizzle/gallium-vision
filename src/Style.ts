import { CircleMarkerOptions, Icon, PolylineOptions, TileLayerOptions } from "leaflet";


const PARENT_STYLES: Record<string, PolylineOptions> = {
    "SILVERLINE": {
        "color": "#7C878E",
        "weight": 8,
        "opacity": 1.0,
    },
    "MASSPORT": {
        "color": "#003CA6",
        "weight": 8,
        "opacity": 1.0,
    },
    "WALK": {
        "color": "#273440",
        "weight": 6,
        "opacity": 1.0,
    },
    "INVISIBLE": {
        "opacity": 0.0,
    },
};

export const TRANSIT_STYLES: Record<string, PolylineOptions> = {
    "SL1": PARENT_STYLES["SILVERLINE"],
    "SL2": PARENT_STYLES["SILVERLINE"],
    "SL3": PARENT_STYLES["SILVERLINE"],
    "SL4": PARENT_STYLES["SILVERLINE"],
    "SL5": PARENT_STYLES["SILVERLINE"],
    "WALK": PARENT_STYLES["WALK"],
    "SHUTTLE": PARENT_STYLES["MASSPORT"],
};

export const STOP_MARKER_STYLE: CircleMarkerOptions = {
    radius: 3,
    fillColor: "#FFF",
    fillOpacity: 1.0,
    stroke: false,
    opacity: 1.0,
};

export const STOP_MARKER_STYLE_DEBUG: CircleMarkerOptions = {
    radius: 3,
    fillColor: "#F00",
    fillOpacity: 1.0,
    stroke: false,
    opacity: 1.0,
};

export const TILE_SERVER_URL = "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png";
export const TILE_SERVER_OPTIONS: TileLayerOptions = {
    subdomains: 'abcd',
    maxZoom: 20,
};

export const ANIMATED_MARKER_ICON = new Icon({
    iconUrl: "assets/icons/mbta.png",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
});
