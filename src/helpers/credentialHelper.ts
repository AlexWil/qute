import {DeviceTokenCredentials, interactiveLogin} from '@azure/ms-rest-nodeauth';
import {MemoryCache, TokenCache, TokenResponse, ErrorResponse, Logging, LoggingLevel} from 'adal-node';
import ElectronStore from 'electron-store';
import {DeviceTokenCredentialsDto} from '../interfaces/interfaces';

// const logLevel: LoggingLevel = 2;
// Logging.setLoggingOptions({
//     log: function(level, message, error) {
//         console.log(`ADAL ${level} ${message} ${error}`);
//     },
//     level: logLevel,
//     loggingWithPII: true,
// });

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

export async function loadStoredCreds(): Promise<DeviceTokenCredentials> {
    const storedCreds = readCredsFromStorage();
    console.log({storedCreds});
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
    const deviceTokenCredentials = await interactiveLogin();
    console.log(deviceTokenCredentials);
    await storeCredentials(deviceTokenCredentials);
}

async function storeCredentials(creds: DeviceTokenCredentials): Promise<void> {
    const credsAsJson = JSON.stringify(creds);
    store.set(key, credsAsJson);
    console.log('stored creds');
}

export async function refreshCredentials(): Promise<void> {
    const creds = await loadStoredCreds();
    const clientId = creds.clientId;
    const authority = (await creds.getToken())['_authority'];
    const newAccessToken = await getNewAccessToken(creds);
    console.log(newAccessToken);
    if ((newAccessToken as ErrorResponse).error) {
        console.log('ERROR', newAccessToken.error);
    }
    if ((newAccessToken as TokenResponse).tokenType) {
        const newAccessTokenAsTokenResponse = newAccessToken as TokenResponse;
        newAccessTokenAsTokenResponse._authority = authority;
        newAccessTokenAsTokenResponse._clientId = clientId;
        await clearTokenCache(creds.tokenCache);
        await addTokenToCache(newAccessTokenAsTokenResponse, creds.tokenCache);
    }
    console.log(creds);
    const credsAsJson = JSON.stringify(creds);
    store.set(key, credsAsJson);
    console.log('stored refreshed creds');
}

async function getNewAccessToken(creds: DeviceTokenCredentials): Promise<TokenResponse | ErrorResponse> {
    const authContext = creds.authContext;
    const token = await creds.getToken();
    return new Promise((resolve, reject) => {
        authContext.acquireTokenWithRefreshToken(token.refreshToken!, creds.clientId, token.resource, (err, res) => {
            if (err) reject(err);
            console.log({res});
            resolve(res);
        });
    });
}

async function clearTokenCache(tokenCache: TokenCache): Promise<TokenResponse | ErrorResponse> {
    return new Promise((resolve, reject) => {
        tokenCache.find({}, (err, tokens) => {
            if (err) reject(err);
            tokenCache.remove(tokens, err => {
                if (err) reject(err);
                resolve();
            });
        });
    });
}
