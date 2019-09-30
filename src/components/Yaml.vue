<template>
  <div>
    <v-row justify="center">
      <v-menu transition="slide-y-transition" bottom>
        <template v-slot:activator="{ on }">
          <v-btn class="purple" color="primary" dark v-on="on">See yaml</v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(item, i) in envlist" :key="i" @click="getyaml(item)">
            <v-list-item-title>{{ item }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- <v-btn color="green" class="ma-2" @click="getyaml">See yaml</v-btn> -->
      <v-dialog v-model="yamldialog" max-width="800px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ project.name }} kubernetes yaml (env: {{env}})</span>
          </v-card-title>
          <v-progress-linear v-if="loading" color="blue accent-4" indeterminate rounded height="2"></v-progress-linear>
          <v-card-text>
            <v-row v-if="yaml">
              <pre>{{ yaml }}</pre>
              <!-- {{ yaml }} -->
            </v-row>

            <v-container justify="center">
              <v-snackbar
                v-if="notify"
                v-model="notify"
                :bottom="true"
                :color="notify.color"
                :multi-line="true"
                :center="true"
                :timeout="notify.timeout"
              >
                {{ notify.msg }}
                <v-btn dark text @click="notify = false">Close</v-btn>
              </v-snackbar>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" text @click="close">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    // env: String,
    envlist: Array,
    project: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      yaml: null,
      yamldialog: false,
      env: null,
      loading: null,
      notify: null
    };
  },
  created() {
    // console.log("envlist", this.envlist);
  },
  watch: {
    yamldialog: function(val, oldVal) {
      // console.log("new: %s, old: %s", val, oldVal);
      this.yaml = null;
    }
  },
  methods: {
    getyaml(env) {
      this.env = env;
      this.loading = true;
      this.yamldialog = true;
      this.$GET("/api/gen/" + this.project.name + "/" + env)
        .then(res => {
          this.loading = false;
          this.yaml = unescape(res.data);
          // this.notify = { color: "success", msg: "fetch ok" };
        })
        .catch(err => {
          this.loading = false;
          // console.log("get yaml api err", err);
          this.notify = { color: "error", msg: err.message, timeout: 86400 };
        });
    },
    close() {
      this.yamldialog = false;
      this.yaml = "";
    }
  }
};
</script>