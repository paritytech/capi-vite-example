import { Injectable } from "@angular/core"
import { web3Accounts, web3Enable, web3FromSource } from "@polkadot/extension-dapp"
import { User } from "./user"

@Injectable({
  providedIn: "root",
})
export class Web3Service {
  constructor() {}

  async users() {
    const web3Source = await web3FromSource("polkadot-js")
    const accounts = await web3Accounts()

    const users = accounts.map(
      (account, i) => new User(web3Source, account.address, account.meta.name ?? `Account ${i}`),
    )

    return users
  }
}
