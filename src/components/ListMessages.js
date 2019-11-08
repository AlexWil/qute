import React, {useEffect, useState} from 'react';
import * as msRestNodeAuth from "@azure/ms-rest-nodeauth";
import {Button} from "react-bootstrap";
import {storeCredentials, refreshCreds} from '../helpers/credentialHelper';
import {listNamespaces, readFirstMessage, getQueueDetails} from '../helpers/sbHelper';

function ListMessages(props) {

    const [messageBody, setMessageBody] = useState(
        'dummy body'
    );
    const [messageId, setMessageId] = useState(
        'dummy id'
    );
    const [messageCount, setMessageCount] = useState(
        'dummy count'
    );

    useEffect(() => {
        async function fetchData() {
            let newCreds = await refreshCreds();
            const queueDetails = await getQueueDetails(newCreds, "sandbox");
            setMessageCount(queueDetails.messageCount)
        }
        fetchData();
    });

    async function updateInfo() {
        let newCreds = await refreshCreds();
        await listNamespaces(newCreds);
        const message = await readFirstMessage(newCreds);
        setMessageBody(message.body);
        setMessageId(message.messageId);
    }

    async function beginAzureLogin() {
        let deviceTokenCredentials = await msRestNodeAuth.interactiveLogin();
        await storeCredentials(deviceTokenCredentials);
    }

    return (
        <div>
            This is your first message: {messageBody}
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