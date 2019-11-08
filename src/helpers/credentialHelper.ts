import {DeviceTokenCredentials, default as msRestNodeAuth} from '@azure/ms-rest-nodeauth';
import {MemoryCache, TokenCache, TokenResponse} from 'adal-node';
import ElectronStore from 'electron-store';
import {DeviceTokenCredentialsDto} from '../interfaces/interfaces';

const store = new ElectronStore();
const key = 'credentials';

function generateCreds(
    deviceTokenCredentials: DeviceTokenCredentialsDto,
    tokenCache: TokenCache,
): DeviceTokenCredentials {
    return new DeviceTokenCredentials(
        deviceTokenCredentials.clientId,
        deviceTokenCredentials.domain,
        deviceTokenCredentials.username,
        deviceTokenCredentials.tokenAudience,
        deviceTokenCredentials.environment,
        tokenCache,
    );
}

async function generateTokenCache(creds: DeviceTokenCredentialsDto): Promise<MemoryCache> {
    const storedToken = creds.tokenCache._entries[0];
    const tokenCache = new MemoryCache();
    await addTokenToCache(storedToken, tokenCache);
    return tokenCache;
}

function readCredsFromStorage(): DeviceTokenCredentialsDto {
    const deviceTokenCredentialsJson = store.get(key);
    return JSON.parse(deviceTokenCredentialsJson);
}

export async function refreshCreds(): Promise<DeviceTokenCredentials> {
    const storedCreds = readCredsFromStorage();
    const tokenCache = await generateTokenCache(storedCreds);
    return generateCreds(storedCreds, tokenCache);
}

//replace with promisify?
async function addTokenToCache(token: TokenResponse, tokenCache: TokenCache): Promise<void> {
    return new Promise((resolve, reject) => {
        tokenCache.add([token], err => {
            if (err) {
                console.log(err);
                reject(err);
            }
            resolve();
        });
    });
}

export async function loginAndStoreCredentials(): Promise<void> {
    const deviceTokenCredentials = await msRestNodeAuth.interactiveLogin();
    await storeCredentials(deviceTokenCredentials);
}

export async function storeCredentials(creds: DeviceTokenCredentials): Promise<void> {
    const credsAsJson = JSON.stringify(creds);
    store.set(key, credsAsJson);
    console.log('stored creds');
}
