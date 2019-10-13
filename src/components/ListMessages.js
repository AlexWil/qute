import React, { useState } from 'react';
import {ServiceBusClient, ReceiveMode} from '@azure/service-bus';
import {Button} from "react-bootstrap";
import config from 'config';
const sbConnectionString = config.get('serviceBus.connectionString');

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

    const serviceBusClient = ServiceBusClient.createFromConnectionString(sbConnectionString);
    const queueClient = serviceBusClient.createQueueClient("sandbox");

    async function displayFirstMessage() {
        let peekedMessage = await queueClient.peek();
        console.log({peekedMessage});
        let messageBody = peekedMessage[0].body;
        setBody(messageBody);
        setMessageId(peekedMessage[0].messageId)
    }

    return (
        <div>
            This is your first message: {body}
            <br/>
            It has the following id: {messageId}
            <br/>
            Your total amount of message is: {messageCount}
            <Button
                variant="primary"
                onClick={displayFirstMessage}
            >
                DO IT!
            </Button>
        </div>

    );
}

export default ListMessages;