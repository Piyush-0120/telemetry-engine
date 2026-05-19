//imports
// load environment variables from .env file for all files ;
const path = require('path')
require('dotenv').config({path: path.join(__dirname, '../../../.env')})

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomInt(min,max){
  return Math.floor(Math.random() * (max - min) + min)
}

function buildPayload(){
  const status_code=pick([200,200,200,201,400,500]);
    return {
        timestamp: new Date().toISOString(),
        service: pick(['auth','gateway','orders','payments','inventory','notifications']),
        region: pick(['us-east-1', 'us-west-2', 'eu-central-1', 'ap-southeast-1']),
        cpu_usage: Math.random() * 100,
        memory_mb: randomInt(128, 2048),
        latency_ms: randomInt(10, 50),
        status_code,
        error: status_code>=500,
        request_id:`req-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
    }
}

// send the POST request
async function sendPayload(){
  const payload = buildPayload();
  try{
    const response = await fetch(`${process.env.TARGET_URL}/ingest`,{
      method:'POST',
      headers: {
        'Content-Type' : 'application/json',
        'x-api-key' : process.env.API_KEY
      },
      body : JSON.stringify(payload)
    });
    if(response.status===202){
      console.log('sent:',payload.request_id)
    }
    else{
      throw new Error(`Response status: ${response.status}`);
    }
  }
  catch(error){
    console.error(error.message)
  }
}

// 50 requests per second = 1 request every (1000ms / 50) = 20ms
const RATE = parseInt(process.env.RATE || '50')
const INTERVAL = Math.floor(1000 / RATE) // gap between each request in milliseconds

console.log(`Generator starting — ${RATE} req/s`)
setInterval(sendPayload, INTERVAL) // fires sendPayload every 20ms = 50 req/s


// disconnecting the processor when Ctrl+C is pressed
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...')
  
  process.exit(0)
});