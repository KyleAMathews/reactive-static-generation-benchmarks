import { Product } from "../models/product"
export default async function() : Promise<Array<Product>> {
  return Product.findAll()
}
