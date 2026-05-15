const {z} = require('zod');

const TelemetrySchema = z.object({
    timestamp: z.string().datetime(),
    service: z.enum(['auth','gateway','orders','payments','inventory','notifications']),
    region: z.enum(['us-east-1', 'us-west-2', 'eu-central-1', 'ap-southeast-1']),
    cpu_usage: z.number().min(0).max(100),
    memory_mb: z.number().int().positive(),
    latency_ms: z.number().int().nonnegative(),
    status_code: z.number().min(100).max(599),
    error: z.boolean(),
    request_id: z.string()
})

module.exports = {TelemetrySchema};