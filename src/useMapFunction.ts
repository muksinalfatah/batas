import { useMachine } from "@xstate/react"
import { mapMachine } from "./machine/map.machine"
import { useRef } from "react";
import { MapGeoJSONFeature, MapRef } from "react-map-gl/maplibre";
import { calculateBbox } from "./utils/geojson";
import { IAreaService } from "./types/services";
import { DEFAULT_VIEW_STATE } from "./const/config";

export const useMapFunction = (areaService: IAreaService) => {
    const [snapshot, send] = useMachine(mapMachine.provide({
        actions: {
            moveTo: ({ event }) => {
                if (event.type == "CLICK") {
                    const { feature } = event
                    const [minLng, minLat, maxLng, maxLat] = calculateBbox(feature);
                    mapRef.current?.fitBounds([
                        [minLng, minLat],
                        [maxLng, maxLat]
                    ])
                }
            },
            resetMap: () => {
                mapRef.current?.flyTo({
                    center: {
                        lat: DEFAULT_VIEW_STATE.latitude,
                        lng: DEFAULT_VIEW_STATE.longitude
                    },
                    zoom: DEFAULT_VIEW_STATE.zoom
                })
            }
        },
    }), {
        input: { areaService }
    });


    const mapRef = useRef<MapRef>(null);

    const isLoading = snapshot.matches("initialLoading") || snapshot.matches({ provincesLoaded: "regenciesLoading" });
    const provincesGeoJson = snapshot.context.provinces;
    const regenciesGeoJson = snapshot.context.regencies;
    const hoveredArea = snapshot.context.hoveredArea;

    const showHoverInfo = (feature: MapGeoJSONFeature, x: number, y: number) => {
        if (feature.layer.id === "provinces") {
            send({ type: "HOVER", feature, x, y });
        } else {
            send({ type: "HOVER_REGENCY", feature, x, y })
        }
    }

    const clearHover = () => {
        send({ type: "CLEAR_HOVER" })
    }

    const selectProvince = (code: string, feature: GeoJSON.Feature) => {
        send({ type: "CLICK", provinceCode: code, feature })
    }

    const clearSelected = () => {
        send({ type: "CLEAR_SELECTED" })
    }

    return {
        mapRef,
        isLoading,
        provincesGeoJson,
        hoveredArea,
        regenciesGeoJson,

        showHoverInfo,
        clearHover,
        selectProvince,
        clearSelected
    }
}