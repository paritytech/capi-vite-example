import "./style.css"
import "./console.js"

import { Balances, chain, MultiAddress, System } from "@capi/westend"
import { web3Accounts, web3Enable, web3FromSource } from "@polkadot/extension-dapp"
import { ss58 } from "capi"
import { pjsSender } from "capi/patterns/compat/pjs_sender"
import { signature } from "capi/patterns/signature/polkadot"

const extensions = await web3Enable("capi-vite-example")
const sender = pjsSender(chain, (await web3FromSource("polkadot-js")).signer as any)

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
  transfer(users[+alexaDropdown.value], users[+billyDropdown.value], BigInt(amountInput.value))
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

async function transfer(alexa: User, billy: User, amount: bigint) {
  // Reference Billy's free balance.
  const billyFree = System.Account
    .value(billy.publicKey)
    .unhandle(undefined)
    .access("data", "free")

  // Read the initial free.
  const initialFree = await billyFree.run()
  console.log("Billy free initial:", initialFree)

  // Create and submit the transaction.
  await Balances
    .transfer({
      value: amount,
      dest: billy.address,
    })
    .signed(signature({ sender: alexa.sender }))
    .sent()
    .dbgStatus("Transfer:")
    .finalized()
    .run()

  // Read the final free.
  const finalFree = await billyFree.run()
  console.log("Billy free final:", finalFree)
}
