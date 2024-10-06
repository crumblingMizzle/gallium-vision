import { GeoJSON, CircleMarker } from "leaflet";
import { Feature, LineString } from 'geojson';

import { TRANSIT_STYLES, STOP_MARKER_STYLE } from './Style';


export const AddRoute = async (file: string) => {
    const req = await fetch(file);
    const data = await req.json();

    const filteredData = {
        copyright: data.copyright,
        features : [] as Feature[],
        generator: data.generator,
        timestamp: data.timestamp,
        type: data.type,
    };

    const true_stops: Record<string, any[]> = {};
    data.features.forEach((feature: Feature) => {
        if ((feature.id as string).indexOf("node") === -1) {
            // do nothing :)
        } else {
            if (true_stops[feature.properties?.name]) {
                true_stops[feature.properties?.name].push(feature);
            } else {
                true_stops[feature.properties?.name] = [feature];
            }
            return;
        }
        filteredData.features.push(feature);
    });
    const canon_stops = [];
    for (const stops of Object.values(true_stops)) {
        let x = 0;
        let y = 0;
        for (const stop of stops) {
            x += stop.geometry.coordinates[0];
            y += stop.geometry.coordinates[1];
        }
        x /= stops.length;
        y /= stops.length;
        const canon_stop = stops[0];
        canon_stop.geometry.coordinates = [x, y];
        canon_stops.push(canon_stop);
    }
    for (const stop of canon_stops) {
        const coords = stop.geometry.coordinates;
        let closest_coord = undefined;
        let closest_dist = Infinity;
        for (const relation of filteredData.features) {
            for (const point of (relation.geometry as LineString).coordinates) {
                const dist = Math.sqrt(Math.pow(point[0] - coords[0], 2) + Math.pow(point[1] - coords[1], 2));
                if (dist < closest_dist) {
                    closest_dist = dist;
                    closest_coord = point;
                }
            }
        }
        stop.geometry.coordinates = closest_coord;
        filteredData.features.push(stop);
    }

    
    return new GeoJSON(filteredData, {
        style: TRANSIT_STYLES["INVISIBLE"],
        pointToLayer: function (feature, latlng) {
            return new CircleMarker(latlng, STOP_MARKER_STYLE);
        },
        filter: function (feature) {
            return (feature.id as string).indexOf("node") !== -1;
        },
    });
}
