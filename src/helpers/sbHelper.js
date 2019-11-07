import config from "config";
import {ServiceBusManagementClient} from "@azure/arm-servicebus";
import {ServiceBusClient} from "@azure/service-bus";

export async function listNamespaces(creds) {
    const subscriptionId = config.get('azure.subscriptionId');
    const client = new ServiceBusManagementClient(creds, subscriptionId);
    client.namespaces.list().then(namespaces => {
        namespaces.map(ns => {
            console.log(`found ns : ${ns.name}`);
        });
    });
}

export async function readFirstMessage(creds) {
    const subscriptionId = config.get('azure.subscriptionId');
    const resourceGroup = config.get('azure.resourceGroup');
    const namespace = config.get('azure.namespace');
    const authorizationRuleName = config.get('serviceBus.userName');
    const client = new ServiceBusManagementClient(creds, subscriptionId);
    const namespacesListKeys = await client.namespaces.listKeys(resourceGroup, namespace, authorizationRuleName);
    const connectionString = namespacesListKeys.primaryConnectionString;
    const serviceBusClient = ServiceBusClient.createFromConnectionString(connectionString);
    const queueClient = serviceBusClient.createQueueClient("sandbox");
    const peekedMessage = await queueClient.peek();
    return peekedMessage[0];
}

export async function getQueueDetails(creds, queueName) {
    const resourceGroup = config.get('azure.resourceGroup');
    const namespace = config.get('azure.namespace');
    const subscriptionId = config.get('azure.subscriptionId');
    const client = new ServiceBusManagementClient(creds, subscriptionId);
    const queues = await client.queues.listByNamespace(resourceGroup, namespace);
    const goodQueue = queues.filter(queue => queue.name === queueName);
    return goodQueue[0];
}