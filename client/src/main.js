import '@babel/polyfill';
import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from './store';

import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import VueApollo from 'vue-apollo';

import FormAlert from './components/Shared/FormAlert';

// Register Global Component
Vue.component('form-alert', FormAlert);

const httpLink = new HttpLink({
  // You should use an absolute URL here
  uri: 'http://localhost:4000/graphql',
  credentials: 'same-origin'
});


// TODO: Error handling
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
    for (let err of graphQLErrors) {
      if (err.name === 'AuthenticationError') {
        // if auth error in state (to show in snackbar)
        store.commit('setAuthError', err);
        // logout user (to clear token)
        store.dispatch('signoutUser');
      }
    }
  }
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      // authorization: token ? `Bearer ${token}` : "",
      authorization: token ? `${token}` : ''
    }
  };
});

// Create the apollo client
export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  // link: ApolloLink.from([authLink, httpLink, errorLink]),
  cache: new InMemoryCache(),
  connectToDevTools: true
});

export const apolloProvider = new VueApollo({
  defaultClient: apolloClient
});



Vue.use(VueApollo);


Vue.config.productionTip = false;

new Vue({
  router,
  store,
  apolloProvider,
  render: h => h(App),
  created() {
    // execute getCurrentUserQuery
    this.$store.dispatch('getCurrentUser');
  }
}).$mount('#app');
