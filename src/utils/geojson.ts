import { Feature, FeatureCollection } from "geojson";
import bbox from "@turf/bbox";

// @ts-ignore
import { featureEach } from "@turf/meta";
import * as turf from "@turf/turf";

export function calculateBbox(geojson: Feature<any> | FeatureCollection<any>): number[] {
    return bbox(geojson);
}

export function toFeatureCollection(features: Feature[]): FeatureCollection {
    return turf.featureCollection(features);
    
}

export function combineGeoJsons(geoJsons: GeoJSON.FeatureCollection[]): GeoJSON.FeatureCollection {
    return turf.featureCollection(geoJsons.reduce<Feature[]>((acc, curr) => {
        featureEach(curr, (feature: Feature) => {
            acc.push(feature);
        })
        return acc;
    },[]))
}