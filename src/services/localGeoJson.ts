import type { Area } from "../types";

// Provinces available in public/geojson/provinces.
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
];

function toArea(Kode: string, Nama: string): Area {
    return { Kode, Nama, Ibukota: "", Keterangan: "", flagPindah: "0" };
}

export async function readLocalGeoJson(path: string): Promise<GeoJSON.FeatureCollection> {
    const url = `${import.meta.env.BASE_URL}geojson/${path}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`GeoJSON lokal ${path}: HTTP ${response.status}`);
    const data = await response.json();
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
        reference: `${import.meta.env.BASE_URL}geojson/${path}`,
    };
}
