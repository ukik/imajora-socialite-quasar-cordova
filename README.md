# IMAJORA Socialite Quasar + Cordova

Starter integration files for Google login in an existing Quasar Vue 3 Options API app packaged with Cordova Android. OAuth runs in the Android system browser; Laravel creates accounts on first login. This is not a full generated Quasar app.

## Install

From your existing Quasar project, install axios and Cordova mode if not already installed:

    npm install axios
    quasar mode add cordova
    cd src-cordova
    cordova plugin add cordova-plugin-customurlscheme --variable URL_SCHEME=imajora --variable ANDROID_SCHEME=imajora --variable ANDROID_HOST=auth
    cd ..

Copy the files from this repository into matching paths and merge the route example into your router. Register google-auth-deeplink in the boot array of quasar.config.js.

Set public URL values in your app's environment/config:

    API_BASE_URL=https://your-api.example.com/api
    GOOGLE_OAUTH_START_URL=https://your-api.example.com/auth/google/mobile

Never put Google client secrets in the mobile app. Merge the cordova-deeplink.js script into the Cordova HTML shell before the app bundle. See docs/CORDOVA-CONFIG.md.

Build using: quasar build -m cordova -T android

Test on a physical Android device. The backend redirects to imajora://auth/callback. The example stores the token in localStorage for simplicity; use secure native storage in production.
