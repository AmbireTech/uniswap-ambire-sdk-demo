import { Networkish } from '@ethersproject/networks'
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'
import { ConnectionInfo } from '@ethersproject/web'
import { poll } from '@ethersproject/web'
import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { initializeConnector, Web3ReactHooks } from '@web3-react/core'
import { GnosisSafe } from '@web3-react/gnosis-safe'
import { MetaMask } from '@web3-react/metamask'
import { Network } from '@web3-react/network'
import type {} from '@web3-react/types'
import { Connector } from '@web3-react/types'
import { WalletConnect } from '@web3-react/walletconnect'
import { SupportedChainId } from 'constants/chains'

import UNISWAP_LOGO_URL from '../assets/svg/logo.svg'
import { RPC_URLS } from '../constants/networks'
import { RPC_PROVIDERS } from '../constants/providers'

export enum ConnectionType {
  INJECTED = 'INJECTED',
  COINBASE_WALLET = 'COINBASE_WALLET',
  WALLET_CONNECT = 'WALLET_CONNECT',
  NETWORK = 'NETWORK',
  GNOSIS_SAFE = 'GNOSIS_SAFE',
  AMBIRE = 'AMBIRE',
}

export interface Connection {
  connector: Connector
  hooks: Web3ReactHooks
  type: ConnectionType
}

function onError(error: Error) {
  console.debug(`web3-react error: ${error}`)
}

const [web3Network, web3NetworkHooks] = initializeConnector<Network>(
  (actions) => new Network({ actions, urlMap: RPC_PROVIDERS, defaultChainId: 1 })
)
export const networkConnection: Connection = {
  connector: web3Network,
  hooks: web3NetworkHooks,
  type: ConnectionType.NETWORK,
}

const [web3Injected, web3InjectedHooks] = initializeConnector<MetaMask>((actions) => new MetaMask({ actions, onError }))
export const injectedConnection: Connection = {
  connector: web3Injected,
  hooks: web3InjectedHooks,
  type: ConnectionType.INJECTED,
}

const [web3GnosisSafe, web3GnosisSafeHooks] = initializeConnector<GnosisSafe>((actions) => new GnosisSafe({ actions }))
export const gnosisSafeConnection: Connection = {
  connector: web3GnosisSafe,
  hooks: web3GnosisSafeHooks,
  type: ConnectionType.GNOSIS_SAFE,
}

const [web3WalletConnect, web3WalletConnectHooks] = initializeConnector<WalletConnect>((actions) => {
  // Avoid testing for the best URL by only passing a single URL per chain.
  // Otherwise, WC will not initialize until all URLs have been tested (see getBestUrl in web3-react).
  const RPC_URLS_WITHOUT_FALLBACKS = Object.entries(RPC_URLS).reduce(
    (map, [chainId, urls]) => ({
      ...map,
      [chainId]: urls[0],
    }),
    {}
  )
  return new WalletConnect({
    actions,
    options: {
      rpc: RPC_URLS_WITHOUT_FALLBACKS,
      qrcode: true,
    },
    onError,
  })
})
export const walletConnectConnection: Connection = {
  connector: web3WalletConnect,
  hooks: web3WalletConnectHooks,
  type: ConnectionType.WALLET_CONNECT,
}

const ambireSDK = new window.AmbireSDK({
  walletUrl: 'http://localhost:3000',
  dappName: 'dapp1',
  chainID: 1,
  iframeElementId: 'ambire-sdk-iframe',
})

class AmbireWallet extends Connector {
  activate(chainInfo: any): Promise<void> | void {
    ambireSDK.openLogin(chainInfo)

    return new Promise((resolve, reject) => {
      ambireSDK.onLoginSuccess((data: any) => {
        const activeChainId: SupportedChainId = chainInfo ? parseInt(chainInfo.chainId) : parseInt(data.chainId)
        this.customProvider = this.getProvider(data.address)
        this.actions.update({ chainId: activeChainId, accounts: [data.address] })
        resolve()
      })
      ambireSDK.onRegistrationSuccess((data: any) => {
        const activeChainId: SupportedChainId = chainInfo ? chainInfo.chainId : data.chainId
        this.customProvider = this.getProvider(data.address)
        this.actions.update({ chainId: activeChainId, accounts: [data.address] })
        resolve()
      })
    })
  }

  getProvider(address: string): AmbireProvider {
    // we should probably make a custom RPC provider
    // with a custom getSigner method
    // it is okay for that signer to return a JsonRpcSigner object
    // we should pass the address to the JsonRpcSigner as well
    // but we should rewrite the JsonRpcSigner sendTransaction
    // to use the one from the SDK

    return new AmbireProvider(address, 'https://polygon-rpc.com/rpc')
  }
}

class AmbireProvider extends JsonRpcProvider {
  _address: string

  constructor(address: string, url?: ConnectionInfo | string, network?: Networkish) {
    super(url, network)
    this._address = address
  }

  getSigner(addressOrIndex?: string | number): JsonRpcSigner {
    const signerAddress = addressOrIndex ? addressOrIndex : this._address
    const signer = super.getSigner(signerAddress)
    const provider = this

    const handler1 = {
      get(target: any, prop: any, receiver: any) {
        if (prop === 'sendTransaction') {
          const value = target[prop]
          if (value instanceof Function) {
            return function (...args: any) {
              const txn = args[0]
              ambireSDK.openSendTransaction(txn.to, txn.value ?? 0, txn.data)

              return new Promise((resolve, reject) => {
                ambireSDK.onTxnFinish(async (data: any) => {
                  // TO DO: if a hash is not returned, return a reject
                  // if a hash is returned, try to poll the txn value

                  const hash = data.hash

                  try {
                    const blockNumber = await provider._getInternalBlockNumber(100 + 2 * provider.pollingInterval)

                    return await poll(
                      async () => {
                        const tx = await provider.getTransaction(hash)
                        if (tx === null) {
                          return undefined
                        }
                        return resolve(provider._wrapTransaction(tx, hash, blockNumber))
                      },
                      { oncePoll: provider }
                    )
                  } catch (error) {
                    ;(error as any).transactionHash = hash
                    throw error
                  }
                })
              })
            }
          }
        }

        return Reflect.get(target, prop, receiver)
      },
    }

    return new Proxy(signer, handler1)
  }
}

const [ambireConnect, ambireConnectHooks] = initializeConnector<AmbireWallet>(
  (actions) => new AmbireWallet(actions, onError)
)
export const ambireConnection: Connection = {
  connector: ambireConnect,
  hooks: ambireConnectHooks,
  type: ConnectionType.AMBIRE,
}

const [web3CoinbaseWallet, web3CoinbaseWalletHooks] = initializeConnector<CoinbaseWallet>(
  (actions) =>
    new CoinbaseWallet({
      actions,
      options: {
        url: RPC_URLS[SupportedChainId.MAINNET][0],
        appName: 'Uniswap',
        appLogoUrl: UNISWAP_LOGO_URL,
        reloadOnDisconnect: false,
      },
      onError,
    })
)
export const coinbaseWalletConnection: Connection = {
  connector: web3CoinbaseWallet,
  hooks: web3CoinbaseWalletHooks,
  type: ConnectionType.COINBASE_WALLET,
}
