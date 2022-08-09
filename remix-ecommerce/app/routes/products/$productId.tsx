import type { LoaderFunction, HeadersFunction } from "@remix-run/node" // or cloudflare/deno
import got from "got"
import { json } from "@remix-run/node" // or cloudflare/deno
import { useLoaderData } from "@remix-run/react"

export let headers: HeadersFunction = () => {
  return {
    "Cache-Control": "public, max-age=0, must-revalidate",
    "Surrogate-Control": "max-age=300, stale-while-revalidate=60",
  }
}

export const loader: LoaderFunction = async ({ params }) => {
  console.log({ params })
  const url = `https://reactive-static-generation-benchmarks-kyleamathews.chiselstrike.io/main/product?.productId=${params.productId}`
  console.log({ url })
  const res = await got(url, { responseType: `json` })
  const body = res.body
  console.log(body)
  return json({
    props: { product: body.results[0] },
  })
}

export default function Products() {
  const data = useLoaderData()
  console.log({ data })
  return (
    <div>
      <h1>{data.props.product.productId}</h1>
      <p>
        Inventory is:{` `}
        <span id="inventory-level">{data.props.product.inventoryLevel}</span>
      </p>
    </div>
  )
}
