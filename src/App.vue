<template>
  <!-- <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Vuetify</span>
        <span class="font-weight-light">MATERIAL DESIGN</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        text
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
  </v-app-bar>-->
  <div>
    <v-app id="inspire">
      <v-navigation-drawer v-model="drawer" app clipped>
        <v-list dense>
          <router-link to="/">
            <v-list-item v-ripple>
              <!-- <v-list-item-action>
              <v-icon>mdi-view-dashboard</v-icon>
              </v-list-item-action>-->
              <v-list-item-content>
                <v-list-item-title>Dashboard</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </router-link>

          <!-- <v-list-item @click>
          <v-list-item-action>
            <v-icon>mdi-settings</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              <router-link to="/about">Settings</router-link>
            </v-list-item-title>
          </v-list-item-content>
          </v-list-item>-->

          <router-link to="/about">
            <v-list-item v-ripple>
              <!-- <v-list-item-action>
            <v-icon>mdi-settings</v-icon>
              </v-list-item-action>-->
              <v-list-item-content>
                <v-list-item-title>About</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </router-link>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar app clipped-left>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>NewOps</v-toolbar-title>

        <v-spacer></v-spacer>

        <div>user: {{user.user}}</div>
        <v-menu bottom left>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="logout">
              <!-- <v-icon>logout</v-icon> -->
              logout
            </v-list-item>
            <!-- <v-list-item v-for="(item, i) in items" :key="i" @click="logout">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>-->
          </v-list>
        </v-menu>
      </v-app-bar>

      <!-- <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col class="shrink">
            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-btn :href="source" icon large target="_blank" v-on="on">
                  <v-icon large>mdi-code-tags</v-icon>
                </v-btn>
              </template>
              <span>Source</span>
            </v-tooltip>
            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  large
                  href="https://codepen.io/johnjleider/pen/bXNzZL"
                  target="_blank"
                  v-on="on"
                >
                  <v-icon large>mdi-codepen</v-icon>
                </v-btn>
              </template>
              <span>Codepen</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-container>
      </v-content>-->

      <v-content>
        <router-view />
      </v-content>

      <!-- <v-footer app elevation="0">
      <div text-right>&copy; haodai.com 2019</div>
      </v-footer>-->
    </v-app>
    <div text-right>&copy; haodai.com 2019</div>
  </div>
</template>

<script>
export default {
  name: "App",
  props: {
    source: String
  },
  data: () => ({
    drawer: false,
    user: {
      user: null
    }
  }),
  created() {
    this.$vuetify.theme.dark = false;

    this.loading = true;
    this.$GET("/api/users/")
      .then(res => {
        this.user = res.data;
        this.loading = false;
        // console.log("user: ", this.user);
      })
      .catch(err => {
        this.loading = false;
        console.log("get user err", err);
        this.notify = { color: "error", msg: err.message, timeout: 86400 };
      });
  },
  methods: {
    logout() {
      document.cookie = "uuid=; expires=Thu, 01 Jan 1970 00:00:00 UTC ";
      document.cookie =
        "token=; path=/; domain=.haodai.net; expires=Thu, 01 Jan 1970 00:00:00 UTC ";
      document.location = "/";
    }
  }
};
</script>
