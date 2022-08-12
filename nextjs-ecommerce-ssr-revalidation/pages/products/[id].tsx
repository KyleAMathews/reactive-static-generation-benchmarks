import got from "got"

export async function getStaticPaths() {
  const url = `https://reactive-static-generation-benchmarks-kyleamathews.chiselstrike.io/main/product\?sort\=productId`
  const res = await got(url, { responseType: `json` })
  const body = res.body
  const paths = body.results.map((product) => {
    return {
      params: {
        id: product.productId.toString(),
      },
    }
  })
  return {
    paths: paths,
    fallback: false, // can also be true or 'blocking'
  }
}

// `getStaticPaths` requires using `getStaticProps`
export async function getStaticProps(context) {
  const url = `https://reactive-static-generation-benchmarks-kyleamathews.chiselstrike.io/main/product?.productId=${context.params.id}&page_size=5000`
  const res = await got(url, { responseType: `json` })
  const body = res.body
  return {
    // Passed to the page component as props
    props: { product: body.results[0] },
  }
}

export default function Product(props) {
  return (
    <div>
      <h1>{props.product.productId}</h1>
      <p>
        Inventory is:{` `}
        <span id="inventory-level">{props.product.inventoryLevel}</span>
      </p>
    </div>
  )
}
