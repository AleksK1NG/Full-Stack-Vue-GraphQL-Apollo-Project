<template>
  <v-container text-xs-center mt-5 pt-5>

    <!--Signin Title-->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <h1>Welcome back !</h1>
      </v-flex>
    </v-layout>


    <!--Error Alert-->
    <v-layout v-if="error" row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <form-alert :message="error.message"></form-alert>
      </v-flex>
    </v-layout>

    <!--Signin Form-->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <v-card color="secondary" dark>
          <v-container>
            <v-form @submit.prevent="handleSignInUser" v-model="isFormValid" lazy-validation ref="form">

              <v-layout row>
                <v-flex xs12>
                  <v-text-field :rules="usernameRules" v-model="username" prepend-icon="face" label="Username" type="text" required />
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-text-field :rules="passwordRules" v-model="password" prepend-icon="extension" label="Password" type="password" required />
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-btn :loading="loading" color="accent" type="submit" :disabled="!isFormValid">
                    <span slot="loader" class="custom-loader">
                      <v-icon light>cached</v-icon>
                    </span>
                    Login
                  </v-btn>
                  <h3>
                    Dont have an account ?
                    <router-link to="/signup">Register</router-link>
                  </h3>
                </v-flex>
              </v-layout>

            </v-form>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Signin',

  data() {
    return {
      username: '',
      password: '',
      usernameRules: [
        // Check if username in input
        username => !!username || 'Username is required',
        // Make sure username is less than 5 characters
        username =>
          username.length > 5 || 'Username must be less than 5 characters'
      ],
      passwordRules: [
        password => !!password || 'Password is required',
        password =>
          password.length >= 5 || 'Password must be at least 5 characters'
      ],
      isFormValid: true
    };
  },

  computed: {
    ...mapGetters(['user', 'error', 'loading'])
  },

  watch: {
    user(value) {
      // if user value changes from null to object, redirect to home page
      if (value) {
        this.$router.push('/');
      }
    }
  },

  methods: {
    handleSignInUser() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('signinUser', {
          username: this.username,
          password: this.password
        });
      }
    }
  }
};
</script>


<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
