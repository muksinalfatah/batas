import { assign, fromPromise, setup } from "xstate";
import { Area } from "../types";
import { combineGeoJsons } from "../utils/geojson";
import * as turf from "@turf/turf";
import { IAreaService } from "../types/services";
import { faker } from "@faker-js/faker";

export const mapMachine = setup({
    types: {
        context: {} as {
            areas: Map<string, Area>,
            provinces: GeoJSON.FeatureCollection;
            regencies: GeoJSON.FeatureCollection;
            selectedProvinceCode: string | null;
            hoveredArea: { info: Area | null, properties?: Record<string,string>, x: number, y: number } | null;
            areaService: IAreaService
        },
        events: {} as
            | { type: "HOVER", feature: GeoJSON.Feature, x: number, y: number }
            | { type: "CLICK", provinceCode: string, feature: GeoJSON.Feature }
            | { type: "HOVER_REGENCY", feature: GeoJSON.Feature, x: number, y: number }
            | { type: "CLEAR_HOVER" }
            | { type: "CLEAR_SELECTED" },
        input: {} as {
            areaService: IAreaService
        }
    },
    actors: {
        getProvinces: fromPromise<{ geoJsons: GeoJSON.FeatureCollection, areas: Area[] }, { areaService: IAreaService }>(async ({ input }) => {
            const { areaService } = input;
            const { data: areas } = await areaService.getProvinces();
            const geoFetchPromises = areas.map(area => {
                return areaService.getProvinceGeoJson(area.Kode).then((geoJson: GeoJSON.FeatureCollection) => {
                    
                    const features = geoJson.features.map(feature => ({
                        ...feature,
                        properties: {
                            ...feature.properties,
                            Kode: area.Kode,
                            name: area.Nama,
                            flagPindah: area.flagPindah
                        }
                    }))

                    geoJson.features = features;

                    return geoJson;
                });
            })

            const geoJsons: GeoJSON.FeatureCollection[] = await Promise.all(geoFetchPromises);
            const combinedGeojsons = combineGeoJsons(geoJsons);

            return {
                areas,
                geoJsons: combinedGeojsons
            };
        }),
        getRegencies: fromPromise<{ geoJsons: GeoJSON.FeatureCollection, areas: Area[] }, { provinceCode: string, areaService: IAreaService }>(async ({ input }) => {
            const { areaService, provinceCode } = input;

            const geoJsons = await areaService.getRegenciesGeoJson(provinceCode);
            const features = geoJsons.features.map((feature: GeoJSON.Feature) => {
                return {
                    ...feature,
                    properties: {
                        ...feature.properties,
                        Kode: feature.properties ? (feature.properties["KDPKAB"] ? feature.properties["KDPKAB"] : "") : "",
                        flagPindah: faker.helpers.arrayElement(["1","0"])
                    }
                }
            })

            geoJsons.features = features;

            const {data: areas} = await areaService.getRegencies(provinceCode);
            
            return {
                geoJsons,
                areas
            };
        }),
    },
    actions: {
        moveTo: () => { },
        resetMap: () => { },
        setHoverInfo: assign(({ event, context }) => {
            let hoveredArea = null;

            if (event.type === "HOVER" || event.type === "HOVER_REGENCY") {
                const featureInfo = event.feature.properties ? context.areas.get(event.feature.properties["Kode"] ?? "") : null;

                hoveredArea = {
                    info: featureInfo ?? null,
                    properties: event.feature.properties ?? undefined,
                    x: event.x,
                    y: event.y
                }
            }
            
            return {
                hoveredArea
            }
        }),
        clearSelected: assign({
            regencies: turf.featureCollection([]),
            selectedProvinceCode: null
        })
    }
}).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QFsCGAHAdASwHbYBcBiAbQAYBdRUdAe1kO1t2pAA9EBGAJgFZMALAE4RQ7mKEB2EWQAcAGhABPLmX6ipQst0mTOkgQIC+RxWix5GqADYAZWqgh4oRCMzA5cAN1oBrD+aeVnYOTrhQCHg+AMaoBEy45BRJrHQM8cysHAi83IoqCABsAMyymIXSvFJkcmSSOiZmGJjoAE60XnjRcPaOkEQAEgDyAGoAogBKKUggaYyZM9lVhZhivLqcnMVknLLFxfmIpZKrosWFFbJkYpKNIIFtHV09of0AwrYAkm8A0tM09HmLEWRx2q04AlqAkkpQExUkhyKm0w3DI22KywEskMsjuD3anVw3VgvQg71sYwAghMAPrDcZTSipQEZYGgJayMqSQr6LFaThkOGFRFaE6yHhwqSFWRnPHNR6E4mk8lU2kAZTGFLeABUxgARf6zFkJLKIdbqTnFTi8HnaKSIyTYwRkHmSNQXbjiW6me7ygnPEmvCCYVpgGBE7AvRzOVzuTw+fyYfFPIlRsnB0Ph6KRwPR8KRby0WKspKGuas01FOEo4pwvYu3j1hHKRCFbgrfRCKpu2r1b1NLAKgPK4ND1NqsDWMDRAj9emTGkTMYAcTGADk3gBNMvGhbsxB7biYPbd2R6HbYg4tnK8YqrW-aT3FbgCAXGO64Whk+AzczM9ImiCCAALTCteoFyhY+AEP+QKVgIeTXm+pwiFsOicEIba8LwkFBPENiks4sEVkBnpkJgjZVOchSCpsGIKNe4qCKINEyo6VpwrhY5KkGxGAfuCB8HeQgQlCMKXtKiICBcggPjy+wCOsMrFFx-qprm6YhmGYARmmREzOW-HsIgCEnDR1qNnaMKCoibYCOUNoQq+h6FNCqkpjxfSjmp3QTlOM6QHxe7GQgewrGFNQ1GeuQVLZ2HOjy0mcpymHeiYQA */
    id: "map",
    context: ({ input }) => ({
        areas: new Map(),
        provinces: turf.featureCollection([]),
        hoveredArea: null,
        regencies: turf.featureCollection([]),
        selectedProvinceCode: null,
        areaService: input.areaService
    }),
    initial: "init",
    states: {
        init: {
            always: {
                target: "initialLoading"
            }
        },
        initialLoading: {
            invoke: {
                src: "getProvinces",
                onDone: {
                    target: "provincesLoaded",
                    actions: assign(({ event }) => {
                        return {
                            areas: new Map(event.output.areas.map((area: Area) => [area.Kode, area])),
                            provinces: event.output.geoJsons
                        }
                    }),
                },
                input: ({ context }) => ({
                    areaService: context.areaService
                })
            },
        },
        provincesLoaded: {
            initial: "idle",
            on: {
                HOVER: {
                    actions: "setHoverInfo"
                },
                CLICK: {
                    target: ".regenciesLoading",
                    actions: [
                        assign(({ event }) => ({
                            selectedProvinceCode: event.provinceCode
                        })),
                        "moveTo"
                    ]
                },
                CLEAR_HOVER: {
                    actions: "setHoverInfo"
                },
                CLEAR_SELECTED: {
                    target: "provincesLoaded",
                    actions: [
                        "clearSelected",
                        "resetMap"
                    ]
                }
            },
            states: {
                idle: {},
                regenciesLoading: {
                    invoke: {
                        src: "getRegencies",
                        onDone: {
                            target: "provinceSelected",
                            actions: assign(({ event, context }) => {
                                const areas = context.areas;
                                event.output.areas.forEach((area: Area) => {
                                    areas.set(area.Kode, area);
                                })
                                return {
                                    regencies: event.output.geoJsons,
                                    areas
                                }
                            }),
                        },
                        input: ({ context }) => ({
                            provinceCode: context.selectedProvinceCode ?? "",
                            areaService: context.areaService
                        })
                    }
                },
                provinceSelected: {
                    on: {
                        HOVER_REGENCY: {
                            actions: "setHoverInfo",
                        },
                    }
                }
            }
        },
        
    },
})