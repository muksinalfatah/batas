import { Area } from ".";

export interface IAreaService {
    getProvinces(): Promise<{data: Area[], reference: string}>;
    getProvinceGeoJson(provinceId: string): Promise<GeoJSON.FeatureCollection>;
    getRegencies(provinceCode: string): Promise<{data: Area[], reference: string}>;
    getRegenciesGeoJson(proviceCode: string): Promise<GeoJSON.FeatureCollection>;
}