import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { NhostClient } from '@nhost/vue'
import { createApolloClient } from '@nhost/apollo'
import { DefaultApolloClient } from '@vue/apollo-composable'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue-icons.min.css'

const router = createRouter({
    history: createWebHistory(),
	routes: [
        {
            path: '/',
			name: 'home',
			component: () => import('./views/Home.vue'),
			meta: {
				protected: true
			}
		},
		{
            path: '/login',
			name: 'login',
			component: () => import('./views/Login.vue')
		}
	]
})

router.beforeEach(async (to, from, next) => {
	if (to.matched.some(record => record.meta.protected)) {
		const isAuthenticated = await nhost.auth.isAuthenticatedAsync()
		
		if (isAuthenticated) {
            next()
		} else {
            next('/login')
		}
	} else {
        next()
	}
})


const nhost = new NhostClient({
    subdomain: 'fmszxfkeifgngxsgxwpk',
    region: 'eu-west-2'
});
const apolloClient = createApolloClient({ nhost })


createApp(App)
.provide(DefaultApolloClient, apolloClient)
.use(nhost)
.use(router)
.mount('#app')





