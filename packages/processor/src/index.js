//imports
// load environment variables from .env file for all files 
const path = require('path');
require('dotenv').config({path: path.join(__dirname, '../../../.env')});

const {startConsumer,disconnectConsumer} = require('./kafka/consumer');
const {writePoint} = require('./influx/writer');

async function start() {
  await startConsumer(process.env.KAFKA_TOPIC, async (payload) => {
    await writePoint(payload)
  })
  console.log('Processor started — listening for messages...')
}
start()

// disconnecting the processor when Ctrl+C is pressed
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...')
  await disconnectConsumer()
  process.exit(0)
});