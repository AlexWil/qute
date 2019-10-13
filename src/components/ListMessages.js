import React, { useState } from 'react';
import {ServiceBusClient, ReceiveMode} from '@azure/service-bus';
import {Button} from "react-bootstrap";

function ListMessages(props) {


    const [body, setBody] = useState(
        'dummy body'
    );
    const [messageId, setMessageId] = useState(
        'dummy id'
    );

    // const queueClient = ServiceBusClient.createQueueClient("sandbox");
    const connectionString = "foo";
    const serviceBusClient = ServiceBusClient.createFromConnectionString(connectionString);
    const queueClient2 = serviceBusClient.createQueueClient("sandbox");

    async function displayFirstMessage() {
        let peekedMessage = await queueClient2.peek();
        console.log({peekedMessage});
        let messageBody = peekedMessage[0].body;
        setBody(messageBody);
        setMessageId(peekedMessage[0].messageId)
        // const receiver = queueClient2.createReceiver(ReceiveMode.peekLock);
    }

    return (
        <div>
            This is your first message: {body}
            <br/>
            It has the following id: {messageId}
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