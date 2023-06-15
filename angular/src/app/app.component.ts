import { Component } from "@angular/core"
import { web3Accounts, web3Enable, web3FromSource } from "@polkadot/extension-dapp"

import { User } from "./user"
import { Web3Service } from "./web3.service"

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "capi-angular-example"

  users: Promise<User[]> | null = null

  constructor(private readonly web3Service: Web3Service) {}

  ngOnInit() {
    this.users = this.web3Service.users()
  }
}
