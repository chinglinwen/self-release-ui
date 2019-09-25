<template>
  <div>
    <v-card-title>Configs</v-card-title>
    <v-container v-if="config" width="600px">
      <v-layout>
        <v-row>
          <v-flex v-if="env=='online'" md2 pa-2>
            <div v-if="editing === item.id">
              NodePort:
              <v-text-field label v-model="config.nodePort"></v-text-field>
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
              Replicas:
              <v-text-field label v-model="config.deploy.replicas"></v-text-field>
            </div>
            <div v-else>Replicas: {{ config.deploy.replicas }}</div>
          </v-flex>

          <div v-if="editing === item.id">
            <v-btn @click="cancelEdit(config)">
              <!-- <v-icon outline>cancel</v-icon> -->
              cancel
            </v-btn>
            <v-btn :disabled="!formIsValid(config)" @click="handleSubmit(config)">
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
    </v-container>
    <v-container v-else>fetching...</v-container>
  </div>
</template>

<script>
export default {
  props: {
    env: null,
    existConfig: Object
  },
  computed: {
    config() {
      return this.existConfig;
    }
  },
  data: () => ({
    error: false,
    submitting: false,
    success: false,

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
    console.log("config env: ", this.env, this.existConfig);
  },
  methods: {
    formIsValid(item) {
      debugger;
      if (this.env == "online") {
        return (
          item.nodePort != "0" &&
          item.domain != "" &&
          item.deploy.replicas != "0" &&
          item.monitor.address != ""
        );
      }
      if (this.env == "pre") {
        return item.deploy.replicas != "0";
      }
      if (this.env == "test") {
        return item.deploy.replicas != "0";
      }
      // return false;
    },
    checkitem(item) {
      console.log("show detail div", this.itemname);
      return this.itemname != undefined && this.itemname != "";
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
    cancelCreate(item) {
      this.creating = false;
    },

    editItem(item) {
      if (item.id === "" || item.host === "") return;
      this.$emit("edit:item", item.id, item);
      this.editing = null;
    },
    deleteItem(item) {
      if (item.id === "") return;
      console.log("delete", item);
      this.$emit("delete:item", item);
      this.editing = null;
    },

    // form
    handleSubmit(item) {
      this.clearStatus();
      this.submitting = true;
      // if (!update) {
      //   item.id = 1;
      //   if (this.existItems.length != 0) {
      //     item.id = this.existItems[this.existItems.length - 1].id + 1;
      //   }
      // }

      // if (item.host === "") {
      //   this.error = true;
      //   return;
      // }
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