import { Map, Control, Icon, DomUtil, tileLayer, Marker, LatLng, LeafletMouseEvent, Polyline, Layer, CircleMarker, LeafletEvent, PolylineOptions, DomEvent, LatLngBounds, Rectangle, TileLayer } from "leaflet";
import * as K from 'leaflet-gpx';

import { AnimatedMarker } from "./AnimatedMarker";
import { PILLS, COMPLETION } from './Assets';
import { ANIMATED_MARKER_ICON, TILE_SERVER_OPTIONS, TILE_SERVER_URL, TRANSIT_STYLES } from './Style';
import { StopInfo } from "./Stop";
import { AddRoute } from "./Route";



let tracePath: LatLng[];
let animatedMarker : AnimatedMarker;
let stops: StopInfo[];
let stopListing: Control;
let primary_map: Map;
let position = 0;

/*
const clickHandler = (event: LeafletMouseEvent) => {
    const point = event.latlng;
    let closest_index = -1;
    let closest_dist = Infinity;
    for (let i = 0; i < tracePath.length; i++) {
        const other_point = tracePath[i];
        const dist = Math.sqrt(Math.pow(point.lat - other_point.lat, 2) + Math.pow(point.lng - other_point.lng, 2));
        if (dist < closest_dist) {
            closest_dist = dist;
            closest_index = i;
        }
    }
    console.log(closest_index);
    console.log(animatedMarker);
    animatedMarker.setLatLng(tracePath[closest_index]);
};
*/

// @ts-ignore
window.gatherInfo = (e: HTMLDivElement) => {
    console.log(e.children[0].innerHTML, position);
};

const updateControl = () => {
    const stop_display = [];
    const completion = {
        whole: 0,
        partial: 0,
        target: 0,
    };

    for (let i = 0; i < stops.length; i++) {
        const stop_info = stops[i];
        stop_display.push(`
            <div class="stop">
                <img class="pill" src="${PILLS[stop_info.transit_id]}" />
                <span>${stop_info.name}</span>
                <img class="completion_marker" src="${COMPLETION(stop_info.location <= position)}" />
            </div>
        `);
        if (stop_info.location <= position) {
            completion.whole = stop_display.length - 1;
            completion.partial = 0;
        } else if (completion.target === 0) {
            completion.target = stop_display.length - 2;
            completion.whole = stop_display.length - 1;
        }

        for (let j = 0; j < stop_info.children.length; j++) {
            const stop_partial_info = stop_info.children[j];
            stop_display.push(`
                <div class="stop_partial" onclick="gatherInfo(this);">
                    <span>${stop_partial_info.name}</span>
                    <img class="partial_completion_marker" src="${COMPLETION(stop_partial_info.location <= position)}" />
                </div>
            `);
            if (stop_partial_info.location <= position) {
                completion.partial = stop_display.length - 1;
            }
        }
    }

    const div = (stopListing.getContainer() as HTMLDivElement);

    div.innerHTML = stop_display.join("\n");

    if (completion.partial !== 0) {
        div.children[completion.partial].scrollIntoView({behavior: "smooth", block: "center"});
        if (completion.partial !== completion.target) {
            div.children[completion.partial].classList.add("target_partial");
        } else {
            if (div.children[completion.whole + 1].classList.contains("stop_partial")) {
                div.children[completion.whole + 1].classList.add("target_partial");
            }
        }
    } else {
        div.children[completion.whole].scrollIntoView({behavior: "smooth", block: "center"});
        if (div.children[completion.whole + 1].classList.contains("stop_partial")) {
            div.children[completion.whole + 1].classList.add("target_partial");
        }
    }
    div.children[completion.whole].classList.add("target");
};

const getMapHeight = () => {
    return Math.abs(primary_map.getBounds().getNorth() - primary_map.getBounds().getSouth());
};

const translateMapView = (pos: LatLng) => {
    const translated = pos.clone();
    translated.lat -= getMapHeight() / 4;
    return translated;
};

