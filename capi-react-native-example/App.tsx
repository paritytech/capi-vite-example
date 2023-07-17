import { MultiAddress, Westend, westend } from "@capi/westend"
/* import { web3Accounts, web3Enable, web3FromSource } from "@polkadot/extension-dapp"
import { pjsSender } from "capi/patterns/compat/pjs_sender" */
import { StatusBar } from "expo-status-bar"
import { useEffect } from "react"
import { StyleSheet, Text, View } from "react-native"

export default function App() {
  useEffect(() => {
    ;(async () => {
      /*  await web3Enable("capi-react-native-example")
      const sender = pjsSender(westend, (await web3FromSource("polkadot-js")).signer as any) */

      const headerIter = westend.connection
        .subscribe("chain_subscribeFinalizedHeads", "chain_unsubscribeAllHeads")
        .iter()

      let i = 0

      /// Iterate over its items and ensure they conform to the expected shape.
      for await (const header of headerIter) {
        console.log(header)
        i += 1
        if (i === 3) break
      }
    })()
  }, [])

  return (
    <View style={styles.container}>
      <Text>Open the web console to see Capi logs.</Text>
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
})
