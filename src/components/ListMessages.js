import React, {useState} from 'react';
import * as msRestNodeAuth from "@azure/ms-rest-nodeauth";
import {Button} from "react-bootstrap";
import {storeCredentials, refreshCredentials} from '../helpers/credentialHelper';
import {doSomethingWithCreds} from '../helpers/sbHelper';

function ListMessages(props) {

    const [body, setBody] = useState(
        'dummy body'
    );
    const [messageId, setMessageId] = useState(
        'dummy id'
    );
    const [messageCount, setMessageCount] = useState(
        'dummy count'
    );

    async function updateInfo() {
        let newCreds = await refreshCredentials();
        await doSomethingWithCreds(newCreds);
    }

    async function beginAzureLogin() {
        let deviceTokenCredentials = await msRestNodeAuth.interactiveLogin();
        await storeCredentials(deviceTokenCredentials);
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