<template>
  <v-app style="background: #E3E3EE">

    <!--Side NavBar-->
    <v-navigation-drawer app temporary fixed v-model="sideNav">
      <v-toolbar color="accent" dark flat>
        <v-toolbar-side-icon @click="toggleSideNav"></v-toolbar-side-icon>
        <router-link to="/" tag="span" style="cursor: pointer">
          <h1 class="title" pl-3>ImageShare</h1>
        </router-link>
      </v-toolbar>

      <v-divider></v-divider>

      <!--Side NavBar Links-->
      <v-list>
        <v-list-tile ripple v-for="item in sideNavItems" :key="item.title" :to="item.link">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            {{ item.title }}
          </v-list-tile-content>
        </v-list-tile>

        <!--Signout Button-->
        <v-list-tile v-if="user" @click="handleSignoutUser">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            Logout
          </v-list-tile-content>
        </v-list-tile>

      </v-list>

    </v-navigation-drawer>

    <!--Horizontal NavBar-->
    <v-toolbar fixed color="primary" dark>
      <v-toolbar-side-icon @click="toggleSideNav"></v-toolbar-side-icon>
      <v-toolbar-title class="hidden-xs-only">
        <router-link to="/" tag="span" style="cursor: pointer">ImageShare</router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!--Search Input-->
      <v-text-field
        v-model="searchTerm"
        @input="handleSearchPosts"
        flex
        prepend-icon="search"
        placeholder="Search posts"
        single-line
        hide-details
        color="accent"></v-text-field>

      <!--Search Results Card-->
      <v-card dark v-if="searchResults.length" id="search__card" >
        <v-list>
          <v-list-tile @click="goToSearchResult(result.id)" v-for="result in searchResults" :key="result.id">
            <v-list-tile-title>
              {{ result.title }} -
              <span class="font-weight-thin">{{ formatDescription(result.description) }}</span>
            </v-list-tile-title>

            <!--Show Icon if Result is Favorite by User-->
            <v-list-tile-action v-if="checkIfUserFavorite(result.id)">
              <v-icon>favorite</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-card>

      <v-spacer></v-spacer>

      <!--Horizontal NavBar Links-->
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat  v-for="item in horizontalNavItems" :key="item.title" :to="item.link">
          <v-icon left class="hidden-sm-only">{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>

        <!--Profile Button-->
        <v-btn flat to="/profile" v-if="user">
          <v-icon class="hidden-sm-only" left>account_box</v-icon>
          <v-badge right color="blue darken-2" :class="{ 'bounce': badgeAnimated }">
            <span slot="badge" v-if="userFavorites.length" > {{ userFavorites.length }} </span>
            Profile
          </v-badge>
        </v-btn>

        <!--Signout Button-->
        <v-btn flat v-if="user" @click="handleSignoutUser">
          <v-icon class="hidden-sm-only" left>exit_to_app</v-icon>
          Logout
        </v-btn>

      </v-toolbar-items>

    </v-toolbar>
    <!--App Content-->
    <main>
      <v-container class="mt-4" >
        <transition name="fade">
          <router-view/>
        </transition>

        <!--Auth SnackBar-->
        <v-snackbar v-model="authSnackbar" color="success" bottom left :timeout="5000">
          <v-icon class="mr-3">check_circle</v-icon>
          <h3>Cool, You are now logged in !</h3>
          <v-btn dark flat @click="authSnackbar = false">Close</v-btn>
        </v-snackbar>

        <!--Auth Error SnackBar-->
        <v-snackbar v-if="authError" v-model="authErrorSnackbar" color="info" bottom left :timeout="5000">
          <v-icon class="mr-3">cancel</v-icon>
          <h3>Error: </h3>
          <v-btn dark flat to="/signin">Login</v-btn>
        </v-snackbar>


      </v-container>
    </main>
  </v-app>

</template>


<script>
import { mapGetters } from 'vuex';

export default {
  name: 'App',
  data() {
    return {
      searchTerm: "",
      sideNav: false,
      authSnackbar: false,
      authErrorSnackbar: false,
      badgeAnimated: false
    };
  },

  computed: {
    ...mapGetters(['user', 'authError', 'userFavorites', 'searchResults']),

    horizontalNavItems() {
      let items = [
        { icon: 'chat', title: 'Posts', link: '/posts' },
        { icon: 'lock_open', title: 'Sign In', link: '/signin' },
        { icon: 'create', title: 'Sign Up', link: '/signup' }
      ];

      if (this.user) {
        items = [{ icon: 'chat', title: 'Posts', link: '/posts' }];
      }

      return items;
    },
    sideNavItems() {
      let items = [
        { icon: 'chat', title: 'Posts', link: '/posts' },
        { icon: 'lock_open', title: 'Sign In', link: '/signin' },
        { icon: 'create', title: 'Sign Up', link: '/signup' }
      ];

      if (this.user) {
        items = [
          { icon: 'chat', title: 'Posts', link: '/posts' },
          { icon: 'stars', title: 'Create Post', link: '/post/add' },
          { icon: 'account_box', title: 'Profile', link: '/profile' }
        ];
      }

      return items;
    }
  },

  watch: {
    user(newValue, oldValue) {
      // if we had no value for user before, show snackbar
      if (oldValue === null) {
        this.authSnackbar = true;
      }
    },

    authError(newValue, oldValue) {
      // if auth error is not null, show auth error snackbar
      if (newValue !== null) {
        this.authSnackbar = true;
      }
    },

    userFavorites(value) {
      // if user favorites value changed at all
      if (value) {
        this.badgeAnimated = true;
        setTimeout(() => (this.badgeAnimated = false), 1000);
      }
    }
  },

  methods: {
    handleSearchPosts() {
      this.$store.dispatch("searchPosts", {
        searchTerm: this.searchTerm
      });
    },

    toggleSideNav() {
      this.sideNav = !this.sideNav;
    },

    handleSignoutUser() {
      this.$store.dispatch('signoutUser');
    },

    goToSearchResult(resultId) {
      // Clear search term
      this.searchTerm = "";
      // Go to desired result
      this.$router.push(`/posts/${resultId}`);
      // Clear search results
      this.$store.commit("clearSearchResults");
    },

    formatDescription(desc) {
      return desc.length > 30 ? `${desc.slice(0, 30)}...` : desc;
    },

    checkIfUserFavorite(resultId) {
      return (
        this.userFavorites &&
        this.userFavorites.some(fave => fave.id === resultId)
      );
    },
  }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition-property: all;
  transition-duration: 0.25s;
}

.fade-enter-active {
  transition-delay: 0.25s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
  /*transform: translateY(-25px);*/
}
/* Search Results Card */
#search__card {
  position: absolute;
  width: 100vw;
  z-index: 8;
  top: 100%;
  left: 0%;
}

/* User Favorite Animation */
.bounce {
  animation: bounce 1s both;
}

@keyframes bounce {
  0%,
  20%,
  53%,
  80%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  40%,
  43% {
    transform: translate3d(0, -20px, 0);
  }
  70% {
    transform: translate3d(0, -10px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
}
</style>
