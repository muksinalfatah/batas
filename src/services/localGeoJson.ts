import type { Area } from "../types";
import { KODE_WILAYAH_GEO_JSON_BASE_URL } from "../const/config";

// Provinces available in public/geojson/kode-wilayah/provinces.
const provinces: [string, string][] = [
    ["11", "Aceh"],
    ["12", "Sumatera Utara"],
    ["13", "Sumatera Barat"],
    ["14", "Riau"],
    ["15", "Jambi"],
    ["16", "Sumatera Selatan"],
    ["17", "Bengkulu"],
    ["18", "Lampung"],
    ["19", "Kepulauan Bangka Belitung"],
    ["21", "Kepulauan Riau"],
    ["31", "DKI Jakarta"],
    ["32", "Jawa Barat"],
    ["33", "Jawa Tengah"],
    ["34", "Daerah Istimewa Yogyakarta"],
    ["35", "Jawa Timur"],
    ["36", "Banten"],
    ["51", "Bali"],
    ["52", "Nusa Tenggara Barat"],
    ["53", "Nusa Tenggara Timur"],
    ["61", "Kalimantan Barat"],
    ["62", "Kalimantan Tengah"],
    ["63", "Kalimantan Selatan"],
    ["64", "Kalimantan Timur"],
    ["65", "Kalimantan Utara"],
    ["71", "Sulawesi Utara"],
    ["72", "Sulawesi Tengah"],
    ["73", "Sulawesi Selatan"],
    ["74", "Sulawesi Tenggara"],
    ["75", "Gorontalo"],
    ["76", "Sulawesi Barat"],
    ["81", "Maluku"],
    ["82", "Maluku Utara"],
    ["91", "Papua"],
    ["92", "Papua Barat"],
    ["93", "Papua Selatan"],
    ["94", "Papua Tengah"],
    ["95", "Papua Pegunungan"],
    ["96", "Papua Barat Daya"],
];

function toArea(Kode: string, Nama: string): Area {
    return { Kode, Nama, Ibukota: "", Keterangan: "", flagPindah: "0" };
}

export async function readLocalGeoJson(path: string): Promise<GeoJSON.FeatureCollection> {
    const url = `${KODE_WILAYAH_GEO_JSON_BASE_URL}/${path}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`GeoJSON lokal ${path}: HTTP ${response.status}`);
    const data = await response.json();
    if (data?.type === "GeometryCollection" && Array.isArray(data.geometries)) {
        return {
            type: "FeatureCollection",
            features: data.geometries.map((geometry: GeoJSON.Geometry) => ({
                type: "Feature",
                geometry,
                properties: {},
            })),
        };
    }
    if (data?.type !== "FeatureCollection" || !Array.isArray(data.features)) {
        throw new Error(`GeoJSON lokal ${path} tidak valid`);
    }
    return data;
}

export async function getLocalProvinces(): Promise<{ data: Area[]; reference: string }> {
    return {
        data: provinces.map(([code, name]) => toArea(code, name)),
        reference: "GeoJSON lokal",
    };
}

export async function getLocalRegencies(provinceCode: string): Promise<{ data: Area[]; reference: string }> {
    const path = `regencies/${provinceCode}_2.json`;
    const geoJson = await readLocalGeoJson(path);
    const areas = new Map<string, Area>();
    for (const feature of geoJson.features) {
        const properties = feature.properties;
        const code = String(properties?.KDPKAB ?? "").trim();
        const name = String(properties?.WADMKK ?? properties?.NAMOBJ ?? "").trim();
        if (code && name) areas.set(code, toArea(code, name));
    }
    return {
        data: Array.from(areas.values()).sort((a, b) => a.Kode.localeCompare(b.Kode)),
        reference: `${KODE_WILAYAH_GEO_JSON_BASE_URL}/${path}`,
    };
}
