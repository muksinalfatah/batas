import { getLocalProvinces, getLocalRegencies, readLocalGeoJson } from "./localGeoJson";
import { Area } from "../types";
import { IAreaService } from "../types/services";

export class KodeWilayah implements IAreaService {

    async getProvinces() {
        const local = await getLocalProvinces();
        try {
            const api = await this.getApiProvinces();
            const byCode = new Map(api.data.map(area => [area.Kode, area]));
            return {
                ...local,
                data: local.data.map(area => ({ ...area, ...byCode.get(area.Kode) })),
            };
        }
        catch (error) {
            console.warn('API provinsi gagal; memakai daftar GeoJSON lokal.', error);
            return local;
        }
    }

    async getRegencies(provinceCode: string) {
        try { return await this.getApiRegencies(provinceCode); }
        catch (error) {
            console.warn('API kabupaten gagal; memakai properti GeoJSON lokal.', error);
            return getLocalRegencies(provinceCode);
        }
    }

    BASE_URL = import.meta.env.VITE_AREA_SERVICE_BASE_URL as string;

    token: string | null = null;

    private async authenticate() {
        const response = await fetch(`${this.BASE_URL}kode-wap/token`, {
            signal: AbortSignal.timeout(5000),
            headers: {
                TimeStamp: '2026-10-16T07:20:00Z',
                PartnerKey: 'FHbW102IyYqVspOqVaRKfAxZeHL1v7anE+ReWov/a1o=',
                PartnerName: 'adwilapi'
            }
        });
        if (!response.ok) throw new Error(`Autentikasi: HTTP ${response.status}`);
        const data = await response.json();
        if (!data.token) throw new Error('Token API wilayah tidak tersedia');
        this.token = data.token;
    }

    private async getApiProvinces(): Promise<{ data: Area[]; reference: string; }> {
        if (!this.token) {
            await this.authenticate();
        }

        const response = await fetch(`${this.BASE_URL}api/KodeWilayah/Provinsi`, {
            signal: AbortSignal.timeout(5000),
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });

        if (response.status === 401) {
            this.token = null;
            throw new Error("API wilayah menolak autentikasi");
        }

        if (!response.ok) throw new Error(`API wilayah: HTTP ${response.status}`);
        const body = await response.json();
        if (!Array.isArray(body.data) || body.data.length === 0) {
            throw new Error("Daftar provinsi API kosong atau tidak valid");
        }

        const areas: Area[] = body.data.map((area: any) => ({
            ...area,
            Kode: String(area.Kode ?? area.KodeWilayah ?? "").trim(),
            flagPindah: String(area.flagPindah ?? "0"),
        }))


        return {
            data: areas,
            reference: ""
        };
    }

    async getProvinceGeoJson(provinceCode: string): Promise<GeoJSON.FeatureCollection> {
        return readLocalGeoJson(`provinces/${provinceCode}.json`);
    }

    private async getApiRegencies(provinceCode: string): Promise<{ data: Area[]; reference: string; }> {
        if (!this.token) {
            await this.authenticate();
        }

        const response = await fetch(`${this.BASE_URL}api/KodeWilayah/Kabupaten`, {
            signal: AbortSignal.timeout(5000),
            method: "POST",
            body: JSON.stringify({ KodeWilayah: provinceCode }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`
            }
        });

        if (response.status === 401) {
            this.token = null;
            throw new Error("API wilayah menolak autentikasi");
        }

        if (!response.ok) throw new Error(`API wilayah: HTTP ${response.status}`);
        const body = await response.json();

        const areas: Area[] = body.data.map((area: any) => ({
            ...area,
            Kode: String(area.Kode ?? area.KodeWilayah ?? "").trim(),
            flagPindah: String(area.flagPindah ?? "0"),
        }))

        return {
            data: areas,
            reference: ""
        };
    }

    async getRegenciesGeoJson(proviceCode: string): Promise<GeoJSON.FeatureCollection> {
        return readLocalGeoJson(`regencies/${proviceCode}_2.json`);
    }

}
