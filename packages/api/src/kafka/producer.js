const {Kafka} = require('kafkajs');

const kafka = new Kafka({
    clientId: 'telemetry-api',
    brokers: [process.env.KAFKA_BROKERS || 'localhost:9092']
})

const producer = kafka.producer();

async function connectProducer() {
    await producer.connect();
}

async function publishEvent(topic,payload) {
    await producer.send({
        topic: topic,
        messages: [{value: JSON.stringify(payload)}]
    });
}

async function disconnectProducer() {
    await producer.disconnect();
}

module.exports = {connectProducer,publishEvent,disconnectProducer}