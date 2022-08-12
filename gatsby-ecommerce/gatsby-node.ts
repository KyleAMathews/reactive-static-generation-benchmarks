import type { GatsbyNode } from "gatsby"
import path from "path"
import got from "got"

type webhookBodyType = {
  id: number
  inventoryLevel: number
}

const API = process.env.API || `http://localhost:8002/api`

export const sourceNodes: GatsbyNode[`sourceNodes`] = async ({
  actions,
  webhookBody,
}) => {
  const body = webhookBody as webhookBodyType
  const { createNode } = actions

  // Handle webhook if one, otherwise fetch all data.
  if (body.inventoryLevel && body.id) {
    const node = {
      id: body.id.toString(),
      inventoryLevel: body.inventoryLevel,
      internal: {
        type: `Product`,
        contentDigest: `${body.id} ${body.inventoryLevel}`,
      },
    }

    createNode(node)
  } else {
    const url = `https://reactive-static-generation-benchmarks-kyleamathews.chiselstrike.io/main/product\?sort\=productId&page_size=5000`
    const res = await got(url, { responseType: `json` })
    const body = res.body
    body.results.forEach(({ inventoryLevel, productId }) => {
      const node = {
        id: productId.toString(),
        inventoryLevel,
        internal: {
          type: `Product`,
          contentDigest: `${productId} ${inventoryLevel}`,
        },
      }

      createNode(node)
    })
  }
}
