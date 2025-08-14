import { GEO_JSON_BASE_URL, STATIC_FILE_BASE_URL } from "../const/config";
import { Area } from "../types"
import { IAreaService } from "../types/services";
import { faker } from '@faker-js/faker';
import { KodeWilayah } from "./KodeWilayah";

export class AreaService implements IAreaService {
    async getProvinces(): Promise<{ data: Area[]; reference: string; }> {
        return fetch(`${STATIC_FILE_BASE_URL}/provinces.json`).then(res => res.json())
    }

    async getProvinceGeoJson(provinceCode: string): Promise<GeoJSON.FeatureCollection> {
        return fetch(`${GEO_JSON_BASE_URL}/kode-wilayah/provinces/${provinceCode}.json`).then(res => res.json())
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
        return fetch(`${GEO_JSON_BASE_URL}/kode-wilayah/regencies/${proviceCode}_2.json`).then(res => res.json())
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

class AreaBoundaryService implements IAreaService {

    BASE_URL = import.meta.env.VITE_AREA_SERVICE_BASE_URL as string;

    token: string | null = null;

    private async authenticate() {
        const response = await fetch(`${this.BASE_URL}kode-wap/token`, {
            headers: {
                TimeStamp: '2025-08-14T07:00:00Z',
                PartnerKey: '7Fp7vmRaitWL8eusO2/n1DHgRYBudCubn1FDP7zbBHc=',
                PartnerName: 'kpuid'
            }
        });
        const data = await response.json();
        this.token = data.token;
    }

    async getProvinces(): Promise<{ data: Area[]; reference: string; }> {
        if (!this.token) {
            await this.authenticate();
        }

        const response = await fetch(`${this.BASE_URL}api/KodeWilayah/Provinsi`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });

        if (response.status === 401) {
            await this.authenticate();
            return this.getProvinces();
        }

        const body = await response.json();

        const areas: Area[] = body.data.map((area: any) => ({
            ...area,
            flagPindah: area.flagPindah ?? "0",
        }))


        return {
            data: areas,
            reference: ""
        };
    }

    async getProvinceGeoJson(provinceCode: string): Promise<GeoJSON.FeatureCollection> {
        return fetch(`${GEO_JSON_BASE_URL}/kode-wilayah/provinces/${provinceCode}.json`)
            .then(res => res.json());
    }

    async getRegencies(provinceCode: string): Promise<{ data: Area[]; reference: string; }> {
        if (!this.token) {
            await this.authenticate();
        }

        const response = await fetch(`${this.BASE_URL}api/KodeWilayah/Kabupaten`, {
            method: "POST",
            body: JSON.stringify({ KodeWilayah: provinceCode }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`
            }
        });

        if (response.status === 401) {
            await this.authenticate();
            return this.getProvinces();
        }

        const body = await response.json();

        const areas: Area[] = body.data.map((area: any) => ({
            ...area,
            Kode: area.KodeWilayah,
            flagPindah: area.flagPindah ?? "0",
        }))

        return {
            data: areas,
            reference: ""
        };
    }

    async getRegenciesGeoJson(provinceCode: string): Promise<GeoJSON.FeatureCollection> {
        const geojson = await fetch(`${GEO_JSON_BASE_URL}/batas/${provinceCode}.geojson`).then(res => res.json())
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
