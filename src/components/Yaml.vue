<template>
  <div>
    <v-row justify="center">
      <v-btn color="green" class="ma-2" @click="getyaml">See yaml</v-btn>
      <v-dialog v-model="yamldialog" max-width="800px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ project.name }} kubernetes yaml</span>
          </v-card-title>
          <v-progress-linear v-if="loading" color="blue accent-4" indeterminate rounded height="2"></v-progress-linear>
          <v-card-text>
            <pre>{{ yaml }}</pre>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" text @click="yamldialog = false">Close</v-btn>
          </v-card-actions>
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
            <v-btn pa="10" dark text @click="notify = false">Close</v-btn>
          </v-snackbar>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
var domain = "http://release.haodai.net";
export default {
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      yaml: null,
      yamldialog: false,
      loading: null,
      notify: null
    };
  },
  methods: {
    getyaml() {
      this.loading = true;
      this.yamldialog = true;
      this.$GET(domain + "/api/gen/" + this.project.name + "/" + "pre")
        .then(res => {
          this.loading = false;
          this.yaml = unescape(res.data);
          // this.notify = { color: "success", msg: "fetch ok" };
        })
        .catch(error => {
          this.loading = false;
          console.log("get yaml api err", error);
          this.notify = { color: "error", msg: err.message, timeout: 86400 };
        });
    }
  }
};
</script>