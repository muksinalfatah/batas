import { Area } from ".";

export interface AreaSummary {
    JumlahProvinsi: number;
    JumlahKabupatenKota: number;
    JumlahKecamatan: number;
    JumlahDesaKelurahan: number;
    JumlahPulau: number;
}

export interface IslandRegencySummary {
    Kelompok: string;
    JumlahKabupatenKota: number;
}

export interface IAreaService {
    getSummary?(): Promise<AreaSummary>;
    getIslandRegencySummary?(): Promise<IslandRegencySummary[]>;
    getProvinceDetail?(provinceCode: string): Promise<Area>;
    getRegencyDetail?(regencyCode: string): Promise<Area>;
    getProvinces(): Promise<{data: Area[], reference: string}>;
    getProvinceGeoJson(provinceId: string): Promise<GeoJSON.FeatureCollection>;
    getRegencies(provinceCode: string): Promise<{data: Area[], reference: string}>;
    getRegenciesGeoJson(proviceCode: string): Promise<GeoJSON.FeatureCollection>;
}
