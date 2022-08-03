import * as React from "react"
import { graphql } from "gatsby"

export default function Product(props) {
  return <div>
  <h1>{props.data.product.id}</h1>
  <p>Inventory is: <span id="inventory-level">{props.data.product.inventoryLevel}</span></p>
  </div>
}

export const query = graphql`
  query ($id: String) {
    product(id: { eq: $id }) {
      id
      inventoryLevel
    }
  }
`
