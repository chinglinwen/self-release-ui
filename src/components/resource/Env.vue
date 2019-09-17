<template>
  <div>
    <v-card-title>Environments Variables</v-card-title>

    <v-data-table
      v-if="existItems.length!=0"
      :headers="headers"
      :items="existItems"
      :search="search"
      hide-default-footer
    >
      <template v-slot:body="{ items }">
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <!-- <td v-if="editing === item.id">
              <v-text-field label v-model="item.id"></v-text-field>
            </td>-->

            <td v-if="editing === item.id">
              <v-text-field label v-model="item.name"></v-text-field>
            </td>
            <td v-else>{{ item.name }}</td>

            <td v-if="editing === item.id">
              <v-text-field label v-model="item.value"></v-text-field>
            </td>
            <td v-else>{{ item.value }}</td>

            <td v-if="editing === item.id">
              <v-btn @click="cancelEdit(item)">
                <v-icon outline>cancel</v-icon>
              </v-btn>
              <v-btn :disabled="!formIsValid(item)" @click="handleSubmit(item,true)">
                <v-icon>save</v-icon>
              </v-btn>
            </td>
            <td v-else>
              <v-btn @click="editMode(item)">
                <v-icon>edit</v-icon>
              </v-btn>
              <v-btn @click="deleteItem(item)">
                <v-icon>delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-data-table>

    <v-btn @click="creating=!creating;editing = null">
      <v-icon>add</v-icon>
    </v-btn>

    <v-container>
      <div v-if="creating">
        <v-container>
          <v-row>
            <v-layout>
              <v-flex md2 pa-2>
                <v-text-field label="env key" v-model="item.name"></v-text-field>
              </v-flex>
              <v-flex md2 pa-2>
                <v-text-field label="env value" v-model="item.value"></v-text-field>
              </v-flex>
              <v-flex md2 py-5>
                <v-btn text @click="cancelCreate(item)">cancel</v-btn>
                <v-btn :disabled="!formIsValid(item)" text @click="handleSubmit(item)">save</v-btn>
              </v-flex>
            </v-layout>
          </v-row>
        </v-container>
      </div>
    </v-container>
  </div>
</template>

<script>
export default {
  props: {
    exist: false,
    // items: Array,
    existItems: Array
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
  computed: {
    // itemlabel: item => {
    //   return item.host;
    // },
    hostlabel() {
      // debugger;
      return "host name: ";
    },
    portlabel() {
      return "port name: ";
    },

    hostkeylabel() {
      return "host env name: ";
    },
    portkeylabel() {
      return "port env name: ";
    },
    databaselabel() {
      return "database env name: ";
    },
    usernamelabel() {
      return "username env name: ";
    },
    passwordlabel() {
      return "password env name: ";
    }
  },
  created() {
    console.log("env existItems", this.existItems);
    console.log("env items", this.items);
  },
  methods: {
    formIsValid(item) {
      return item.name && item.value;
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
    handleSubmit(item, update) {
      this.clearStatus();
      this.submitting = true;
      if (!update) {
        item.id = 1;
        if (this.existItems.length != 0) {
          item.id = this.existItems[this.existItems.length - 1].id + 1;
        }
      }

      if (item.host === "") {
        this.error = true;
        return;
      }

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