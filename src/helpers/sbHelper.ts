import config from 'config';
import { ServiceBusManagementClient } from '@azure/arm-servicebus';
import { ServiceBusClient } from '@azure/service-bus';
import { DeviceTokenCredentials } from '@azure/ms-rest-nodeauth';
import { SBQueue } from '@azure/arm-servicebus/esm/models';

const subscriptionId: string = config.get('azure.subscriptionId');
const resourceGroup: string = config.get('azure.resourceGroup');
const namespace: string = config.get('azure.namespace');
const authorizationRuleName: string = config.get('serviceBus.userName');

export async function listNamespaces(creds: DeviceTokenCredentials) {
    const client = new ServiceBusManagementClient(creds, subscriptionId);
    client.namespaces.list().then(namespaces => {
        namespaces.map(ns => {
            console.log(`found ns : ${ns.name}`);
        });
    });
}

export async function readFirstMessage(creds: DeviceTokenCredentials) {
    const client = new ServiceBusManagementClient(creds, subscriptionId);
    const namespacesListKeys = await client.namespaces.listKeys(resourceGroup, namespace, authorizationRuleName);
    const connectionString = namespacesListKeys.primaryConnectionString;
    const serviceBusClient = ServiceBusClient.createFromConnectionString(connectionString!);
    const queueClient = serviceBusClient.createQueueClient('sandbox');
    const peekedMessage = await queueClient.peek();
    return peekedMessage[0];
}

export async function getQueueDetails(creds: DeviceTokenCredentials, queueName: string): Promise<SBQueue> {
    const client = new ServiceBusManagementClient(creds, subscriptionId);
    const queues = await client.queues.listByNamespace(resourceGroup, namespace);
    const goodQueue = queues.filter(queue => queue.name === queueName);
    return goodQueue[0];
}
