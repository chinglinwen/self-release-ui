<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="600">
      <template v-slot:activator="{ on }">
        <v-btn color="blue" dark v-on="on" @click="getConfig">config</v-btn>
      </template>

      <v-card>
        <v-card-title>Project's Configs</v-card-title>
        <v-container v-if="config">
          <v-form ref="form" v-model="valid">
            <div v-if="editing === config.id">
              <v-layout column>
                <v-flex>
                  Enable:
                  <v-switch v-model="config.enable" @click="setdefault"></v-switch>
                </v-flex>

                <v-flex>
                  <div ma="12" pa="2">
                    Dev Branch:
                    <v-text-field v-if="editing === config.id" label v-model="config.devBranch"></v-text-field>
                  </div>
                </v-flex>
                <v-flex>
                  <div ma="12" pa="2">
                    Build Mode:
                    <!-- <v-text-field v-if="editing === config.id" label v-model="config.buildMode"></v-text-field> -->
                    <v-select
                      v-if="editing === config.id"
                      v-model="config.buildMode"
                      :items="buildmodes"
                      label
                    ></v-select>
                  </div>
                </v-flex>
                <v-flex>
                  <div ma="12" pa="2">
                    K8s Template Version:
                    <!-- <v-text-field v-if="editing === config.id" label v-model="config.configVer"></v-text-field> -->

                    <v-select
                      v-if="editing === config.id"
                      v-model="config.configVer"
                      :items="configvers"
                      label
                    ></v-select>
                  </div>
                </v-flex>

                <v-flex>
                  <div ma="12" pa="2">
                    Self-Release Version:
                    <!-- <v-text-field v-if="editing === config.id" label v-model="config.version"></v-text-field> -->
                    <v-select
                      v-if="editing === config.id"
                      v-model="config.version"
                      :items="vers"
                      label
                    ></v-select>
                  </div>
                </v-flex>
              </v-layout>
            </div>
            <!-- <div v-else>
              <v-layout column>
                <v-flex md="6">Enable: {{ config.devBranch }}</v-flex>

                <v-flex md="6">Dev Branch: {{ config.devBranch }}</v-flex>

                <v-flex md="6">Build Mode: {{ config.buildMode }}</v-flex>

                <v-flex md="6">K8s Template Version: {{ config.configVer }}</v-flex>

                <v-flex md="6">Self-Release Version: {{ config.version }}</v-flex>
              </v-layout>
            </div>-->

            <!-- <v-layout column>
                <v-row>
                  <v-col>Enable:</v-col>
                  <v-col>{{ config.enable }}</v-col>
                </v-row>

                <v-row>
                  <v-col>Dev Branch:</v-col>
                  <v-col>{{ config.devBranch }}</v-col>
                </v-row>
                <v-row>
                  <v-col>Build Mode:</v-col>
                  <v-col>{{ config.buildMode }}</v-col>
                </v-row>
                <v-row>
                  <v-col>K8s Template Version:</v-col>
                  <v-col>{{ config.configVer }}</v-col>
                </v-row>
                <v-row>
                  <v-col>Self-Release Version:</v-col>
                  <v-col>{{ config.version }}</v-col>
                </v-row>
            </v-layout>-->

            <v-card-actions>
              <div class="flex-grow-1"></div>

              <div v-if="editing === config.id">
                <v-btn @click="cancelEdit(config)">
                  <!-- <v-icon outline>cancel</v-icon> -->
                  cancel
                </v-btn>
                <v-btn :disabled="!valid" @click="handleSubmit(config)">
                  <!-- <v-icon>save</v-icon> -->
                  save
                </v-btn>
              </div>
              <div v-else>
                <v-btn @click="editMode(config)">
                  <!-- <v-icon>edit</v-icon> -->
                  edit
                </v-btn>
              </div>
            </v-card-actions>
          </v-form>
        </v-container>
        <v-container v-else>fetching...</v-container>
      </v-card>
    </v-dialog>

    <v-flex>
      <v-snackbar
        v-if="notify"
        v-model="notify"
        :bottom="true"
        :color="notify.color"
        :multi-line="true"
        :right="true"
        :timeout="notify.timeout"
      >
        {{ notify.msg }}
        <v-btn dark text @click="notify = false">Close</v-btn>
      </v-snackbar>
    </v-flex>
  </v-row>
