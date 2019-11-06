import config from "config";
import {ServiceBusManagementClient} from "@azure/arm-servicebus";

export async function doSomethingWithCreds(creds) {
    const subscriptionId = config.get('azure.subscriptionId');
    const client = new ServiceBusManagementClient(creds, subscriptionId);
    client.namespaces.list().then(namespaces => {
        namespaces.map(ns => {
            console.log(`found ns : ${ns.name}`);
        });
    });
}