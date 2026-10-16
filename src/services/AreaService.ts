import { KODE_WILAYAH_GEO_JSON_BASE_URL, STATIC_FILE_BASE_URL } from "../const/config";
import { Area } from "../types"
import { IAreaService } from "../types/services";
import { faker } from '@faker-js/faker';
import { KodeWilayah } from "./KodeWilayah";

export class AreaService implements IAreaService {
    async getProvinces(): Promise<{ data: Area[]; reference: string; }> {
        return fetch(`${STATIC_FILE_BASE_URL}/provinces.json`).then(res => res.json())
    }

    async getProvinceGeoJson(provinceCode: string): Promise<GeoJSON.FeatureCollection> {
        return fetch(`${KODE_WILAYAH_GEO_JSON_BASE_URL}/provinces/${provinceCode}.json`).then(res => res.json())
    }

    async getRegencies(provinceCode: string): Promise<{ data: Area[]; reference: string; }> {
        return fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceCode}.json`)
            .then(response => response.json())
            .then((provinces: { id: string, name: string }[]) => {

                const data: Area[] = provinces.map(province => ({
                    Kode: province.id,
                    Nama: province.name,
                    Ibukota: "",
                    Keterangan: "",
                    JumlahPenduduk: faker.number.int({ min: 100000, max: 1000000 }),
                    flagPindah: faker.helpers.arrayElement(["1", "0"]),
                    jumlahKab: faker.number.int({ min: 3, max: 15 }),
                    jumlahKec: faker.number.int({ min: 100, max: 100 }),
                    jumlahKel: faker.number.int({ min: 300, max: 1000 })
                }))

                return {
                    data,
                    reference: `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceCode}.json`
                }
            });

    }

    async getRegenciesGeoJson(proviceCode: string): Promise<GeoJSON.FeatureCollection> {
        return fetch(`${KODE_WILAYAH_GEO_JSON_BASE_URL}/regencies/${proviceCode}_2.json`).then(res => res.json())
    }
}

export class BorneoAreaService implements IAreaService {

    async getProvinces(): Promise<{ data: Area[]; reference: string; }> {
        return fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
            .then(response => response.json())
            .then((provinces: { id: string, name: string }[]) => {
                const filteredProvinces = provinces.filter(province => {
                    return province.id.startsWith("6");
                })

                const data: Area[] = filteredProvinces.map(province => ({
                    Kode: province.id,
                    Nama: province.name,
                    Ibukota: "",
                    Keterangan: "",
                    JumlahPenduduk: faker.number.int({ min: 100000, max: 1000000 }),
                    flagPindah: faker.helpers.arrayElement(["1", "0"]),
                    jumlahKab: faker.number.int({ min: 3, max: 15 }),
                    jumlahKec: faker.number.int({ min: 100, max: 100 }),
                    jumlahKel: faker.number.int({ min: 300, max: 1000 })
                }))

                return {
                    data,
                    reference: "https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json"
                }
            })
    }
    async getProvinceGeoJson(provinceCode: string): Promise<GeoJSON.FeatureCollection> {
        return fetch(`geojson/all-provinces/${provinceCode}.geojson`)
            .then(res => res.json());
    }
    async getRegencies(provinceCode: string): Promise<{ data: Area[]; reference: string; }> {
        return fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceCode}.json`)
            .then(response => response.json())
            .then((provinces: { id: string, name: string }[]) => {

                const data: Area[] = provinces.map(province => ({
                    Kode: province.id,
                    Nama: province.name,
                    Ibukota: "",
                    Keterangan: "",
                    JumlahPenduduk: faker.number.int({ min: 100000, max: 1000000 }),
                    flagPindah: faker.helpers.arrayElement(["1", "0"]),
                    jumlahKab: faker.number.int({ min: 3, max: 15 }),
                    jumlahKec: faker.number.int({ min: 100, max: 100 }),
                    jumlahKel: faker.number.int({ min: 300, max: 1000 })
                }))

                return {
                    data,
                    reference: `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceCode}.json`
                }
            });
    }
    async getRegenciesGeoJson(proviceCode: string): Promise<GeoJSON.FeatureCollection> {
        return fetch(`geojson/regencies/${proviceCode}_2.json`).then(res => res.json())
    }

}

