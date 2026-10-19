import { useMachine } from "@xstate/react"
import { mapMachine } from "./machine/map.machine"
import { useEffect, useRef, useState } from "react";
import type { Area } from "./types";
import { MapGeoJSONFeature, MapRef } from "react-map-gl/maplibre";
import { calculateBbox } from "./utils/geojson";
import { IAreaService } from "./types/services";
import { DEFAULT_VIEW_STATE } from "./const/config";
import type { IslandGroup } from "./const/islands";

function focusIsland(map: MapRef | null, provinces: GeoJSON.FeatureCollection, island: IslandGroup | null) {
    if (!map) return;
    if (!island) {
        map.flyTo({ center: [DEFAULT_VIEW_STATE.longitude, DEFAULT_VIEW_STATE.latitude], zoom: DEFAULT_VIEW_STATE.zoom });
        return;
    }
    const features = provinces.features.filter(feature => island.provinceCodes.includes(String(feature.properties?.Kode)));
    if (!features.length) return;
    const bounds = calculateBbox({ type: 'FeatureCollection', features });
    if (!bounds.every(Number.isFinite)) return;
    map.fitBounds([[bounds[0], bounds[1]], [bounds[2], bounds[3]]], { padding: 36, maxZoom: 7, duration: 900 });
}

export const useMapFunction = (areaService: IAreaService, selectedIsland: IslandGroup | null = null) => {
    const mapRef = useRef<MapRef>(null);
    const [mapReady, setMapReady] = useState(false);
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
            resetMap: ({ context }) => {
                focusIsland(mapRef.current, context.provinces, selectedIsland);
            }
        },
    }), {
        input: { areaService }
    });


    const isLoading = snapshot.matches("initialLoading") || snapshot.matches({ provincesLoaded: "regenciesLoading" });
    const provincesGeoJson = snapshot.context.provinces;
    useEffect(() => {
        if (!mapReady || !provincesGeoJson.features.length) return;
        // Leaving the regency state also cancels any pending regency request.
        send({ type: 'CLEAR_HOVER' });
        send({ type: 'CLEAR_SELECTED' });
    }, [selectedIsland, provincesGeoJson, mapReady, send]);
    const regenciesGeoJson = snapshot.context.regencies;
    const hoveredArea = snapshot.context.hoveredArea;
    const hoverCode = String(hoveredArea?.info?.Kode ?? hoveredArea?.properties?.Kode ?? "").trim();
    const getDetail = /^\d{2}$/.test(hoverCode) ? areaService.getProvinceDetail
        : /^\d{2}\.\d{2}$/.test(hoverCode) ? areaService.getRegencyDetail : undefined;
    const [areaDetail, setAreaDetail] = useState<{
        code: string; area?: Area; loading: boolean; error?: string;
    }>({ code: "", loading: false });

    useEffect(() => {
        if (!hoverCode || !getDetail) return;
        let active = true;
        setAreaDetail({ code: hoverCode, loading: true });
        const timer = setTimeout(() => {
            getDetail.call(areaService, hoverCode).then(area => {
                if (active) setAreaDetail({ code: hoverCode, area, loading: false });
            }).catch(() => {
                if (active) setAreaDetail({ code: hoverCode, loading: false, error: "Detail wilayah gagal dimuat. Arahkan kembali kursor untuk mencoba lagi." });
            });
        }, 150);
        return () => { active = false; clearTimeout(timer); };
    }, [areaService, hoverCode, getDetail]);

    const currentDetail = areaDetail.code === hoverCode ? areaDetail : undefined;
    const enrichedHover = hoveredArea && currentDetail?.area
        ? { ...hoveredArea, info: { ...hoveredArea.info, ...currentDetail.area } }
        : hoveredArea;

    const showHoverInfo = (feature: MapGeoJSONFeature, x: number, y: number) => {
        if (feature.properties?.STSBTS != null) {
            send({ type: "HOVER_BOUNDARY", feature, x, y });
        } else if (feature.layer.id === "provinces") {
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
        onMapLoad: () => setMapReady(true),
        isLoading,
        error: snapshot.context.error,
        provincesGeoJson,
        hoveredArea: enrichedHover,
        hoverDetailLoading: Boolean(getDetail && (!currentDetail || currentDetail.loading)),
        hoverDetailError: getDetail ? currentDetail?.error : undefined,
        regenciesGeoJson,
        selectedProvinceCode: snapshot.context.selectedProvinceCode,

        showHoverInfo,
        clearHover,
        selectProvince,
        clearSelected
    }
}
