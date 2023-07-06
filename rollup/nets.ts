import { net } from "capi/nets"

export const westend = net.ws({
  url: "wss://westend-rpc.polkadot.io/",
  version: "v0.9.42",
})

export const polkadot = net.ws({
  url: "wss://rpc.polkadot.io/",
  version: "v0.9.42",
  targets: { dev: westend },
})