export class SumatraAreaService implements IAreaService {

    async getProvinces(): Promise<{ data: Area[]; reference: string; }> {
        return fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
            .then(response => response.json())
            .then((provinces: { id: string, name: string }[]) => {
                const filteredProvinces = provinces.filter(province => {
                    return province.id.startsWith("1");
                })

                const data: Area[] = filteredProvinces.map(province => ({
                    Kode: province.id,
                    Nama: province.name,
                    Ibukota: "",
                    Keterangan: "",
                    JumlahPenduduk: faker.number.int({ min: 100000, max: 1000000 }),
                    flagPindah: faker.helpers.arrayElement(["1", "0"]),
                    jumlahKab: faker.number.int({ min: 3, max: 15 }),
                    jumlahKec: faker.number.int({ min: 100, max: 100 }),
                    jumlahKel: faker.number.int({ min: 300, max: 1000 })
                }))

                return {
                    data,
                    reference: "https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json"
                }
            })
    }
    async getProvinceGeoJson(provinceCode: string): Promise<GeoJSON.FeatureCollection> {
        return fetch(`geojson/all-provinces/${provinceCode}.geojson`)
            .then(res => res.json());
    }
    async getRegencies(provinceCode: string): Promise<{ data: Area[]; reference: string; }> {
        return fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceCode}.json`)
            .then(response => response.json())
            .then((provinces: { id: string, name: string }[]) => {

                const data: Area[] = provinces.map(province => ({
                    Kode: province.id,
                    Nama: province.name,
                    Ibukota: "",
                    Keterangan: "",
                    JumlahPenduduk: faker.number.int({ min: 100000, max: 1000000 }),
                    flagPindah: faker.helpers.arrayElement(["1", "0"]),
                    jumlahKab: faker.number.int({ min: 3, max: 15 }),
                    jumlahKec: faker.number.int({ min: 100, max: 100 }),
                    jumlahKel: faker.number.int({ min: 300, max: 1000 })
                }))

                return {
                    data,
                    reference: `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceCode}.json`
                }
            });
    }
    async getRegenciesGeoJson(proviceCode: string): Promise<GeoJSON.FeatureCollection> {
        return fetch(`geojson/regencies/${proviceCode}_2.json`).then(res => res.json())
    }

}

export class JavaAreaService implements IAreaService {

    async getProvinces(): Promise<{ data: Area[]; reference: string; }> {
        return fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
            .then(response => response.json())
            .then((provinces: { id: string, name: string }[]) => {
                const filteredProvinces = provinces.filter(province => {
                    return province.id.startsWith("3");
                })

                const data: Area[] = filteredProvinces.map(province => ({
                    Kode: province.id,
                    Nama: province.name,
                    Ibukota: "",
                    Keterangan: "",
                    JumlahPenduduk: faker.number.int({ min: 100000, max: 1000000 }),
                    flagPindah: faker.helpers.arrayElement(["1", "0"]),
                    jumlahKab: faker.number.int({ min: 3, max: 15 }),
                    jumlahKec: faker.number.int({ min: 100, max: 100 }),
                    jumlahKel: faker.number.int({ min: 300, max: 1000 })
                }))

                return {
                    data,
                    reference: "https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json"
                }
            })
    }
    async getProvinceGeoJson(provinceCode: string): Promise<GeoJSON.FeatureCollection> {
        return fetch(`geojson/all-provinces/${provinceCode}.geojson`)
            .then(res => res.json());
    }
    async getRegencies(provinceCode: string): Promise<{ data: Area[]; reference: string; }> {
        return fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceCode}.json`)
            .then(response => response.json())
            .then((provinces: { id: string, name: string }[]) => {

                const data: Area[] = provinces.map(province => ({
                    Kode: province.id,
                    Nama: province.name,
                    Ibukota: "",
                    Keterangan: "",
                    JumlahPenduduk: faker.number.int({ min: 100000, max: 1000000 }),
                    flagPindah: faker.helpers.arrayElement(["1", "0"]),
                    jumlahKab: faker.number.int({ min: 3, max: 15 }),
                    jumlahKec: faker.number.int({ min: 100, max: 100 }),
                    jumlahKel: faker.number.int({ min: 300, max: 1000 })
                }))

                return {
                    data,
                    reference: `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceCode}.json`
                }
            });
    }
    async getRegenciesGeoJson(proviceCode: string): Promise<GeoJSON.FeatureCollection> {
        return fetch(`geojson/regencies/${proviceCode}_2.json`).then(res => res.json())
    }

}


