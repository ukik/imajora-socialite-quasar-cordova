# Cordova deep-link configuration

The custom URL scheme plugin must register the scheme imajora. The backend callback redirects to:

    imajora://auth/callback?code=ONE_TIME_CODE&state=APP_STATE

Merge this script tag into the Cordova HTML shell so it loads before the Vue app bundle:

    <script src="cordova-deeplink.js"></script>

Use the actual HTML template copied into the Android WebView by your Quasar/Cordova version. Do not edit generated files under src-cordova/platforms because Cordova recreates them. Verify the final intent/deep-link behavior on a physical Android device.
