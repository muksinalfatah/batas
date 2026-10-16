export async function createPartnerHeaders(
    partnerName: string,
    partnerKey: string,
    secretWord: string,
    timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
): Promise<Record<string, string>> {
    if (!partnerName || !partnerKey || !secretWord) {
        throw new Error("Konfigurasi autentikasi partner belum lengkap");
    }
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        "raw", encoder.encode(secretWord),
        { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
    );
    const signature = await crypto.subtle.sign(
        "HMAC", key, encoder.encode(partnerName + partnerKey + timestamp),
    );
    return {
        PartnerName: partnerName,
        TimeStamp: timestamp,
        PartnerKey: btoa(String.fromCharCode(...new Uint8Array(signature))),
    };
}
