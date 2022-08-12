import { Product } from "../models/product"
export default async function chisel(req: ChiselRequest): Promise<Return> {
  console.log(req)
  // Find by productId and update w/ inventoryLevel
  const payload = await req.json()
  console.log(payload)
  const product = await Product.findOne({ productId: payload.productId })
  if (product) {
    product.inventoryLevel = payload.inventoryLevel
    console.log(product)
    return product.save()
  } else {
    return new Response(`Not found`, { status: 404 })
  }
}
