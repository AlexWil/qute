import React, {useEffect, useState} from 'react';
import {Button} from 'react-bootstrap';
import {loadStoredCreds, loginAndStoreCredentials, refreshCredentials} from '../helpers/credentialHelper';
import {listNamespaces, readFirstMessage, getQueueDetails} from '../helpers/sbHelper';
import {doStuff} from '../helpers/azureRestApiHelper';

function ListMessages(): JSX.Element {
    const [messageBody, setMessageBody] = useState('dummy body');
    const [messageId, setMessageId] = useState();
    const [messageCount, setMessageCount] = useState(0);
    //
    // useEffect(() => {
    //     async function fetchData(): Promise<void> {
    //         const newCreds = await loadStoredCreds();
    //         const queueDetails = await getQueueDetails(newCreds, 'sandbox');
    //         setMessageCount(queueDetails.messageCount!);
    //     }
    //
    //     fetchData().then(r => {
    //         console.log(r);
    //     });
    // });

    async function updateInfo(): Promise<void> {
        const newCreds = await loadStoredCreds();
        await listNamespaces(newCreds);
        const message = await readFirstMessage(newCreds);
        if (message) {
            setMessageBody(message.body);
            setMessageId(message.messageId);
        }
    }

    async function beginAzureLogin(): Promise<void> {
        await loginAndStoreCredentials();
    }

    async function refreshToken(): Promise<void> {
        await refreshCredentials();
    }

    async function restStuff(): Promise<void> {
        await doStuff();
    }

    return (
        <div>
            This is your first message: {messageBody}
            <br />
            It has the following id: {messageId}
            <br />
            Your total amount of message is: {messageCount}
            <br />
            <Button variant="secondary" onClick={updateInfo}>
                Update info
            </Button>
            <br />
            <Button variant="primary" onClick={beginAzureLogin}>
                Login
            </Button>
            <br />
            <Button variant="primary" onClick={refreshToken}>
                Refresh Token
            </Button>
            <Button variant="primary" onClick={restStuff}>
                Do some fancy rest stuff
            </Button>
        </div>
    );
}

export default ListMessages;
