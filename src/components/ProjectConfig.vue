<template>
  <div>
    <v-dialog v-model="dialog" max-width="600">
      <template v-slot:activator="{ on }">
        <!-- <v-btn color="blue" dark v-on="on" @click="getConfig">Config</v-btn> -->
        <v-chip color="blue" dark v-on="on" @click="getConfig">配置</v-chip>
        <!-- <v-switch v-model="dialog" @change="getConfig" slabel></v-switch> -->
      </template>

      <v-card>
        <v-card-title>Configs for project: {{ project.name }}</v-card-title>
        <v-container v-if="config">
          <v-form ref="form" v-model="valid">
            <div v-if="editing === config.id">
              <v-layout column>
                <div>
                  Enable:
                  <v-switch v-model="config.enable" @click="setdefault"></v-switch>
                </div>

                <div>
                  <div ma="12" pa="2">
                    Dev Branch:
                    <v-text-field v-if="editing === config.id" label v-model="config.devBranch"></v-text-field>
                  </div>
                </div>
                <div>
                  <div ma="12" pa="2">
                    Build Mode:
                    <v-select
                      v-if="editing === config.id"
                      v-model="config.buildMode"
                      :items="buildmodes"
                      label
                    ></v-select>
                  </div>
                </div>
                <div>
                  <div ma="12" pa="2">
                    K8s Template Version:
                    <v-select
                      v-if="editing === config.id"
                      v-model="config.configVer"
                      :items="configvers"
                      label
                    ></v-select>
                  </div>
                </div>

                <div>
                  <div ma="12" pa="2">
                    Self-Release Version:
                    <v-select
                      v-if="editing === config.id"
                      v-model="config.version"
                      :items="vers"
                      label
                    ></v-select>
                  </div>
                </div>
              </v-layout>
            </div>
            <div v-else>
              <v-layout column>
                <div md="6">Enable: {{ config.enable }}</div>
                <div md="6">Dev Branch: {{ config.devBranch }}</div>
                <div md="6">Build Mode: {{ config.buildMode }}</div>
                <div md="6">K8s Template Version: {{ config.configVer }}</div>
                <div md="6">Self-Release Version: {{ config.version }}</div>
              </v-layout>
            </div>
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
                  <div v-if="configexist">edit</div>
                  <div v-else>create</div>
                </v-btn>
              </div>
            </v-card-actions>
          </v-form>
        </v-container>
        <v-container v-else>fetching...</v-container>
      </v-card>
    </v-dialog>

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
  </div>
</template>

<script>
export default {
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  watch: {
    dialog: function() {
      if (!this.dialog) {
        this.clearStatus();
      }
    }
  },
  data() {
    return {
      config: {
        id: "1"
      },
      _config: null,
      dialog: false,
      notify: null,
      configexist: false,

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
  methods: {
    getConfig() {
      let url = "/api/projects/" + this.project.name + "/config";
      this.$GET(url)
        .then(json => json.data)
        .then(json => {
          this.config = json.selfrelease;
          this._config = JSON.parse(JSON.stringify(this.config));

          if (this.config.enable) {
            this.configexist = true;
          }
        })
        .catch(err => {
          // console.log("getinfos err", err);
          // this.notify = { color: "error", msg: err.message };
        });
    },
    setdefault() {
      if (!this.config.devBranch) {
        this.config.devBranch = "develop";
      }
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
      // this.editing = null;

      this.clearStatus();
    },
    handleSubmit(item) {
      let a = {
        selfrelease: item
      };
      let data = JSON.stringify(a);
      if (JSON.stringify(this._config) == JSON.stringify(this.config)) {
        this.notify = { color: "orange", msg: "there's no change" };
        return;
      }

      this.clearStatus();

      // prevent submitting during submitting
      this.submitting = true;

      let url = "/api/projects/" + this.project.name + "/config";
      console.log("data:", data);

      // call api
      this.loading = true;
      this.$POST(url, data)
        .then(res => {
          console.log("done submit");
          console.log("submit result", res);
          this.loading = false;
          this.submitting = false;
          this.updated = true;

          this.configexist = true;
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
      this.notify = null;

      if (this._config) {
        this.config = JSON.parse(JSON.stringify(this._config));
      }
    }
  }
};
</script>