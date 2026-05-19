const {Kafka} = require('kafkajs');

const kafka = new Kafka({
    clientId: 'telemetry-processor',
    brokers: [process.env.KAFKA_BROKERS || 'localhost:9092']
})

const consumer = kafka.consumer({groupId: process.env.KAFKA_GROUP_ID});

async function startConsumer(topic, onMessage) {
  await consumer.connect()
  await consumer.subscribe({ topic, fromBeginning: false })

  await consumer.run({
    eachMessage: async ({ message }) => {
      const payload = JSON.parse(message.value.toString())
      await onMessage(payload)
    }
  })
}

async function disconnectConsumer() {
  await consumer.disconnect()
}

module.exports = { startConsumer, disconnectConsumer }
