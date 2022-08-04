import { ChiselEntity } from "@chiselstrike/api"

export class Product extends ChiselEntity {
    productId: number = 0;
    inventoryLevel: number = 0;
}
