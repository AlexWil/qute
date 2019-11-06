import React, {useState} from 'react';
import {ServiceBusManagementClient} from '@azure/arm-servicebus';
import * as msRestNodeAuth from "@azure/ms-rest-nodeauth";
import {DeviceTokenCredentials} from "@azure/ms-rest-nodeauth";
import {Button} from "react-bootstrap";
import config from 'config';
import {MemoryCache} from 'adal-node';

const Store = require('electron-store');

function ListMessages(props) {

    const store = new Store();
    const [body, setBody] = useState(
        'dummy body'
    );
    const [messageId, setMessageId] = useState(
        'dummy id'
    );
    const [messageCount, setMessageCount] = useState(
        'dummy count'
    );

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
        let deviceTokenCredentialsJson = store.get('foo');
        return JSON.parse(deviceTokenCredentialsJson);
    }

    async function refreshCredentials() {
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

    async function updateInfo() {
        let newCreds = await refreshCredentials();
        await doSomethingWithCreds(newCreds);
    }

    async function doSomethingWithCreds(deviceTokenCredentials) {
        const subscriptionId = config.get('azure.subscriptionId');
        const client = new ServiceBusManagementClient(deviceTokenCredentials, subscriptionId);
        client.namespaces.list().then(namespaces => {
            namespaces.map(ns => {
                console.log(`found ns : ${ns.name}`);
            });
        });
    }

    async function beginAzureLogin() {
        console.log("starting azure login procedure");

        let deviceTokenCredentials = await msRestNodeAuth.interactiveLogin();

        await doSomethingWithCreds(deviceTokenCredentials);

        let deviceTokenCredentialsJson = JSON.stringify(deviceTokenCredentials);
        store.set('foo', deviceTokenCredentialsJson);
    }

    return (
        <div>
            This is your first message: {body}
            <br/>
            It has the following id: {messageId}
            <br/>
            Your total amount of message is: {messageCount}
            <br/>
            <Button
                variant="secondary"
                onClick={updateInfo}
            >
                Update info
            </Button>
            <br/>
            <Button
                variant="primary"
                onClick={beginAzureLogin}
            >
                Login
            </Button>
        </div>
    );
}

export default ListMessages;