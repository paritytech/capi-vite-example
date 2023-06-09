import { MultiAddress, westend } from "@capi/westend";
import { web3FromSource } from "@polkadot/extension-dapp";
import { ss58 } from "capi";
import { pjsSender } from "capi/patterns/compat/pjs_sender";

const sender = pjsSender(
  westend,
  (await web3FromSource("polkadot-js")).signer as any
);

export class User {
  publicKey;
  address;
  sender;
  constructor(readonly ss58Address: string, readonly name: string) {
    this.publicKey = ss58.decode(this.ss58Address)[1];
    this.address = MultiAddress.Id(this.publicKey);
    this.sender = sender(this.ss58Address);
  }
}
