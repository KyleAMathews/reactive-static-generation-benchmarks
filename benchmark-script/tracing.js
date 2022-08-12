const { NodeSDK } = require("@opentelemetry/sdk-node");
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-proto");
const opentelemetry = require('@opentelemetry/api');

// The Trace Exporter exports the data to Honeycomb and uses
// the environment variables for endpoint, service name, and API Key.
const traceExporter = new OTLPTraceExporter();

const sdk = new NodeSDK({
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()]
});

const _waitReady = new Promise((resolve, reject) => {
  _resolveWaitReady = resolve
  _rejectWaitReady = reject
})

sdk &&
  sdk
    .start()
    .then(() => {
      _resolveWaitReady()
      console.log(`Tracing initialized`)
    })
    .catch(error => {
      _rejectWaitReady(error)
      console.log(`Error initializing tracing`, error)
    })



// This is what we'll access in all instrumentation code
const tracer = opentelemetry.trace.getTracer(
  'benchmark'
);

async function waitReady() {
  if (sdk) {
    await _waitReady
  }
}

async function shutdown() {
  if (!sdk) {
    console.log(`Tracing not configured`)
    return
  }

  try {
    await sdk.shutdown()
    console.log(`Tracing terminated`)
  } catch (error) {
    console.error(`Error terminating tracing`, { error })
  }
}

exports.waitReady = waitReady
exports.shutdown = shutdown
exports.tracer = tracer
