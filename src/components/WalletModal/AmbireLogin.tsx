import { Connector } from '@web3-react/types'
import AMBIRE_ICON_URL from 'assets/images/ambire.png'
import { ambireConnection } from 'connection'

import Option from './Option'

const BASE_PROPS = {
  color: '#4196FC',
  icon: AMBIRE_ICON_URL,
  id: 'ambire-login',
}

export function AmbireLogin({ tryActivation }: { tryActivation: (connector: Connector) => void }) {
  return (
    <Option
      {...BASE_PROPS}
      isActive={false}
      onClick={() => tryActivation(ambireConnection.connector)}
      header="Email Login"
      subheader="powered by Ambire"
      isAmbire
    />
  )
}
