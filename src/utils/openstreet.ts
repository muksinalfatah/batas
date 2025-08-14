import { StyleSpecification } from "maplibre-gl";

export const OSM_MAP: StyleSpecification = {
    version: 8,
    sources: {
        osm: {
            type: 'raster',
            tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '&copy; OpenStreetMap Contributors',
            maxzoom: 19,
        }
    },
    glyphs: "https://unopengis.github.io/noto/{fontstack}/{range}.pbf",
    layers: [
        {
            id: 'osm',
            type: 'raster',
            source: 'osm'
        }
    ]
};