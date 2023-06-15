import { MultiAddress, westend } from "@capi/westend"
import { web3FromSource } from "@polkadot/extension-dapp"
import { ss58 } from "capi"
import { pjsSender } from "capi/patterns/compat/pjs_sender"

export class User {
  publicKey
  address
  sender
  constructor(
    web3Source: Awaited<ReturnType<typeof web3FromSource>>,
    readonly ss58Address: string,
    readonly name: string,
  ) {
    const sender = pjsSender(
      westend,
      web3Source.signer as any,
    )

    this.publicKey = ss58.decode(this.ss58Address)[1]
    this.address = MultiAddress.Id(this.publicKey)
    this.sender = sender(this.ss58Address)
  }
}
