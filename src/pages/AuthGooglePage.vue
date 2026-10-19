<template>
  <q-page class="flex flex-center q-pa-md">
    <q-card flat bordered style="width: 100%; max-width: 420px">
      <q-card-section>
        <div class="text-h5 text-weight-bold">Login</div>
        <div class="text-body2 text-grey-7 q-mt-sm">Masuk menggunakan akun Google.</div>
      </q-card-section>
      <q-card-section>
        <q-banner v-if="errorMessage" rounded class="bg-red-1 text-negative q-mb-md">
          {{ errorMessage }}
        </q-banner>
        <q-btn label="Login dengan Google" color="primary" class="full-width"
          :loading="loading" :disable="loading" @click="loginWithGoogle" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import axios from 'axios'

export default {
  name: 'AuthGooglePage',
  data () {
    return {
      loading: false,
      errorMessage: '',
      apiBaseUrl: process.env.API_BASE_URL || 'https://your-api.example.com/api',
      oauthStartUrl: process.env.GOOGLE_OAUTH_START_URL || 'https://your-api.example.com/auth/google/mobile'
    }
  },
  mounted () {
    window.addEventListener('google-auth-deeplink', this.onDeepLink)
    if (window.__registerGoogleAuthDeepLink) window.__registerGoogleAuthDeepLink()
    this.handlePendingDeepLink()
  },
  beforeUnmount () {
    window.removeEventListener('google-auth-deeplink', this.onDeepLink)
  },
  methods: {
    async loginWithGoogle () {
      this.loading = true
      this.errorMessage = ''
      try {
        const state = this.randomState()
        sessionStorage.setItem('google_oauth_state', state)
        const url = new URL(this.oauthStartUrl)
        url.searchParams.set('state', state)
        window.open(url.toString(), '_system')
      } catch (error) {
        this.errorMessage = 'Tidak dapat membuka login Google.'
        this.loading = false
      }
    },
    randomState () {
      const bytes = new Uint8Array(32)
      if (window.crypto && window.crypto.getRandomValues) {
        window.crypto.getRandomValues(bytes)
        return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')
      }
      return String(Date.now()) + Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2)
    },
    handlePendingDeepLink () {
      const pending = window.__pendingGoogleAuthUrl
      if (pending) {
        window.__pendingGoogleAuthUrl = null
        this.processDeepLink(pending)
      }
    },
    onDeepLink (event) {
      this.processDeepLink(event.detail)
    },
    async processDeepLink (urlString) {
      if (!urlString) return
      let parsed
      try { parsed = new URL(urlString) } catch (error) { return }
      if (parsed.protocol !== 'imajora:' || parsed.hostname !== 'auth' || parsed.pathname !== '/callback') return

      const errorCode = parsed.searchParams.get('error')
      if (errorCode) {
        this.errorMessage = 'Login Google gagal. Silakan coba lagi.'
        this.loading = false
        return
      }

      const code = parsed.searchParams.get('code')
      const returnedState = parsed.searchParams.get('state')
      const expectedState = sessionStorage.getItem('google_oauth_state')
      if (!code || !returnedState || !expectedState || returnedState !== expectedState) {
        this.errorMessage = 'Validasi login gagal. Silakan ulangi login.'
        this.loading = false
        return
      }

      this.loading = true
      try {
        const response = await axios.post(this.apiBaseUrl + '/mobile-auth/exchange',
          { code }, { headers: { Accept: 'application/json' } })
        if (!response.data.token) throw new Error('Token tidak diterima dari server.')
        localStorage.setItem('access_token', response.data.token)
        sessionStorage.removeItem('google_oauth_state')
        await this.$router.replace('/')
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Tidak dapat menyelesaikan login.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
