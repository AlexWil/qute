import {SasTokenProvider} from '@azure/amqp-common';
import config from 'config';
import fetch from 'node-fetch';

const namespace: string = config.get('serviceBus.namespace');
const host = `https://${namespace}.servicebus.windows.net`;
const baseURL = `${host}/sandbox/messages`;

export async function doStuff(): Promise<any> {
    const connectionString: string = config.get('serviceBus.connectionString');
    const tokenProvider = SasTokenProvider.fromConnectionString(connectionString);
    const token = await tokenProvider.getToken();
    console.log(token);

    const body = 'foobar';
    const someResponse = await fetch(baseURL, {
        method: 'post',
        headers: {
            Authorization: token.token,
            ContentType: 'application/atom+xml;type=entry;charset=utf-8',
        },
        body: body,
    });

    console.log(someResponse);
}
