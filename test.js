const getRegencyInfo = async (code) => {
    const headers = {
        "TimeStamp": "2022-12-23T20:00:00Z",
        "PartnerKey": "9653a3yanUqGbnmieGCR5S+yf6HLjg2ukQTSCvLoQ1Q=",
        "PartnerName": "ossadwil"
    }
    console.log(headers)
    const token = await fetch("https://apikodewilayah.kemendagri.go.id/api/KodeWilayahToken", {
        headers
    })
    .then(res => {
        console.log(res)
        return res.json()
    }).then(json => json.token)
    
    const province = await fetch("https://apikodewilayah.kemendagri.go.id/api/KodeWilayah/Provinsi",{
        method: "POST",
        body: JSON.stringify({
            KodeWilayah: "31.71"
        }),
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }).then(res => res.json()).then(json => json);

    console.log(province)

    const regencies = await fetch("https://apikodewilayah.kemendagri.go.id/api/KodeWilayah/Kabupaten",{
        method: "POST",
        body: JSON.stringify({
            KodeWilayah: "11"
        }),
        headers: {
            "TimeStamp": new Date().toISOString(),
            "UserID": "qwer",
            "UserKey": "KPUID",
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    }).then(res => res.json()).then(json => json)

    console.log(regencies)
}

(async () => {
    await getRegencyInfo()
})()