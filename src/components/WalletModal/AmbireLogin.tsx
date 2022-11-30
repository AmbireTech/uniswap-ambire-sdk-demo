import AMBIRE_ICON_URL from 'assets/images/ambire.png'
import { useEffect, useState } from 'react'

import Option from './Option'

const BASE_PROPS = {
  color: '#4196FC',
  icon: AMBIRE_ICON_URL,
  id: 'ambire-login',
}

interface AmbireSDK {
  openLogin: any
}

export function AmbireLogin() {
  const [sdk, setSdk] = useState<AmbireSDK | null>(null)

  useEffect(() => {
    if (window.AmbireSDK) {
      const ambireSDK = new window.AmbireSDK({
        walletUrl: 'http://localhost:3000',
        dappName: 'dapp1',
        chainID: 1,
        iframeElementId: 'ambire-sdk-iframe',
      })
      ambireSDK.onLoginSuccess((address: string) => {
        console.log(address)
      })
      setSdk(ambireSDK)
    }
  }, [])

  const tryActivation = () => {
    if (sdk) sdk.openLogin()
  }

  return <Option {...BASE_PROPS} isActive={true} onClick={() => tryActivation()} header="Email Login" />
}
