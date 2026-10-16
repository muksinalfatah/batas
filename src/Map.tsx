import MapComponent, { Layer, Source, MapLayerMouseEvent, Popup } from 'react-map-gl/maplibre';
import { BOUNDARY_PROVINCE_CODES, DEFAULT_VIEW_STATE } from './const/config';
import { OSM_MAP } from './utils/openstreet';
import { useMapFunction } from './useMapFunction';
import Loader from './components/Loader';
import AreaDetail from './components/AreaDetail';
import { IAreaService } from './types/services';
import 'maplibre-gl/dist/maplibre-gl.css';
import * as turf from "@turf/turf";
import { Alert, Box, Group, Stack, Text, Title } from '@mantine/core';
import { pointOnFeature } from "@turf/point-on-feature";
import PropertiesDetail from './components/PropertiesDetail';
import { useMemo } from 'react';

export enum MapMode {
    AREA,
    LINE
}

function Map({ areaService, title, mode = MapMode.AREA }: { areaService: IAreaService, title?: string, mode?: MapMode }) {
    const { mapRef, isLoading, error, provincesGeoJson, hoveredArea, hoverDetailLoading, hoverDetailError, regenciesGeoJson, selectedProvinceCode, showHoverInfo, clearHover, selectProvince, clearSelected } = useMapFunction(areaService);
    const showBoundaryOverlay = mode === MapMode.AREA && selectedProvinceCode !== null
        && BOUNDARY_PROVINCE_CODES.includes(selectedProvinceCode);

    const onHover = (event: MapLayerMouseEvent) => {
        const hoveredFeature = event.features?.find(feature => feature.layer.id === "area-boundaries-line")
            ?? event.features?.[0];
        const point = event.lngLat;
        if (hoveredFeature) {
            showHoverInfo(hoveredFeature, point.lat, point.lng);
        } else {
            clearHover();
        }
    }

    const onClick = (event: MapLayerMouseEvent) => {
        const clickedFeature = event.features && event.features[0];
        if (clickedFeature) {
            if (clickedFeature.layer.id === "provinces") {
                const code = String(clickedFeature.properties["Kode"]);
                if (mode === MapMode.AREA || BOUNDARY_PROVINCE_CODES.includes(code)) {
                    selectProvince(code, clickedFeature);
                }
            }
        } else {
            clearSelected();
        }
    }

    const provinceLabelPoints = turf.featureCollection(provincesGeoJson.features.map((feature) => {
        const geoPoints = turf.centroid(feature);

        geoPoints.properties = {
            ...feature.properties,
            name: feature.properties ? feature.properties["name"] : "Unknown"
        }

        return geoPoints;
    }))

    const regencyLabelPoints = turf.featureCollection(regenciesGeoJson.features.map((feature) => {
        const geoPoints = mode === MapMode.AREA ? turf.centroid(feature) : pointOnFeature(feature);

        geoPoints.properties = {
            ...feature.properties,
            name: feature.properties ? feature.properties["NAMOBJ"] : "Unknown"
        }

        return geoPoints;
    }))

    const renderHoverInfo = useMemo(() => {
        if (hoveredArea?.info) {
            return (
                <AreaDetail {...hoveredArea.info} />
            )
        }

        if (hoveredArea?.properties) {
            return <PropertiesDetail properties={hoveredArea.properties} />
        }

        return <span>Loading...</span>
    }, [hoveredArea])

    return (
        <Stack className="map-container">
            {title ? <Title order={3}>{title}</Title> : null}
            {error && <Alert color="red" title="Data peta gagal dimuat">{error}</Alert>}
            <MapComponent
                ref={mapRef}
                initialViewState={DEFAULT_VIEW_STATE}
                mapStyle={OSM_MAP}
                interactiveLayerIds={mode === MapMode.AREA
                    ? ["provinces", "regencies", ...(showBoundaryOverlay ? ["area-boundaries-line"] : [])]
                    : ["provinces", ...regenciesGeoJson.features.map((_, index) => `${index}-line`)]}
                onMouseMove={onHover}
                onClick={onClick}
            >
                {isLoading && <Loader />}
                <Source type="geojson" data={provincesGeoJson}>
                    <Layer
                        id="provinces"
                        type="fill"
                        paint={{
                            'fill-color': [
                                "match",
                                ["get", "flagPindah"],
                                "1",
                                '#627BC1',
                                "0",
                                '#6ac162',
                                '#6ac162'
                            ],
                            'fill-opacity': mode === MapMode.AREA ? 1 : 0.1,
                        }}
                    />
                    <Layer id="provinces-line" type="line" paint={{
                        "line-color": "yellow",
                        "line-width": 2
                    }} />
                </Source>

                <Source type='geojson' data={provinceLabelPoints}>
                    <Layer
                        id='province-label'
                        type='symbol'
                        layout={{
                            "text-field": ["get", "name"],
                            "text-font": ["sans700"],
                            "text-anchor": "center",
                        }}
                    />
                </Source>

                {
                    mode === MapMode.AREA ? (
                        <Source type='geojson' data={regenciesGeoJson}>
                            <Layer
                                id="regencies"
                                type="fill"
                                paint={{
                                    'fill-color': '#32a852',
                                    'fill-opacity': 1,

                                }}
                            />
                            <Layer id="regencies-line" type="line" paint={{
                                "line-color": "yellow",
                                "line-width": 2
                            }} />
                        </Source>
                    ) :
                        regenciesGeoJson.features.map((feature, index) => {
                            return (
                                (
                                    <Source key={index} type='geojson' data={feature}>

                                        <Layer id={`${index}-line`} type="line" paint={{
                                            "line-color": [
                                                "match",
                                                ["get", "STSBTS"],
                                                1,
                                                "green",
                                                2,
                                                "blue",
                                                3,
                                                "red",
                                                999,
                                                "black",
                                                "black"
                                            ],
                                            "line-width": 3,
                                            "line-dasharray": [1, 1]
                                        }} />
                                    </Source>
                                )
                            )
                        })
                }

                {showBoundaryOverlay && (
                    <Source
                        key={selectedProvinceCode}
                        id={`area-boundaries-${selectedProvinceCode}`}
                        type="geojson"
                        data={`${import.meta.env.BASE_URL}geojson/batas/${selectedProvinceCode}.geojson`}
                    >
                        <Layer id="area-boundaries-outline" type="line" paint={{
                            "line-color": "white",
                            "line-width": 5,
                            "line-dasharray": [1, 1],
                        }} />
                        <Layer id="area-boundaries-line" type="line" paint={{
                            "line-color": ["match", ["to-number", ["get", "STSBTS"], 999], 1, "green", 2, "blue", 3, "red", "black"],
                            "line-width": 3,
                            "line-dasharray": [1, 1],
                        }} />
                    </Source>
                )}

                <Source type='geojson' data={regencyLabelPoints}>
                    <Layer
                        id='regency-label'
                        type='symbol'
                        layout={{
                            "text-field": ["get", "name"],
                            "text-font": ["sans700"],
                            "text-anchor": "center",
                        }}
                    />
                </Source>
                {
                    hoveredArea && (

                        <Popup
                            latitude={hoveredArea.x}
                            longitude={hoveredArea.y}
                            closeButton={false}
                            maxWidth='unset'
                            style={{
                                padding: 0,
                                margin: 0,
                                background: "unset"
                            }}
                        >
                            {renderHoverInfo}
                            {hoverDetailLoading && <Text size="xs" p="xs">Memuat detail wilayah…</Text>}
                            {hoverDetailError && <Text size="xs" c="red" p="xs">{hoverDetailError}</Text>}
                        </Popup>
                    )
                }

            </MapComponent>
            {
                mode === MapMode.AREA ?
                    <Group>
                        <Group>
                            <Box w={12} h={12} bg={"#627BC1"}>

                            </Box>
                            <Text>Pindah</Text>
                        </Group>
                        <Group>
                            <Box w={12} h={12} bg={"#6ac162"}>

                            </Box>
                            <Text>Tidak Pindah</Text>
                        </Group>
                    </Group> : null
            }
            {(mode === MapMode.LINE || showBoundaryOverlay) && (
                    <Group>
                        <Box style={{ borderBottom: "4px dashed green" }}>
                            <Text>Status Batas: Referensi Resmi</Text>
                        </Box>
                        <Box style={{ borderBottom: "4px dashed blue" }}>
                            <Text>Status Batas: Hasil Kesepakatan</Text>
                        </Box>
                        <Box style={{ borderBottom: "4px dashed red" }}>
                            <Text>Status Batas: Belum Ditegaskan</Text>
                        </Box>
                        <Box style={{ borderBottom: "4px dashed black" }}>
                            <Text>Status Batas: Lainnya</Text>
                        </Box>
                    </Group>
            )}
            {mode === MapMode.AREA && selectedProvinceCode && !showBoundaryOverlay && (
                <Text size="sm" c="dimmed">Data garis batas untuk provinsi ini belum tersedia.</Text>
            )}
        </Stack>
    )
}

export default Map
