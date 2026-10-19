(function () {
  window.__googleAuthReady = false
  window.handleOpenURL = function (url) {
    window.__pendingGoogleAuthUrl = url
    if (window.__googleAuthDispatch) window.__googleAuthDispatch(url)
  }
})()
