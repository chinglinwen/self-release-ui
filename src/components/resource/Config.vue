<template>
  <div>
    <v-card-title>Configs</v-card-title>
    <!-- <v-container v-if="config" width="600px"> -->
    <v-container width="600px">
      <v-form ref="form" v-model="valid">
        <v-layout>
          <v-row>
            <v-flex v-if="env=='online'" md2 pa-2>
              <div v-if="editing === item.id">
                NodePort*:
                <v-text-field label :rules="rules.notzero" v-model="config.nodePort"></v-text-field>
              </div>
              <div v-else>NodePort: {{ config.nodePort }}</div>
            </v-flex>
            <v-flex v-if="env=='online'" md2 pa-2>
              <div v-if="editing === item.id">
                Domain:
                <v-text-field label v-model="config.domain"></v-text-field>
              </div>
              <div v-else>Domain: {{ config.domain }}</div>
            </v-flex>
            <v-flex v-if="env=='online'" md2 pa-2>
              <div v-if="editing === item.id">
                Monitor address:
                <v-text-field label v-model="config.monitor.address"></v-text-field>
              </div>
              <div v-else>Monitor address: {{ config.monitor.address }}</div>
            </v-flex>

            <v-flex v-if="config.deploy" md2 pa-2>
              <div v-if="editing === item.id">
                Replicas*:
                <v-text-field label :rules="rules.notzero" v-model="config.deploy.replicas"></v-text-field>
              </div>
              <div v-else>Replicas: {{ config.deploy.replicas }}</div>
            </v-flex>

            <div v-if="editing === item.id">
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
          </v-row>
        </v-layout>
      </v-form>
    </v-container>
    <!-- <v-container v-else>fetching...</v-container> -->
  </div>
</template>

<script>
export default {
  props: {
    env: null,
    // existConfig: Object
    existConfig: {
      type: Object,
      default: function() {
        return {
          deploy: {},
          monitor: {}
        };
      }
    }
  },
  // watch: {
  //   existConfig: function(c, oldc) {
  //     // // this.config = c;
  //     console.log("enter configwatch");
  //     if (c) {
  //       // if (this.env == "online") {
  //       // }
  //       // if (c.nodePort != 0 || c.domain != "" ) {
  //       //   this.config = JSON.parse(JSON.stringify(c));
  //       // }
  //       console.log("fetched config: ", JSON.stringify(c), "for: ", this.env);

  //       this.config = JSON.parse(JSON.stringify(c));

  //       console.log("cur config:", JSON.stringify(this.config));

  //       // if (!this.config.deploy) {
  //       //   console.log("init default deploy");
  //       //   this.config.deploy = {
  //       //     replicas: 0
  //       //   };
  //       // }
  //       // if (!this.config.monitor) {
  //       //   console.log("init default  monitor");
  //       //   this.config.monitor = {
  //       //     address: ""
  //       //   };
  //       // }
  //     }
  //     // console.log("watching existconfig change...");
  //     // if (c) {
  //     //   console.log("fetched config: ", JSON.stringify(c));
  //     //   this.config = JSON.parse(JSON.stringify(c));

  //     //   if (!this.config.deploy) {
  //     //     console.log("init default deploy");
  //     //     this.config.deploy = {
  //     //       replicas: 0
  //     //     };
  //     //   }
  //     //   if (!this.config.monitor) {
  //     //     console.log("init default  monitor");
  //     //     this.config.monitor = {
  //     //       address: ""
  //     //     };
  //     //   }
  //     // } else {
  //     //   this.notcreateyet = true;
  //     //   this.editing = true;
  //     //   this.config = {
  //     //     nodePort: 0,
  //     //     domain: "",
  //     //     monitor: {
  //     //       address: ""
  //     //     },
  //     //     deploy: {
  //     //       replicas: 0
  //     //     }
  //     //   };

  //     //   console.log("set default config: ", JSON.stringify(c));
  //     // }
  //   }
  // },
  // computed: {
  //   config() {
  //     return this.existConfig;
  //   }
  // },
  data: () => ({
    config: {
      // deploy: {},
      // monitor: {}
    },
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
        v => !/^\d+$/.test(v) || "must not be number"
        // v => v.length <= 2 && "must be more than 2 characters"
      ],
      notzero: [
        v => !!v || "must not empty",
        v => v === "0" && "must not zero",
        v => /^\d+$/.test(v) || "must be number"
      ]
    },
    creating: null,
    editing: null,
    search: "",
    headers: [
      { text: "Key", value: "name", align: "left" },
      { text: "Value", value: "value" },
      { text: "action", value: "" }
    ],
    item: {},
    defaultItem: {
      hostkey: "HOST",
      portkey: "PORT"
    },
    itemname: ""
  }),
  created() {
    // console.log("config env(config): ", this.env, JSON.stringify(this.config));
    // console.log(
    //   "config env(existConfig): ",
    //   this.env,
    //   JSON.stringify(this.existConfig)
    // );

    // if (this.env === "online") {
    //   this.config = {
    //     nodePort: 0,
    //     domain: "",
    //     deploy: {
    //       replicas: 0
    //     },
    //     monitor: {
    //       address: ""
    //     }
    //   };
    // } else {
    //   this.config = {
    //     deploy: {
    //       replicas: 0
    //     }
    //   };
    // }

    // let parents components to avoid underfine value
    this.config = this.existConfig;
  },
  methods: {
    // formIsValid(item) {
    //   if (this.env == "online") {
    //     if (
    //       item.nodePort != "0" &&
    //       item.domain != "" &&
    //       item.deploy.replicas != "0" &&
    //       item.monitor.address != ""
    //     );
    //   }
    //   if (this.env == "pre") {
    //     return item.deploy.replicas != "0";
    //   }
    //   if (this.env == "test") {
    //     return item.deploy.replicas != "0";
    //   }
    //   // return false;
    // },
    editMode(item) {
      // this.cacheditem = Object.assign({}, item);
      this.cacheditem = JSON.parse(JSON.stringify(item));

      this.editing = item.id;
      this.creating = false;
    },
    cancelEdit(item) {
      // Object.assign(item, this.cacheditem);
      this.config = JSON.parse(JSON.stringify(this.cacheditem));
      // this.existConfig = JSON.parse(JSON.stringify(this.cacheditem));

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

      if (this.env === "online") {
        item.nodePort = parseInt(item.nodePort, 10);
      }
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