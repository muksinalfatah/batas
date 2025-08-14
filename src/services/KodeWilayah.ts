import { GEO_JSON_BASE_URL } from "../const/config";
import { Area } from "../types";
import { IAreaService } from "../types/services";

export class KodeWilayah implements IAreaService {

    BASE_URL = import.meta.env.VITE_AREA_SERVICE_BASE_URL as string;

    token: string | null = null;

    private async authenticate() {
        const response = await fetch(`${this.BASE_URL}kode-wap/token`, {
            headers: {
                TimeStamp: '2024-05-08T07:00:00Z',
                PartnerKey: 'b9PDmCSkUIDAUn5BvG8PlBbAnGiaEEW1/RmVbxBTs38=',
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

    async getRegenciesGeoJson(proviceCode: string): Promise<GeoJSON.FeatureCollection> {
        return fetch(`${GEO_JSON_BASE_URL}/kode-wilayah/regencies/${proviceCode}_2.json`).then(res => res.json())
    }

}