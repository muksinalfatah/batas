export type IslandGroup = {
    id: string;
    name: string;
    color: string;
    provinceCodes: string[];
};

export const ISLAND_GROUPS: IslandGroup[] = [
    { id: 'sumatera', name: 'Sumatera', color: '#0ea5e9', provinceCodes: ['11', '12', '13', '14', '15', '16', '17', '18', '19', '21'] },
    { id: 'jawa', name: 'Jawa', color: '#6366f1', provinceCodes: ['31', '32', '33', '34', '35', '36'] },
    { id: 'kalimantan', name: 'Kalimantan', color: '#10b981', provinceCodes: ['61', '62', '63', '64', '65'] },
    { id: 'sulawesi', name: 'Sulawesi', color: '#f59e0b', provinceCodes: ['71', '72', '73', '74', '75', '76'] },
    { id: 'bali-nusa-tenggara', name: 'Bali & Nusa Tenggara', color: '#ec4899', provinceCodes: ['51', '52', '53'] },
    { id: 'maluku', name: 'Maluku', color: '#8b5cf6', provinceCodes: ['81', '82'] },
    { id: 'papua', name: 'Papua', color: '#ef4444', provinceCodes: ['91', '92', '93', '94', '95', '96'] },
];
