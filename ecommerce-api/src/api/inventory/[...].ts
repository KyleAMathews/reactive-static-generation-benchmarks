import { GatsbyFunctionRequest, GatsbyFunctionResponse } from "gatsby"
import _ from "lodash"

const inventory = _.range(20000).map(() => Math.floor(Math.random() * 200))

function getInventoryByProduct(id) {
  return inventory[id]
}

export default function handler(
  req: GatsbyFunctionRequest,
  res: GatsbyFunctionResponse
) {
  const params = req.params[`*`].split(`/`)

  if (req.method === `GET`) {
    // Return inventory for a product.
    if (params.length == 1) {
      const productId = parseInt(params[0]) - 1
      if (productId > 19999 || productId < 0) {
        res.status(404).send(`Not found`)
      } else {
        res.send({
          params: params,
          inventoryLevel: getInventoryByProduct(productId),
        })
      }
      // Return range of products.
    } else if (params.length === 2) {
      const start = parseInt(params[0]) - 1
      const stop = parseInt(params[1]) - 1
      return res.send(inventory.slice(start, stop))
    }
  } else if (req.method === `POST`) {
    if (req.body?.inventoryLevel && req.body?.id) {
      inventory[req.body.id - 1] = req.body.inventoryLevel
      return res.send(`ok`)
    } else {
      return res.status(400).send(`bad request`)
    }
  }
}
