import { Environment } from '@azure/ms-rest-azure-env';

export interface DeviceTokenCredentialsDto {
    clientId: string;
    domain: string;
    username: string;
    tokenAudience: string;
    environment: Environment;
    tokenCache: TokenCacheDto;
}

interface TokenCacheDto {
    _entries: any[];
}
