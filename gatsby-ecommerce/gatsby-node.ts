import type { GatsbyNode } from "gatsby"
import path from "path"
import got from "got"

type webhookBodyType = {
  id: number
  inventoryLevel: number
}

const PRODUCT_COUNT = process.env.PRODUCT_COUNT || 1000
const API = process.env.API || `http://localhost:8002/api`

export const sourceNodes: GatsbyNode[`sourceNodes`] = async ({
  actions,
  webhookBody,
  createContentDigest,
}) => {
  const body = webhookBody as webhookBodyType
  const { createNode } = actions

  console.log({ body })
  // Handle webhook if one, otherwise fetch all data.
  if (body.inventoryLevel && body.id) {
      const node = {
        id: body.id.toString(),
        inventoryLevel: body.inventoryLevel,
        internal: {
          type: `Product`,
          contentDigest: `${body.id} ${body.inventoryLevel}`,
        }
      }

      createNode(node)
  } else {
    const res = await got(`${API}/inventory/1/${PRODUCT_COUNT}`,{ responseType: `json`})
      const body = res.body
    body.forEach((inventoryLevel, i) => {
      const node = {
        id: i.toString(),
        inventoryLevel,
        internal: {
          type: `Product`,
          contentDigest: `${i} ${inventoryLevel}`,
        }
      }

      createNode(node)
    })
  }

}
