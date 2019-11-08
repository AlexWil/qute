import React, {useEffect, useState} from 'react';
import {Button} from 'react-bootstrap';
import {refreshCreds, loginAndStoreCredentials} from '../helpers/credentialHelper';
import {listNamespaces, readFirstMessage, getQueueDetails} from '../helpers/sbHelper';

function ListMessages(): JSX.Element {
    const [messageBody, setMessageBody] = useState('dummy body');
    const [messageId, setMessageId] = useState();
    const [messageCount, setMessageCount] = useState(0);

    useEffect(() => {
        async function fetchData(): Promise<void> {
            const newCreds = await refreshCreds();
            const queueDetails = await getQueueDetails(newCreds, 'sandbox');
            setMessageCount(queueDetails.messageCount!);
        }

        fetchData().then(r => {
            console.log(r);
        });
    });

    async function updateInfo(): Promise<void> {
        const newCreds = await refreshCreds();
        await listNamespaces(newCreds);
        const message = await readFirstMessage(newCreds);
        setMessageBody(message.body);
        setMessageId(message.messageId);
    }

    async function beginAzureLogin(): Promise<void> {
        await loginAndStoreCredentials();
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
        </div>
    );
}

export default ListMessages;
