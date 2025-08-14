import { MapGeoJSONFeature } from "react-map-gl/maplibre";

export type FeatureWithProperties = MapGeoJSONFeature & {
    properties: FeatureProperties
}

export type FeatureProperties = {
    OBJECTID: string;
    NAMOBJ: string;
    FCODE: string;
    REMARK: string;
    METADATA: string;
    SRS_ID: string;
    KDBBPS: string;
    KDCBPS: string;
    KDCPUM: string;
    KDEBPS: string;
    KDEPUM: string;
    KDPBPS: string;
    KDPKAB: string;
    KDPPUM: string;
    LUASWH: string;
    TIPADM: string;
    WADMKC: string;
    WADMKD: string;
    WADMKK: string;
    WADMPR: string;
    WIADKC: string;
    WIADKK: string;
    WIADPR: string;
    WIADKD: string;
    SHAPE_Length: string;
    SHAPE_Area: string;
}


export type Area = {
    Kode: string,
    Nama: string,
    Ibukota: string,
    LuasWilayah?: number,
    JumlahPenduduk?: number,
    Keterangan:string,
    flagPindah: string,
    jumlahKab?: number,
    jumlahKec?: number,
    jumlahKel?: number,
}