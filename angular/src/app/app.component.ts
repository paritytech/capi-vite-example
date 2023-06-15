import { Component } from "@angular/core"
import { westend } from "@capi/westend"
import { signature } from "capi/patterns/signature/polkadot"

import { User } from "./user"
import { Web3Service } from "./web3.service"

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "capi-angular-example"

  alexaIndex: number = -1
  billyIndex: number = -1
  amount: bigint = 0n
  users: User[] = []

  constructor(private readonly web3Service: Web3Service) {}

  ngOnInit() {
    this.web3Service.users().then((users) => this.users = users)
  }

  async transfer() {
    const alexa = this.users[this.alexaIndex]
    const billy = this.users[this.billyIndex]
    const amount = BigInt(this.amount)

    // Reference Billy's free balance.
    const billyFree = westend.System.Account.value(billy.publicKey)
      .unhandle(undefined)
      .access("data", "free")

    // Read the initial free.
    const initialFree = await billyFree.run()
    console.log("Billy free initial:", initialFree)

    // Create and submit the transaction.
    await westend.Balances.transferAllowDeath({
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
}
