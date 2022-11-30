export function AmbireSDK(opt: any) {

//   const wrapperElement = document.getElementById(opt.wrapperElementId ?? "ambire-sdk-wrapper")
//   const iframeElement = document.getElementById(opt.iframeElementId ?? "ambire-sdk-iframe")
//   const connectButton = document.getElementById(opt.connectButtonId ?? "ambire-sdk-connect-btn")
//   const closeButton = document.getElementById(opt.closeButtonId ?? "ambire-sdk-iframe-close")

//   const hideIframe = () => {
//       iframeElement.style.visibility = 'hidden'
//       iframeElement.style.opacity = 0
//       iframeElement.style.pointerEvents = 'none'

//       closeButton.style.display = 'none'

//       document.body.style.pointerEvents = 'auto'
//       wrapperElement.style.visibility = 'hidden'
//       wrapperElement.style.opacity = 0
//       wrapperElement.style.pointerEvents = 'auto'
//   }

//   const showIframe = (url:string) => {
//       document.body.style.pointerEvents = 'none'
//       wrapperElement.style.visibility = 'visible'
//       wrapperElement.style.opacity = 1
//       wrapperElement.style.pointerEvents = 'none'

//       iframeElement.style.width = '60%'
//       iframeElement.style.height = '600px'

//       iframeElement.style.visibility = 'visible'
//       iframeElement.style.opacity = 1
//       iframeElement.style.pointerEvents = 'auto'

//       iframeElement.innerHTML = `<iframe src="`+ url +`" width="100%" height="100%" frameborder="0"/>`

//       closeButton.style.display = 'block'
//       closeButton.style.zIndex = 999
//       closeButton.style.pointerEvents = 'auto'
//   }

//   const openLogin = () => {
//       // temp code
//       showIframe(opt.walletUrl + '/#/email-login-iframe')
//   }

//   const openSignMessage = (messageToSign: string) => {
//       if (!messageToSign || typeof messageToSign !== 'string') {
//           return alert('Invalid input for message')
//       }
//       // convert string to hex
//       const msgInHex = '0x' + messageToSign.split('')
//           .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
//           .join('')
//       showIframe(`${opt.walletUrl}/#/sign-message-sdk/${msgInHex}`)

//       window.addEventListener('message', (e) => {
//           if (e.origin !== opt.walletUrl) return
//           if (e.data.type !== 'signClose') return
//           hideIframe()
//       }, false)
//   }

//   const openSendTransaction = (to: any, value: any, data: any) => {
//       if (
//           !to || !value || !data
//           || typeof to !== 'string'
//           || typeof value !== 'string'
//           || typeof data !== 'string'
//       ) {
//           return alert('Invalid txn input data')
//       }
//       showIframe(`${opt.walletUrl}/#/send-transaction-sdk/${to}/${value}/${data}`)

//       window.addEventListener('message', (e) => {
//           if (e.origin !== opt.walletUrl) return
//           if (e.data.type !== 'signClose') return
//           hideIframe()
//       }, false)
//   }

//   // emit event
//   const emit = (eventName: string, data = {}) => {
//       const event = new CustomEvent(eventName, { detail: { ...data }})
//       window.dispatchEvent(event)
//       console.log(`${eventName} was dispatched`)
//   }

//   // generic event listener
//   const on = (eventName: string, callback: any) => {
//       // console.log(`${eventName} was received`)
//       window.addEventListener(eventName, function(event) {
//           callback(event)
//       })
//   }

//   // ambire-login-success listener
//   const onLoginSuccess = (callback: any) => {
//       window.addEventListener('message', (e) => {
//           if (e.origin !== opt.walletUrl || e.data.type !== 'loginSuccess') return

//           hideIframe()
//           callback(e.data.address)
//       })
//   }

//   // ambire-registration-success listener
//   const onRegistrationSuccess = (callback: any) => {
//       window.addEventListener('message', (e) => {
//           if (e.origin !== opt.walletUrl || e.data.type != 'registrationSuccess') return

//           const buyCrypto = opt.walletUrl + '/#/on-ramp-sdk/' + opt.chainID
//           iframeElement.innerHTML = `<iframe src="`+ buyCrypto +`" width="100%" height="100%" frameborder="0"/>`
//           callback(e.data.address)
//       })

//       window.addEventListener('message', (e) => {
//           if (e.origin !== opt.walletUrl || e.data.type != 'finishRamp') return

//           hideIframe()
//       })
//   }

//   // handlers
//   window.addEventListener('keyup', function(e) {
//       if (e.key == 'Escape') {
//           hideIframe()
//       }
//   })
//   connectButton.addEventListener('click', function() {
//       openLogin()
//   })
//   closeButton.addEventListener('click', function() {
//       hideIframe()
//   })
}