import {DeviceTokenCredentials} from "@azure/ms-rest-nodeauth";
import {MemoryCache} from "adal-node";
import Store from "electron-store";

const store = new Store();
const key = 'credentials';

function generateCredentials(deviceTokenCredentials, tokenCache) {
    return new DeviceTokenCredentials(
        deviceTokenCredentials.clientId,
        deviceTokenCredentials.domain,
        deviceTokenCredentials.username,
        deviceTokenCredentials.tokenAudience,
        deviceTokenCredentials.environment,
        tokenCache
    );
}

async function generateTokenCache(creds) {
    let storedToken = creds.tokenCache._entries[0];
    let tokenCache = new MemoryCache();
    await addTokenToCache(storedToken, tokenCache);
    return tokenCache;
}

function readTokenFromStorage() {

    let deviceTokenCredentialsJson = store.get(key);
    return JSON.parse(deviceTokenCredentialsJson);
}

export async function refreshCredentials() {
    let storedToken = readTokenFromStorage();
    let tokenCache = await generateTokenCache(storedToken);
    return generateCredentials(storedToken, tokenCache);
}

async function addTokenToCache(token, tokenCache) {
    return new Promise((resolve, reject) => {
        tokenCache.add([token], (err, result) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            resolve(result);
        });
    });
}

export async function storeCredentials(creds) {
    let credsAsJson = JSON.stringify(creds);
    store.set(key, credsAsJson);
}
