const {InfluxDB,Point} = require('@influxdata/influxdb-client')

//create client
const client = new InfluxDB({url:process.env.INFLUX_URL ,token:process.env.INFLUX_TOKEN});

const writeApi = client.getWriteApi(process.env.INFLUX_ORG,process.env.INFLUX_BUCKET,'ms')

async function writePoint(payload){
    try{
        // build a point
        const point = new Point('telemetry')
        .tag('service',payload.service)
        .tag('region',payload.region)
        .tag('status_code',payload.status_code.toString())
        .tag('error',payload.error.toString())
        .floatField('cpu_usage',payload.cpu_usage)
        .intField('memory_mb',payload.memory_mb)
        .intField('latency_ms',payload.latency_ms)
        .timestamp(new Date(payload.timestamp))
        // write it
        writeApi.writePoint(point)
        await writeApi.flush()
        console.log('Point written to InfluxDB successfully')
    }
    catch(err){
        console.error('Failed to write point to InfluxDB:',err.message)
    }
}

module.exports = {writePoint}
