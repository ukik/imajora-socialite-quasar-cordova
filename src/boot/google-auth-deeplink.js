export default ({ app }) => {
  window.__registerGoogleAuthDeepLink = () => {
    window.__googleAuthReady = true
    if (window.__pendingGoogleAuthUrl) {
      const url = window.__pendingGoogleAuthUrl
      window.__pendingGoogleAuthUrl = null
      window.dispatchEvent(new CustomEvent('google-auth-deeplink', { detail: url }))
    }
  }

  window.__googleAuthDispatch = (url) => {
    if (!url) return
    if (!window.__googleAuthReady) {
      window.__pendingGoogleAuthUrl = url
      return
    }
    window.dispatchEvent(new CustomEvent('google-auth-deeplink', { detail: url }))
  }

  app.config.globalProperties.$googleAuthDeepLinkReady = true
}
