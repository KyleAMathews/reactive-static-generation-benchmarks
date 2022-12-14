import type { LoaderFunction, HeadersFunction } from "@remix-run/node" // or cloudflare/deno
import got from "got"
import { json } from "@remix-run/node" // or cloudflare/deno
import { useLoaderData } from "@remix-run/react"

export let headers: HeadersFunction = () => {
  return {
    "Cache-Control": "public, max-age=0, must-revalidate",
    "Surrogate-Control":
      "max-age=20, stale-while-revalidate=20, stale-if-error=600",
  }
}

export const loader: LoaderFunction = async ({ params }) => {
  const url = `https://reactive-static-generation-benchmarks-kyleamathews.chiselstrike.io/main/product?.productId=${params.productId}`
  const res = await got(url, { responseType: `json` })
  const body = res.body
  return json({
    props: { product: body.results[0] },
  })
}

export default function Products() {
  const data = useLoaderData()
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