function update() {
    if (animatedMarker !== undefined) {
        const totalBounds = primary_map.getBounds();
        const visibleBounds = new LatLngBounds({lat: totalBounds.getNorth() - (getMapHeight() / 2), lng: totalBounds.getWest()}, totalBounds.getNorthEast());
        const borderBounds = visibleBounds.pad(-0.1);
        if (!borderBounds.contains(animatedMarker.getLatLng())) {
            primary_map.setView(translateMapView(animatedMarker.getLatLng()), primary_map.getZoom(), {animate: true});
        }
    }

    requestAnimationFrame(update);
}

export async function main() {
    primary_map = new Map('map', { zoomControl: false }).setView([42.3220, -71.0835], 15);
    primary_map.attributionControl.setPrefix(false);

    const bg_tile = new TileLayer(TILE_SERVER_URL, TILE_SERVER_OPTIONS);
    bg_tile.addTo(primary_map);

    stopListing = new Control({position: "bottomleft"});
    stopListing.onAdd = function () {
        const container = DomUtil.create("div", "info");
        DomEvent.addListener(container, "click", DomEvent.stopPropagation);
        DomEvent.addListener(container, "wheel", DomEvent.stopPropagation);
        return container;
    };
    stopListing.addTo(primary_map);
    
    
    let a: Polyline;

    const styles = [
        { point: 0  , name: "SL5"     },
        { point: 112, name: "WALK"    },
        { point: 155, name: "SL4"     },
        { point: 190, name: "WALK"    },
        { point: 320, name: "SL2"     },
        { point: 523, name: "WALK"    },
        { point: 530, name: "SL1"     },
        { point: 739, name: "WALK"    },
        { point: 758, name: "SHUTTLE" },
        { point: 805, name: "WALK"    },
        { point: 851, name: "SL3"     },
    ];

    async function splitStyles() {
        for (let i = 0; i < styles.length; i++) {
            const style = styles[i];
            const style_start = style.point === 0 ? 0 : style.point - 1;
            const style_end = i + 1 === styles.length ? tracePath.length : styles[i + 1].point;
            const points = tracePath.slice(style_start, style_end);
            new Polyline(points, TRANSIT_STYLES[style.name]).addTo(primary_map);//.on("click", clickHandler);
        }
        (await AddRoute("assets/routes/sl1.json")).addTo(primary_map);
        (await AddRoute("assets/routes/sl2.json")).addTo(primary_map);
        (await AddRoute("assets/routes/sl3.json")).addTo(primary_map);
        (await AddRoute("assets/routes/sl4.json")).addTo(primary_map);
        (await AddRoute("assets/routes/sl5.json")).addTo(primary_map);

        animatedMarker = new AnimatedMarker(tracePath, {
            icon: ANIMATED_MARKER_ICON,
            onNext: (next, id) => {
                position = id;
                updateControl();
            },
        }).addTo(primary_map);
    }

    // @ts-ignore
    new K.GPX("assets/traces/trace5_.gpx", {
        async: true,
        marker_options: {
            startIconUrl: undefined,
            endIconUrl: undefined,
            shadowUrl: undefined,
        }
    }).on("loaded", (e: LeafletEvent) => {
        const gpx_layer = Object.entries(e.target._layers)[0][1];
        if (gpx_layer instanceof Polyline) {
            a = Object.entries(e.target._layers)[0][1] as Polyline;
            tracePath = a.getLatLngs() as LatLng[];
        } else {
            for (const v of Object.values(gpx_layer as { [s: string]: Layer })) {
                if (v instanceof Polyline) {
                    a = v;
                    tracePath = a.getLatLngs() as LatLng[];
                }
            }
        }
        a.addTo(primary_map);
        splitStyles();
    });

    stops = (await (await fetch("assets/traces/trace5_.json")).json()).stops;
    updateControl();
    update();

    /**
    for (let i = 0; i < stops.length; i++) {
        new CircleMarker(tracePath[stops[i].location], STOP_MARKER_STYLE_DEBUG).addTo(primary_map);
        for (let j = 0; j < stops[i].children.length; j++) {
            new CircleMarker(tracePath[stops[i].children[j].location], STOP_MARKER_STYLE_DEBUG).addTo(primary_map);
        }
    }
    */
}

main();
