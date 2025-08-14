import * as fs from 'fs';
import { arcgisToGeoJSON } from "@terraformer/arcgis";
import * as turf from "@turf/turf";
import * as turfMeta from "@turf/meta";


async function getAllFiles() {
    return new Promise((resolve, reject) => {
        const folder = "arcgisjson"
        fs.readdir(folder, {}, (err, files) => {
            if (err) {
                reject(err)
            } else {
                let result = files.map(file => folder + "/" + file);
                resolve(result)
            }
        })
    })
}


async function parseFileToJSON(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', ((err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(arcgisToGeoJSON(JSON.parse(data)))
            }
        }))
    })
}

function isProvince(kode_wilayah) {
    return kode_wilayah.split(".").length < 2
}

(async () => {
    const files = await getAllFiles();
    const provinces = [];
    const regencies = {};

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const geoJson = await parseFileToJSON(file)

        turfMeta.featureEach(geoJson, (feature) => {
            let kode_wilayah = feature.properties['KDPKAB'] ? feature.properties['KDPKAB'] : feature.properties['KDPPUM'];
            let newgeoJson = feature;
            
            if (isProvince(kode_wilayah)) {
                provinces.push(newgeoJson);
            }else{
                let province_code = feature.properties['KDPPUM'];
                if (!regencies[province_code]) {
                    regencies[province_code] = [];
                }

                regencies[province_code].push(newgeoJson)
            }
        })
    }

    if (provinces) {
        let allProvinces = turf.featureCollection([...provinces]);
        fs.writeFileSync('public/geojson/all.json',JSON.stringify(allProvinces))
    }

    if (regencies) {
        for (const key in regencies) {
            if (Object.hasOwnProperty.call(regencies, key)) {
                const regency = regencies[key];
                let combined = turf.featureCollection([...regency]);
                fs.writeFileSync(`public/geojson/${key}.json`,JSON.stringify(combined))
            }
        }
    }
})()