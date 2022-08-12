// Takes as arguments:
// - list of workers
// - honeycomb setup
// - webhook to trigger a build & page url to read
import got from "got"
import { parse } from "node-html-parser"
const { tracer, waitReady, shutdown } = require(`./tracing`)

if (
  !process.env.SERVICE_NAME ||
  !process.env.CACHE_MODE ||
  !process.env.BENCHMARK_NAME
) {
  throw new Error(`missiing env vars`)
}

async function checkIfDeployed({
  span,
  startTime,
  inventoryLevel,
  checkCount,
}) {
  // const pageURL = `https://reactivestaticgenerationbenchm.gatsbyjs.io/products/344/`
  // const pageURL = `https://reactivestaticgenerationbenchm.staging-gatsbyjs.io//products/344/`
  // const pageURL = `https://fanciful-lily-8c13d3.netlify.app/products/344/`
  // Next.s local
  // const pageURL = `http://localhost:3000/products/344`
  // Next.js prod
  // Vercel on-demand isr
  // const pageURL = `https://reactive-static-generation-benchmarks.vercel.app/products/344`
  // Remix local
  // const pageURL = `http://localhost:3000/products/344`
  // Remix prod soft purge
  // const pageURL = `https://remix-ecommerce.global.ssl.fastly.net/products/344`
  // Remix prod ttl
  // const pageURL = `https://remix-ecommerce.global.ssl.fastly.net/products-ttl/344`
  checkCount += 1

  let response
  try {
    response = await got(pageURL, { cache: false })
  } catch (e) {
    console.log(e)
    // Ignore 404 errors and just return
    return { statusCode: e.response.statusCode }
  }

  const root = parse(response.body)

  const value = root.querySelector(`#inventory-level`)?.rawText
  if (value == inventoryLevel.toString()) {
    const end = Date.now()
    console.log(`got it in ${checkCount}`, new Date().toJSON(), end - startTime)
    span.end()
    checkCount = 0
    return
  } else {
    if (checkCount % 100 === 0) {
      console.log({
        checkCount,
        value,
        inventoryLevel,
        statusCode: response.statusCode,
      })
    }
    await new Promise((resolve) => setTimeout(resolve, 5))
    return checkIfDeployed({ span, startTime, inventoryLevel, checkCount })
  }
}

// Vercel On demand revalidation
function pingVercel() {
  got.post({
    url: `https://reactive-static-generation-benchmarks.vercel.app/api/revalidate`,
    json: {
      productId: 344,
    },
  })
}

async function main() {
  await waitReady()
  for (let i = 115; i >= 0; i--) {
    const inventoryLevel = i
    // Update db.
    await got.post({
      url: `https://reactive-static-generation-benchmarks-kyleamathews.chiselstrike.io/main/updated-product`,
      json: {
        productId: 344,
        inventoryLevel,
      },
    })
    // Netlify
    // got.post({
    // url: `https://api.netlify.com/build_hooks/62ebe7f7b6e86b288f3822d7`,
    // })
    // Gatsby Cloud
    // got.post({
    // // Prod
    // url: `https://webhook.gatsbyjs.com/hooks/data_source/publish/72ba8ee8-f798-4149-a713-f64bba29d87f`,
    // // staging
    // // url: `https://webhook.staging.gtsb.io/hooks/data_source/publish/96dae40a-578e-4018-9c95-022da6c2fac6`,
    // json: {
    // id: 344,
    // inventoryLevel: inventoryLevel,
    // },
    // headers: {
    // "x-gatsby-cloud-data-source": `default-site-plugin`,
    // "x-gatsby-cloud-body-not-stateful": `true`,
    // },
    // })
    pingVercel()
    // Remix/Fastly soft purge
    // got({
    // // @ts-ignore
    // method: `PURGE`,
    // url: `https://remix-ecommerce.global.ssl.fastly.net/products/344`,
    // headers: {
    // "Fastly-Soft-Purge": `1`,
    // },
    // })
    await tracer.startActiveSpan(`check-until-deployed`, async (span) => {
      span.setAttribute(`service`, process.env.SERVICE_NAME)
      span.setAttribute(`cacheMode`, process.env.CACHE_MODE)
      span.setAttribute(`benchmarkName`, process.env.BENCHMARK_NAME)
      const startTime = Date.now()
      // For Vercel
      let finished = false
      let timeout
      if (process.env.SERVICE_NAME === `vercel`) {
        console.log(`adding timeout`)
        timeout = setTimeout(() => {
          if (!finished) {
            pingVercel()
          }
        }, 5000)
      }
      await checkIfDeployed({ span, startTime, inventoryLevel, checkCount: 0 })
      finished = true
      clearTimeout(timeout)
    })
  }
  await shutdown()
}

main()