</template>

<script>
export default {
  props: {
    project: {
      type: Object,
      required: true
    }
    // existConfig: Object
  },

  data() {
    return {
      config: {
        id: "1"
      },
      _config: null,
      dialog: false,
      notify: null,

      buildmodes: ["auto", "on", "manual"],
      configvers: ["phpv1"],
      vers: ["v1.0.0"],

      error: false,
      submitting: false,
      success: false,

      valid: true,
      rules: {
        notempty: [
          v => !!v || "must not empty",
          // v => v != "0" || "must not zero",
          v => v === "" && "must not empty string",
          // v => /^\w+$/.test(v) || "must be string",
          v => !/^\d+$/.test(v) || "must not be number",
          v => v.length <= 2 && "must be more than 2 characters"
        ],
        notzero: [
          v => !!v || "must not empty",
          v => v === "0" && "must not zero",
          v => /^\d+$/.test(v) || "must be number"
        ]
      },
      editing: null
    };
  },
  created() {
    // this.getConfig();
  },
  methods: {
    getConfig() {
      let url = "/api/projects/" + this.project.name + "/config";
      this.$GET(url)
        .then(json => json.data)
        .then(json => {
          this.config = json.selfrelease;
          // this.setdefault();
          this._config = JSON.parse(JSON.stringify(this.config));
        })
        .catch(err => {
          // console.log("getinfos err", err);
          this.notify = { color: "error", msg: err.message, timeout: 86400 };
        });
    },
    setdefault() {
      if (!this.config.version) {
        this.config.version = "v1.0.0";
      }
      if (!this.config.configVer) {
        this.config.configVer = "phpv1";
      }
      if (!this.config.buildMode) {
        this.config.buildMode = "auto";
      }
    },
    editMode(item) {
      this.cacheditem = Object.assign({}, item);
      this.editing = item.id;
      this.creating = false;
    },
    cancelEdit(item) {
      Object.assign(item, this.cacheditem);
      this.editing = null;
    },

    // form
    handleSubmit(item) {
      // if (this.enable) {
      //   item.enable = "on";
      // } else {
      //   item.enable = "off";
      // }
      let a = {
        selfrelease: item
      };
      let data = JSON.stringify(a);
      // if (this.$refs.form.validate()) {
      //   this.snackbar = true;
      //   console.log("not valid for config");
      // }

      // item.nodePort = parseInt(item.nodePort, 10);
      // item.deploy.replicas = parseInt(item.deploy.replicas, 10);
      // this.$emit("add:item", item);

      if (JSON.stringify(this._config) == JSON.stringify(this.config)) {
        this.notify = { color: "orange", msg: "there's no change" };
        console.log("no need update all");
        return;
      }

      this.clearStatus();

      // prevent submitting during submitting
      this.submitting = true;

      // let a = convertback(this.all);
      let url = "/api/projects/" + this.project.name + "/config";
      // let data = JSON.stringify(a, replacer, 2);

      console.log("data:", data);

      // call api
      this.loading = true;
      this.$POST(url, data)
        .then(res => {
          console.log("done submit");
          console.log("submit result", res);
          this.loading = false;
          this.submitting = false;
          this.updated = false;
          this.notify = {
            color: "success",
            msg: "all saved",
            timeout: 50000
          };
          // deep copy instead
          this._config = JSON.parse(JSON.stringify(this.config));
        })
        .catch(err => {
          console.log("submit all err", err);
          this.loading = false;
          this.submitting = false;
          this.updated = false;
          this.notify = { color: "error", msg: err.message, timeout: 86400 };
        });

      this.success = true;
      this.error = false;
      this.submitting = false;
    },

    clearStatus() {
      this.success = false;
      this.error = false;
      this.editing = null;
      this.creating = false;
    }
  }
};
</script>