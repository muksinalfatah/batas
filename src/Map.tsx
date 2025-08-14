import MapComponent, { Layer, Source, MapLayerMouseEvent, Popup } from 'react-map-gl/maplibre';
import { DEFAULT_VIEW_STATE } from './const/config';
import { OSM_MAP } from './utils/openstreet';
import { useMapFunction } from './useMapFunction';
import Loader from './components/Loader';
import AreaDetail from './components/AreaDetail';
import { IAreaService } from './types/services';
import 'maplibre-gl/dist/maplibre-gl.css';
import * as turf from "@turf/turf";
import { Box, Group, Stack, Text, Title } from '@mantine/core';
import { pointOnFeature } from "@turf/point-on-feature";
import PropertiesDetail from './components/PropertiesDetail';
import { useMemo } from 'react';

export enum MapMode {
    AREA,
    LINE
}

function Map({ areaService, title, mode = MapMode.AREA }: { areaService: IAreaService, title?: string, mode?: MapMode }) {
    const { mapRef, isLoading, provincesGeoJson, hoveredArea, regenciesGeoJson, showHoverInfo, clearHover, selectProvince, clearSelected } = useMapFunction(areaService);

    const onHover = (event: MapLayerMouseEvent) => {
        const features = mapRef.current?.queryRenderedFeatures(event.point);
        const hoveredFeature = features && features[0];
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
                selectProvince(clickedFeature.properties["Kode"], clickedFeature);
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
            <MapComponent
                ref={mapRef}
                initialViewState={DEFAULT_VIEW_STATE}
                mapStyle={OSM_MAP}
                interactiveLayerIds={["provinces", "regencies"]}
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
                            'fill-opacity': 1,
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
                    </Group> :
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
            }
        </Stack>
    )
}

export default Map