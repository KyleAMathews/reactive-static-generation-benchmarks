import { ChiselRequest, responseFromJson } from "@chiselstrike/api"
import { Product } from "../models/product"

export default async function chisel(req: ChiselRequest): Promise<Return> {
  if (req.method == "POST") {
    for (let i = 0; i < 5000; i++) {
      console.log(
        await Product.create({
          productId: i,
          inventoryLevel: Math.floor(Math.random() * 200),
        })
      )
    }

    return new Response("cool", { status: 200 })
  }
}
