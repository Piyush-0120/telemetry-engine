//imports
// load environment variables from .env file for all files 
const path = require('path');
require('dotenv').config({path: path.join(__dirname, '../../../.env')});

const express = require('express');
const authMiddleware = require('./middleware/auth');
const {TelemetrySchema} = require('./schema/telemetry');
const {connectProducer,publishEvent,disconnectProducer} = require('./kafka/producer');
const { error } = require('console');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: "ok" });
});


app.post('/ingest', authMiddleware,async (req, res) => {
  // validate the payload shape
  const result = TelemetrySchema.safeParse(req.body);
  if(!result.success){
    return res.status(400).json({error: result.error});
  }
  // if validation passes then publish to kafka, passing result.data because Zod cleans and validates the data so it is the safe version.
  try{
    await publishEvent(process.env.KAFKA_TOPIC,result.data);
    return res.status(202).json({ status: "ingest ok" }); 
  } catch (err){
    console.error('[Kafka] Failed to publish:',err.message);
    return res.status(500).json({ error: "Failed to publish event" });
  }
});


//connect producer when server starts
app.listen(3000, async () => {
  await connectProducer();
  console.log('API server listening on port 3000');
});

// disconnecting the poducer when Ctrl+C is pressed
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...')
  await disconnectProducer()
  process.exit(0)
});