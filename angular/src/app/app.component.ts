import { Component } from "@angular/core"
import { web3Accounts, web3Enable, web3FromSource } from "@polkadot/extension-dapp"
import { User } from "common"

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "capi-angular-example"

  async ngOnInit() {
    await web3Enable("capi-next-example")
    const web3Source = await web3FromSource("polkadot-js")
    const accounts = await web3Accounts()

    const users = accounts.map(
      (account, i) => new User(account.address, account.meta.name ?? `Account ${i}`),
    )

    console.log("hello world", users)
  }
}
