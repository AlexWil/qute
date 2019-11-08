import {DeviceTokenCredentials, default as msRestNodeAuth} from '@azure/ms-rest-nodeauth';
import {MemoryCache, TokenCache, TokenResponse} from 'adal-node';
import ElectronStore from 'electron-store';
import {DeviceTokenCredentialsDto} from '../interfaces/interfaces';

const store = new ElectronStore();
const key = 'credentials';

function generateCreds(deviceTokenCredentials: DeviceTokenCredentialsDto, tokenCache: TokenCache) {
    return new DeviceTokenCredentials(
        deviceTokenCredentials.clientId,
        deviceTokenCredentials.domain,
        deviceTokenCredentials.username,
        deviceTokenCredentials.tokenAudience,
        deviceTokenCredentials.environment,
        tokenCache,
    );
}

async function generateTokenCache(creds: DeviceTokenCredentialsDto) {
    const storedToken = creds.tokenCache._entries[0];
    const tokenCache = new MemoryCache();
    await addTokenToCache(storedToken, tokenCache);
    return tokenCache;
}

function readCredsFromStorage(): DeviceTokenCredentialsDto {
    const deviceTokenCredentialsJson = store.get(key);
    return JSON.parse(deviceTokenCredentialsJson);
}

export async function refreshCreds() {
    const storedCreds = readCredsFromStorage();
    const tokenCache = await generateTokenCache(storedCreds);
    return generateCreds(storedCreds, tokenCache);
}

//replace with promisify?
async function addTokenToCache(token: TokenResponse, tokenCache: TokenCache) {
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

export async function loginAndStoreCredentials() {
    const deviceTokenCredentials = await msRestNodeAuth.interactiveLogin();
    await storeCredentials(deviceTokenCredentials);
}

export async function storeCredentials(creds: DeviceTokenCredentials) {
    const credsAsJson = JSON.stringify(creds);
    store.set(key, credsAsJson);
    console.log('stored creds');
}
