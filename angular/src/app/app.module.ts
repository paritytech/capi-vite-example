import { APP_INITIALIZER, NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"

import { FormsModule } from "@angular/forms"
import { web3Enable } from "@polkadot/extension-dapp"
import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component"
import { Web3Service } from "./web3.service"

async function initializeApp() {
  await web3Enable("capi-next-example")
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
  ],

  providers: [Web3Service, {
    provide: APP_INITIALIZER,
    useFactory: () => initializeApp,
    multi: true,
  }],
  bootstrap: [AppComponent],
})
export class AppModule {}
