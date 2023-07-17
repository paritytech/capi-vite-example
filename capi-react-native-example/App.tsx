import { MultiAddress, Westend, westend } from "@capi/westend"
import { web3Accounts, web3Enable, web3FromSource } from "@polkadot/extension-dapp"
import { pjsSender } from "capi/patterns/compat/pjs_sender"
import { StatusBar } from "expo-status-bar"
import { useEffect } from "react"
import { StyleSheet, Text, View } from "react-native"

export default function App() {
  useEffect(() => {
    ;(async () => {
      await web3Enable("capi-react-native-example")
      const sender = pjsSender(westend, (await web3FromSource("polkadot-js")).signer as any)
    })()
  }, [])

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
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
