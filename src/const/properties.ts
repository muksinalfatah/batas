const TIPTBT_MAP = new Map([
    ["1", "antar provinsi"],
    ["2", "antar kabupaten"],
    ["3", "antar kota"],
    ["4", "kabupaten-kota"],
    ["5", "kota-kabupaten"],
    ["7", "antar desa"],
    ["8", "antar kelurahan"],
    ["9", "desa-kelurahan"],
    ["10", "kelurahan-desa"],
    ["6", "antar kecamatan/distrik"],
])

const RULE_ID_MAP = new Map([
    ["2", "Batas Kabupaten/Kota, Belum Ditegaskan"],
    ["3", "Batas Kabupaten/Kota, Hasil Kesepakatan"],
    ["4", "Batas Kabupaten/Kota, Lainnya"],
    ["5", "Batas Kabupaten/Kota, Referensi Resmi"],
    ["6", "Batas Provinsi, Belum Ditegaskan"],
    ["7", "Batas Provinsi, Hasil Kesepakatan"],
    ["8", "Batas Provinsi, Lainnya"],
    ["9", "Batas Provinsi, Referensi Resmi"],
    ["1", "<all other values>"],
    ["-1", "Free Representation"],
])

const TIPLOK_MAP = new Map([
    ["1", "Darat"],
    ["2", "Laut"],
    ["999", "Lainnya"],
])

const STSBTS_MAP = new Map([
    ["1", "Referensi Resmi"],
    ["2", "Hasil Kesepakatan"],
    ["3", "Belum Ditegaskan"],
    ["999", "Lainnya"],
])

const KARKTR_MAP = new Map([
    ["1", "Batas Alam"],
    ["2", "Batas Buatan"],
    ["999", "Lainnya"],
])

const KLBADM_MAP = new Map([
    ["1", "Batas Perairan Internasional"],
    ["2", "Batas Perairan ZEE"],
    ["3", "Batas Landas Kontinen"],
    ["4", "Batas Zona Tambahan"],
    ["5", "Batas Perairan Teritorial"],
    ["6", "Batas Teritorial"],
    ["7", "Batas Provinsi"],
    ["8", "Batas Kabupaten/Kota"],
    ["9", "Batas Kecamatan/Distrik"],
    ["10", "Batas Kelurahan/Desa"],
    ["11", "Batas Kampung"],
    ["12", "Batas Perairan Teritorial 20 mil"],
    ["13", "Batas Perairan Provinsi"],
    ["14", "Batas Perairan Kabupaten"],
    ["15", "Batas Perairan Kecamatan/Distrik"],
    ["16", "Batas Perairan Desa"],
    ["999", "Lainnya"],
])

export const PROPERTIES_MAPPING = [
    {
        key: "RuleID",
        label: "Rule ID",
        render: (value: string) => RULE_ID_MAP.get(value.toString()) ?? value,
    },
    {
        key: "TIPTBT",
        label: "Tipe Batas",
        render: (value: string) => TIPTBT_MAP.get(value.toString()) ?? value,
    },
    {
        key: "TIPLOK",
        label: "Tipe Lokasi",
        render: (value: string) => TIPLOK_MAP.get(value.toString()) ?? value,
    },
    {
        key: "REMARK",
        label: "Catatan",
        render: (value: string) => value,
    },
    {
        key: "ADMIN1",
        label: "KODE PUM Administasi #1",
        render: (value: string) => value,
    },
    {
        key: "ADMIN2",
        label: "KODE PUM Administasi #2",
        render: (value: string) => value,
    },
    {
        key: "KRKTR",
        label: "Karakteristik Batas",
        render: (value: string) => KARKTR_MAP.get(value.toString()) ?? value,
    },
    {
        key: "KLBADM",
        label: "Klasifikasi Batas Administrasi",
        render: (value: string) => KLBADM_MAP.get(value.toString()) ?? value,
    },
    {
        key: "PJGBTS",
        label: "Panjang Batas",
        render: (value: string) => value,
    },
    {
        key: "STSBTS",
        label: "Status Batas",
        render: (value: string) => STSBTS_MAP.get(value.toString()) ?? value,
    },
    {
        key: "UUPP",
        label: "Referensi Peraturan",
        render: (value: string) => value,
    },
    {
        key: "WADKC1",
        label: "Wilayah Administrasi Kecamatan atau Distrik #1",
        render: (value: string) => value,
    },
    {
        key: "WADKC2",
        label: "Wilayah Administrasi Kecamatan atau Distrik #2",
        render: (value: string) => value,
    },
    {
        key: "WAKBK1",
        label: "Wilayah Administrasi Kabupaten atau Kota #1",
        render: (value: string) => value,
    },
    {
        key: "WAKBK2",
        label: "Wilayah Administrasi Kabupaten atau Kota #2",
        render: (value: string) => value,
    },
    {
        key: "WAKLD1",
        label: "Wilayah Administrasi Kelurahan atau Desa #1",
        render: (value: string) => value,
    },
    {
        key: "WAKLD2",
        label: "Wilayah Administrasi Kelurahan atau Desa #2",
        render: (value: string) => value,
    },
    {
        key: "WAPRO1",
        label: "Wilayah Administrasi Provinsi #1",
        render: (value: string) => value,
    },
    {
        key: "WAPRO2",
        label: "Wilayah Administrasi Provinsi #2",
        render: (value: string) => value,
    }
]