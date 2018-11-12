import Vue from 'vue';
import Vuex from 'vuex';
import { apolloClient } from './main';
import {
  GET_POSTS,
  SIGNIN_USER,
  SIGNUP_USER,
  GET_CURRENT_USER,
  ADD_POST,
  SEARCH_POSTS,
  GET_USER_POSTS,
  UPDATE_USER_POST,
  DELETE_USER_POST,
  INFINITE_SCROLL_POSTS
} from './queries';
import router from './router';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    userPosts: [],
    user: null,
    error: null,
    loading: false,
    authError: null,
    searchResults: []
  },
  getters: {
    userPosts: state => state.userPosts,
    searchResults: state => state.searchResults,
    posts: state => state.posts,
    loading: state => state.loading,
    user: state => state.user,
    error: state => state.error,
    authError: state => state.authError,
    userFavorites: state => state.user && state.user.favorites,
  },
  mutations: {
    setSearchResults: (state, payload) => {
      if (payload !== null) {
        state.searchResults = payload;
      }
    },

    setUserPosts: (state, payload) => {
      state.userPosts = payload;
    },

    clearSearchResults: (state) => {
      state.searchResults = [];
    },

    setPosts: (state, payload) => {
      state.posts = payload;
    },
    setLoading: (state, payload) => {
      state.loading = payload;
    },
    setUser: (state, payload) => {
      state.user = payload;
    },
    clearUser: state => {
      state.user = null;
    },
    setError: (state, payload) => {
      state.error = payload;
    },
    clearError: state => {
      state.error = null;
    },
    setAuthError: (state, payload) => {
      state.authError = payload;
    }
  },
  actions: {
    getCurrentUser: ({ commit }, payload) => {
      commit('setLoading', true);
      apolloClient
        .query({
          query: GET_CURRENT_USER
        })
        .then(({ data }) => {
          commit('setLoading', false);
          // Add user to the state
          commit('setUser', data.getCurrentUser);

          console.log(data.getCurrentUser);
        })
        .catch(err => {
          commit('setLoading', false);

          console.log(err);
        });
    },

    getUserPosts: ({ commit }, payload) => {
      apolloClient
        .query({
          query: GET_USER_POSTS,
          variables: payload
        })
        .then(({ data }) => {
          commit("setUserPosts", data.getUserPosts);
          // console.log(data.getUserPosts);
        })
        .catch(err => {
          console.error(err);
        });
    },

    getPosts: ({ commit }, payload) => {
      commit('setLoading', true);
      // use ApolloClient to fire getPosts query
      apolloClient
        .query({
          query: GET_POSTS
        })
        .then(({ data }) => {
          // Get data from actions to state via mutation
          // Commit passes data from mutation along to mutation functions
          commit('setPosts', data.getPosts);
          commit('setLoading', false);
        })
        .catch(err => {
          commit('setLoading', false);
          console.log(err);
        });
    },

    addPost: ({ commit }, payload) => {
      apolloClient
        .mutate({
          mutation: ADD_POST,
          variables: payload,
          update: (cache, { data: { addPost } }) => {
            // First read the query you want to update
            const data = cache.readQuery({ query: GET_POSTS });
            // Create updated data
            data.getPosts.unshift(addPost);
            // Write updated data back to query
            console.log(data);
            cache.writeQuery({
              query: GET_POSTS,
              data
            });
          },
          // optimistic response ensures data is added immediately as we specified for the update function
          optimisticResponse: {
            __typename: "Mutation",
            addPost: {
              __typename: "Post",
              id: -1,
              ...payload
            }
          },
          // Rerun specified queries after performing the mutation in order to get fresh data
          refetchQueries: [
            {
              query: INFINITE_SCROLL_POSTS,
              variables: {
                pageNum: 1,
                pageSize: 2
              }
            }
          ]
        })
        .then(({ data }) => {
          console.log(data.addPost);
        })
        .catch(err => {
          console.error(err);
        });
    },

    signinUser: ({ commit }, payload) => {
      commit('setLoading', true);
      commit('clearError');
      // clear token to prevent errors (if malformed)
      localStorage.setItem('token', '');
      apolloClient
        .mutate({
          mutation: SIGNIN_USER,
          variables: payload
        })
        .then(({ data }) => {
          commit('setLoading', false);
          localStorage.setItem('token', data.signinUser.token);
          // to make sure created method is run in main.js (we run getCurrentUser), reload the page
          router.go();
        })
        .catch(err => {
          commit('setLoading', false);
          commit('setError', err);
          console.log(err);
        });
    },

    signupUser: ({ commit }, payload) => {
      commit('clearError');
      commit('setLoading', true);
      apolloClient
        .mutate({
          mutation: SIGNUP_USER,
          variables: payload
        })
        .then(({ data }) => {
          commit('setLoading', false);
          localStorage.setItem('token', data.signupUser.token);
          // to make sure created method is run in main.js (we run getCurrentUser), reload the page
          router.go();
        })
        .catch(err => {
          commit('setLoading', false);
          commit('setError', err);
          console.error(err);
        });
    },

    signoutUser: async ({ commit }, payload) => {
      // clear user in state
      commit('clearUser');
      // remove token from localStorage
      localStorage.setItem('token', '');
      // end session
      await apolloClient.resetStore();
      // redirect to home page
      router.push('/');
    },

    searchPosts: ({ commit }, payload) => {
      apolloClient
        .query({
          query: SEARCH_POSTS,
          variables: payload
        })
        .then(({ data }) => {
          commit("setSearchResults", data.searchPosts);
        })
        .catch(err => console.error(err));
    },

    updateUserPost: ({ state, commit }, payload) => {
      apolloClient
        .mutate({
          mutation: UPDATE_USER_POST,
          variables: payload
        })
        .then(({ data }) => {
          const index = state.userPosts.findIndex(
            post => post.id === data.updateUserPost.id
          );
          const userPosts = [
            ...state.userPosts.slice(0, index),
            data.updateUserPost,
            ...state.userPosts.slice(index + 1)
          ];
          commit("setUserPosts", userPosts);
        })
        .catch(err => {
          console.error(err);
        });
    },

    deleteUserPost: ({ state, commit }, payload) => {
      apolloClient
        .mutate({
          mutation: DELETE_USER_POST,
          variables: payload
        })
        .then(({ data }) => {
          const index = state.userPosts.findIndex(
            post => post.id === data.deleteUserPost.id
          );
          const userPosts = [
            ...state.userPosts.slice(0, index),
            ...state.userPosts.slice(index + 1)
          ];
          commit("setUserPosts", userPosts);
        })
        .catch(err => {
          console.error(err);
        });
    },
  }
});
