import { MultiAddress, Westend, westend } from "@capi/westend"

import "./style.css"
import "./console.js"

async function main() {
  const headerIter = westend.connection
    .subscribe("chain_subscribeFinalizedHeads", "chain_unsubscribeAllHeads")
    .iter()

  for await (const header of headerIter) {
    console.log(header)
  }
}

;(async function() {
  await main()
})()
