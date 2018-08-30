<template>
    <div>
        <app-header :subtitle="subtitle" :show-navigations="false" />

        <main class="main">
            <div>
                <div v-show="$route.params.name == 'connect'" class="notif-text">
                    <p><strong>{{ $route.query.domain }}</strong> want to access your TRON account. It could access :</p>

                    <ul>
                        <li>Your current TRON address.</li>
                        <li>Network that you're currently connected to (mainnet or testnet).</li>
                    </ul>

                    <p>This won't let the dapp to access your private key.</p>
                </div>

                <div v-show="!wallet.keypass">
                    <div v-show="message.show" class="message" :class="[ message.type ]">
                        {{ message.text }}
                    </div>

                    <input class="input-field" type="password" placeholder="Password" v-model="password">
                </div>

                <div class="button-group">
                    <div class="button-group-item">
                        <button class="button" type="button" @click.prevent="cancel($route.params.name)">Cancel</button>
                    </div>
                    <div class="button-group-item">
                        <button class="button brand" type="button" @click.prevent="approve($route.params.name)">Approve</button>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import { decryptKeyStore } from '../../lib/keystore'
    import AppHeader from '../components/AppHeader.vue'

    export default {
        components: {
            AppHeader
        },

        data: () => ({
            password: '',
            message: {
                show: false,
                type: 'error',
                text: ''
            }
        }),

        computed: {
            subtitle() {
                const subtitles = {
                    connect: 'Allow Access to Dapps'
                }

                return subtitles[this.$route.params.name] || 'Confirm Transaction'
            },
            ...mapState({
                dapps: state => state.dapps,
                wallet: state => state.wallet,
                network: state => state.network
            })
        },

        methods: {
            login() {
                if (this.wallet.keypass) {
                    return true
                }

                const wallet = decryptKeyStore(this.password, this.wallet.keystore)

                if (!wallet) {
                    this.message.show = true
                    this.message.type = 'error'
                    this.message.text = 'Password is incorrect'

                    return false
                }

                return true
            },

            getWindow(callback) {
                chrome.windows.getCurrent({ windowTypes: ['popup'], populate: true }, window => {
                    if (window.tabs[0].title === 'TronMask') {
                        callback(window)
                    }
                })
            },

            closeWindow(windowId) {
                chrome.windows.remove(windowId)
            },

            sendMessage(name, payload) {
                name = `tronmask_${name}`
                chrome.runtime.sendMessage({ from: 'popup', name, tabid: this.$route.query.tabid, payload })
            },

            cancel(page) {
                const payload = {
                    status: 'error',
                    type: 'REJECTED'
                }

                this.getWindow(window => {
                    this.sendMessage(page, payload)
                    this.closeWindow(window.id)
                })
            },

            approve(page) {
                switch (page) {
                    case 'connect':
                        this.allowDapp()
                        break
                    default:
                        break
                }
            },

            allowDapp() {
                if (!this.login()) {
                    return false
                }

                const dapp = {
                    domain: this.$route.query.domain,
                    favicon: this.$route.query.favicon
                }

                this.$store.commit('dapps/pushDapps', dapp)

                const payload = {
                    status: 'success',
                    data: {
                        address: this.wallet.address,
                        network: this.network
                    }
                }

                this.getWindow(window => {
                    this.sendMessage('connect', payload)
                    this.closeWindow(window.id)
                })
            }
        }
    }
</script>

<style>
    .notif-text {
        font-size: 0.875rem;
    }
    .notif-text ul {
        padding-left: 1.25rem;
    }
</style>
