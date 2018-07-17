import Vue from 'vue'
import Router from 'vue-router'
import SignIn from './pages/SignIn.vue'
import CreateWallet from './pages/CreateWallet.vue'
import ImportWallet from './pages/ImportWallet.vue'
import Account from './pages/Account.vue'
import store from './store'

Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '/',
            name: 'account',
            component: Account,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/signin',
            name: 'signin',
            component: SignIn,
            meta: {
                requiresKeystore: true
            }
        },
        {
            path: '/create-wallet',
            name: 'create-wallet',
            component: CreateWallet,
        },
        {
            path: '/import-wallet',
            name: 'import-wallet',
            component: ImportWallet
        }
    ]
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!store.state.wallet.address) {
            next({ path: '/signin' })
        }else {
            next()
        }
    }else if (to.matched.some(record => record.meta.requiresKeystore)) {
        if (!store.state.wallet.keystore) {
            next({ path: '/create-wallet' })
        }else {
            next()
        }
    }else {
        next()
    }
})

export default router