export class AreaCodeService implements IAreaService {

    async getProvinces(): Promise<{ data: Area[]; reference: string; }> {
        return fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
            .then(response => response.json())
            .then((provinces: { id: string, name: string }[]) => {
                const data: Area[] = provinces
                    .map(province => ({
                        Kode: province.id,
                        Nama: province.name,
                        Ibukota: "",
                        Keterangan: "",
                        JumlahPenduduk: faker.number.int({ min: 100000, max: 1000000 }),
                        flagPindah: faker.helpers.arrayElement(["1", "0"]),
                        jumlahKab: faker.number.int({ min: 3, max: 15 }),
                        jumlahKec: faker.number.int({ min: 100, max: 100 }),
                        jumlahKel: faker.number.int({ min: 300, max: 1000 })
                    }))

                return {
                    data,
                    reference: "https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json"
                }
            })
    }
    async getProvinceGeoJson(provinceCode: string): Promise<GeoJSON.FeatureCollection> {
        return fetch(`geojson/all-provinces/${provinceCode}.geojson`)
            .then(res => res.json());
    }
    async getRegencies(provinceCode: string): Promise<{ data: Area[]; reference: string; }> {
        return fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceCode}.json`)
            .then(response => response.json())
            .then((provinces: { id: string, name: string }[]) => {

                const data: Area[] = provinces.map(province => ({
                    Kode: province.id,
                    Nama: province.name,
                    Ibukota: "",
                    Keterangan: "",
                    JumlahPenduduk: faker.number.int({ min: 100000, max: 1000000 }),
                    flagPindah: faker.helpers.arrayElement(["1", "0"]),
                    jumlahKab: 1,
                    jumlahKec: faker.number.int({ min: 100, max: 100 }),
                    jumlahKel: faker.number.int({ min: 300, max: 1000 })
                }))

                return {
                    data,
                    reference: `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceCode}.json`
                }
            });
    }
    async getRegenciesGeoJson(proviceCode: string): Promise<GeoJSON.FeatureCollection> {
        return fetch(`geojson/regencies/${proviceCode}_2.json`).then(res => res.json())
    }

}

class AreaBoundaryService extends KodeWilayah {
    async getRegenciesGeoJson(provinceCode: string): Promise<GeoJSON.FeatureCollection> {
        const response = await fetch(`${import.meta.env.BASE_URL}geojson/batas/${provinceCode}.geojson`);
        if (!response.ok) throw new Error(`GeoJSON batas ${provinceCode}: HTTP ${response.status}`);
        const geojson = await response.json();
        if (geojson?.type !== "FeatureCollection" || !Array.isArray(geojson.features)) {
            throw new Error("Data GeoJSON batas tidak valid");
        }
        return geojson;
    }
}

export class AreaServiceFactory {
    static createAreaService(type: string, _version: string): IAreaService {
        switch (type) {
            case "area-code":
                return new KodeWilayah();
            case "area-boundry":
                return new AreaBoundaryService();
            default:
                return new AreaBoundaryService();
        }
    }
}
