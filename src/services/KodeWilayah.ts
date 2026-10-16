import { getLocalProvinces, getLocalRegencies, readLocalGeoJson } from "./localGeoJson";
import { Area } from "../types";
import { IAreaService } from "../types/services";
import { createPartnerHeaders } from "./partnerAuth";

export class KodeWilayah implements IAreaService {
    private areaDetails = new Map<string, Promise<Area>>();

    getProvinceDetail(provinceCode: string): Promise<Area> {
        return this.getAreaDetail(provinceCode);
    }

    getRegencyDetail(regencyCode: string): Promise<Area> {
        return this.getAreaDetail(regencyCode);
    }

    private getAreaDetail(areaCode: string): Promise<Area> {
        const cached = this.areaDetails.get(areaCode);
        if (cached) return cached;
        const request = this.fetchAreaDetail(areaCode).catch(error => {
            this.areaDetails.delete(areaCode);
            throw error;
        });
        this.areaDetails.set(areaCode, request);
        return request;
    }

    private async fetchAreaDetail(areaCode: string): Promise<Area> {
        if (!this.token) await this.authenticate();
        const url = `${this.BASE_URL}kode-wap/data/2.0.0/${encodeURIComponent(areaCode)}`;
        const fetchDetail = () => fetch(url, {
            signal: AbortSignal.timeout(5000),
            headers: { Authorization: `Bearer ${this.token}` },
        });
        let response = await fetchDetail();
        if (response.status === 401) {
            this.token = null;
            await this.authenticate();
            response = await fetchDetail();
        }
        if (!response.ok) throw new Error(`Detail wilayah: HTTP ${response.status}`);
        const body = await response.json();
        const detail = Array.isArray(body.data)
            ? body.data.find((area: { KodeWap?: string }) => String(area.KodeWap) === areaCode)
            : undefined;
        if (!detail) throw new Error("Detail wilayah tidak tersedia");
        const number = (value: unknown): number | undefined => {
            if (value == null || value === "") return undefined;
            const result = Number(value);
            return Number.isFinite(result) ? result : undefined;
        };
        const kelurahan = number(detail.JumlahKelurahan);
        const desa = number(detail.JumlahDesa);
        return {
            Kode: String(detail.KodeWap),
            Nama: detail.NamaWap ?? "",
            Ibukota: detail.Ibukota ?? "",
            LuasWilayah: number(detail.LuasWilayah),
            JumlahPenduduk: number(detail.JumlahPenduduk),
            jumlahKab: number(detail.JumlahKabupaten),
            jumlahKota: number(detail.JumlahKota),
            jumlahKec: number(detail.JumlahKecamatan),
            jumlahKel: kelurahan == null && desa == null ? undefined : (kelurahan ?? 0) + (desa ?? 0),
            Keterangan: detail.Pemerintahan?.Peraturan ?? "",
            flagPindah: String(detail.flagPindah ?? "0"),
        };
    }

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
        const headers = await createPartnerHeaders(
            import.meta.env.VITE_AREA_PARTNER_NAME,
            import.meta.env.VITE_AREA_PARTNER_KEY,
            import.meta.env.VITE_AREA_PARTNER_SECRET_WORD,
        );
        const response = await fetch(`${this.BASE_URL}kode-wap/token`, {
            signal: AbortSignal.timeout(5000),
            headers,
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
