## The processor has one job — read messages from Kafka and write them to InfluxDB.

 - consumer.js   → reads messages from Kafka topic
 - writer.js     → writes data points to InfluxDB
 - index.js      → wires them together