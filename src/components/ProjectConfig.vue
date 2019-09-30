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
            <!-- <v-content> -->
            <v-layout column>
              <v-flex>
                <div ma="12" pa="2">
                  Dev Branch:
                  <v-text-field
                    v-if="editing === config.id"
                    label
                    :rules="rules.notzero"
                    v-model="config.devBranch"
                  ></v-text-field>
                  <div v-else>{{ config.devBranch }}</div>
                </div>
              </v-flex>
              <v-flex>
                <div ma="12" pa="2">
                  Build Mode:
                  <v-text-field
                    v-if="editing === config.id"
                    label
                    :rules="rules.notzero"
                    v-model="config.buildmode"
                  ></v-text-field>
                  <div v-else>{{ config.buildmode }}</div>
                </div>
              </v-flex>
              <v-flex>
                <div ma="12" pa="2">
                  Config Version:
                  <v-text-field
                    v-if="editing === config.id"
                    label
                    :rules="rules.notzero"
                    v-model="config.configver"
                  ></v-text-field>
                  <div v-else>{{ config.configver }}</div>
                </div>
              </v-flex>

              <v-flex>
                <div ma="12" pa="2">
                  Version:
                  <v-text-field
                    v-if="editing === config.id"
                    label
                    placeholder="v1.0.0"
                    :rules="rules.notzero"
                    v-model="config.version"
                  ></v-text-field>
                  <div v-else>{{ config.version }}</div>
                </div>
              </v-flex>
            </v-layout>
            <!-- </v-content> -->
            <!-- <v-row>
              <v-span>devBranch:</v-span>
              <v-div
                class="d-inline"
                deep-purple
                accent-4
                white--text
                v-if="editing === config.id"
                pa="0"
                ma="0"
              >
                <span>Enable:</span>
                <v-text-field label :rules="rules.notzero" v-model="config.devBranch"></v-text-field>
              </v-div>
              <v-div v-else>{{ config.devBranch }}</v-div>
            </v-row>-->

            <!-- <v-row>
              <v-div class="d-block pa-2" v-if="editing === config.id" md2 pa-2>
                <v-text-field
                  class="d-inline"
                  label="Enable:"
                  :rules="rules.notzero"
                  v-model="config.enable"
                ></v-text-field>
              </v-div>
              <v-div v-else class="d-block pa-2" md2 pa-2>Enable: {{ config.enable }}</v-div>
            </v-row>
            <v-row>
              <v-div class="d-block pa-2" v-if="editing === config.id" md2 pa-2>
                <v-text-field
                  class="d-inline"
                  label="Enable:"
                  :rules="rules.notzero"
                  v-model="config.enable"
                ></v-text-field>
              </v-div>
              <v-div v-else class="d-block pa-2" md2 pa-2>Enable: {{ config.enable }}</v-div>
            </v-row>
            <v-row>-->
            <!-- <v-col v-if="editing === config.id" md2 pa-2>
                  Enable:
                  <v-text-field label :rules="rules.notzero" v-model="config.enable"></v-text-field>
                </v-col>
                <v-col v-else md2 pa-2>Enable: {{ config.enable }}</v-col>

                <v-col v-if="editing === config.id" md2 pa-2>
                  Enable:
                  <v-text-field label :rules="rules.notzero" v-model="config.enable"></v-text-field>
                </v-col>
            <v-col v-else md2 pa-2>Enable: {{ config.enable }}</v-col>-->
            <!-- </v-row> -->
            <!-- <v-row v-if="editing === config.id">
              devBranch:
              <v-text-field label :rules="rules.notzero" v-model="config.devBranch"></v-text-field>
            </v-row>
            <v-row v-else>devBranch: {{ config.devBranch }}</v-row>

            <v-row>
              <v-col v-if="editing === config.id" md2 pa-2>
                buildMode:
                <v-text-field label :rules="rules.notzero" v-model="config.buildMode"></v-text-field>
              </v-col>
              <v-col v-else md2 pa-2>buildMode: {{ config.buildMode }}</v-col>

              <v-col v-if="editing === config.id" md2 pa-2>
                configVer:
                <v-text-field label :rules="rules.notzero" v-model="config.configVer"></v-text-field>
              </v-col>
              <v-col v-else md2 pa-2>configVer: {{ config.configVer }}</v-col>

              <v-col v-if="editing === config.id" md2 pa-2>
                version:
                <v-text-field label :rules="rules.notzero" v-model="config.version"></v-text-field>
              </v-col>
              <v-col v-else md2 pa-2>version: {{ config.version }}</v-col>\
            </v-row>-->

            <!-- </v-flex> -->
            <!-- <v-flex v-if="env=='online'" md2 pa-2>
                <div v-if="editing === item.id">
                  Domain:
                  <v-text-field label :rules="rules.notempty" v-model="config.domain"></v-text-field>
                </div>
                <div v-else>Domain: {{ config.domain }}</div>
              </v-flex>
              <v-flex v-if="env=='online'" md2 pa-2>
                <div v-if="editing === item.id">
                  Monitor address:
                  <v-text-field label :rules="rules.notempty" v-model="config.monitor.address"></v-text-field>
                </div>
                <div v-else>Monitor address: {{ config.monitor.address }}</div>
              </v-flex>

              <v-flex v-if="config.deploy" md2 pa-2>
                <div v-if="editing === item.id">
                  Replicas:
                  <v-text-field label :rules="rules.notzero" v-model="config.deploy.replicas"></v-text-field>
                </div>
                <div v-else>Replicas: {{ config.deploy.replicas }}</div>
            </v-flex>-->
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
      dialog: false,

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
      creating: null,
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
        })
        .catch(err => {
          // console.log("getinfos err", err);
          this.notify = { color: "error", msg: err.message, timeout: 86400 };
        });
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
      // if (this.$refs.form.validate()) {
      //   this.snackbar = true;
      //   console.log("not valid for config");
      // }

      this.clearStatus();
      this.submitting = true;

      item.nodePort = parseInt(item.nodePort, 10);
      item.deploy.replicas = parseInt(item.deploy.replicas, 10);
      this.$emit("add:item", item);

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