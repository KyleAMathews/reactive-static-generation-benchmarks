import { ChiselEntity, unique } from "@chiselstrike/api"

export class Product extends ChiselEntity {
  @unique productId: number = 0
  inventoryLevel: number = 0
}
