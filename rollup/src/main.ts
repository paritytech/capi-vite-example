import "./style.css"
import "./console.js"

import { MultiAddress, Westend, westend } from "@capi/westend"
/* import { westendDev } from "@capi/westend-dev" */
import { web3Accounts, web3Enable, web3FromSource } from "@polkadot/extension-dapp"
import { createDevUsers, ExtrinsicSender, is, Rune, RunicArgs, ss58 } from "capi"
import { pjsSender } from "capi/patterns/compat/pjs_sender"
import { signature } from "capi/patterns/signature/polkadot"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function main() {
  // TODO: remove delay because there is a race condition when trying to find
  // the polkadot-js web extension and waiting it to load in the browser.
  await delay(1000)
  await web3Enable("capi-parcel-example")
  const sender = pjsSender(westend, (await web3FromSource("polkadot-js")).signer as any)

  class User {
    publicKey
    address
    sender
    constructor(readonly ss58Address: string, readonly name: string) {
      this.publicKey = ss58.decode(this.ss58Address)[1]
      this.address = MultiAddress.Id(this.publicKey)
      this.sender = sender(this.ss58Address)
    }
  }

  const users = (await web3Accounts()).map((account, i) =>
    new User(account.address, account.meta.name ?? `Account ${i}`)
  )

  const alexaDropdown = document.getElementById("alexa") as HTMLSelectElement
  const billyDropdown = document.getElementById("billy") as HTMLSelectElement
  const amountInput = document.getElementById("amount") as HTMLInputElement
  const submitButton = document.getElementById("submit") as HTMLButtonElement

  populateUserDropdown(alexaDropdown)
  populateUserDropdown(billyDropdown)
  submitButton.addEventListener("click", () => {
    process.env.CAPI_TARGET === "dev"
      ? transferDev(BigInt(amountInput.value))
      : transfer(
        users[+alexaDropdown.value].sender,
        users[+billyDropdown.value].address,
        BigInt(amountInput.value),
      )
  })

  function populateUserDropdown(select: Element) {
    for (const [i, user] of users.entries()) {
      const option = document.createElement("option")
      option.setAttribute("value", `${i}`)
      option.text = user.name
      select.appendChild(option)
    }
    return select
  }

  async function transfer<X>(
    ...args: RunicArgs<X, [alexa: ExtrinsicSender<Westend>, billy: MultiAddress, amount: bigint]>
  ) {
    const alexa = Rune.resolve(args[0])
    const billy = Rune.resolve(args[1])
    const amount = Rune.resolve(args[2])
    // Reference Billy's free balance.
    const billyFree = westend.System.Account
      .value(billy.access("value").unhandle(is(null)))
      .unhandle(is(undefined))
      .access("data", "free")

    // Read the initial free.
    const initialFree = await billyFree.run()
    console.log("Billy free initial:", initialFree)

    // Create and submit the transaction.
    await westend.Balances
      .transferAllowDeath({
        value: amount,
        dest: billy,
      })
      .signed(signature({ sender: alexa }))
      .sent()
      .dbgStatus("Transfer:")
      .finalized()
      .run()

    // Read the final free.
    const finalFree = await billyFree.run()
    console.log("Billy free final:", finalFree)
  }

  async function transferDev(amount: bigint) {
    console.log("transfer dev")
    const { alexa, billy } = await createDevUsers()

    // Reference Billy's free balance.
    const billyFree = westend.System.Account
      .value(billy.publicKey)
      .unhandle(is(undefined))
      .access("data", "free")

    // Read the initial free.
    const initialFree = await billyFree.run()
    console.log("Billy free initial:", initialFree)

    // Create and submit the transaction.
    await westend.Balances
      .transferAllowDeath({
        value: amount,
        dest: billy.address,
      })
      .signed(signature({ sender: alexa }))
      .sent()
      .dbgStatus("Transfer:")
      .finalized()
      .run()

    // Read the final free.
    const finalFree = await billyFree.run()
    console.log("Billy free final:", finalFree)
  }
}

;(async function() {
  await main()
})()
