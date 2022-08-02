import * as React from "react"
import { graphql } from "gatsby"

export default function Product(props) {
  return <div>
  <h1>{props.data.product.id}</h1>
  <p>Inventory is: {props.data.product.inventoryLevel}</p>
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
