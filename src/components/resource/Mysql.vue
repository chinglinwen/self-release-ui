<template>
  <div>
    <v-card-title>Mysql</v-card-title>

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
            <td>{{ item.name }}</td>
            <td v-if="editing === item.id">
              <v-text-field label v-model="item.host"></v-text-field>
            </td>
            <td v-else>{{ item.host }}</td>
            <td v-if="editing === item.id">
              <v-text-field label v-model="item.port"></v-text-field>
            </td>
            <td v-else>{{ item.port }}</td>

            <td v-if="editing === item.id">
              <v-text-field label v-model="item.database"></v-text-field>
            </td>
            <td v-else>{{ item.database }}</td>

            <td v-if="editing === item.id">
              <v-text-field label v-model="item.username"></v-text-field>
            </td>
            <td v-else>{{ item.username }}</td>

            <td v-if="editing === item.id">
              <v-text-field label v-model="item.password"></v-text-field>
            </td>
            <td v-else>{{ item.password }}</td>
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
        <v-row>
          <div class="d-flex">
            <v-select
              @change="updateselect"
              :items="items"
              label="mysql select"
              name="item"
              outlined
              v-model="itemname"
              item-text="name"
            ></v-select>
          </div>
        </v-row>

        <v-container v-if="'name' in item">
          <v-row>
            <v-layout>
              <v-flex md2 pa-2>
                <v-text-field :label="hostlabel" v-model="item.host"></v-text-field>
              </v-flex>
              <v-flex md2 pa-2>
                <v-text-field :label="portlabel" v-model="item.port"></v-text-field>
              </v-flex>
              <v-flex md2 pa-2>
                <v-text-field :label="databaselabel" v-model="item.database"></v-text-field>
              </v-flex>
              <v-flex md2 pa-2>
                <v-text-field :label="usernamelabel" v-model="item.username"></v-text-field>
              </v-flex>
              <v-flex md2 pa-2>
                <v-text-field :label="passwordlabel" v-model="item.password"></v-text-field>
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
    items: Array,
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
      { text: "Name", value: "name", align: "left" },
      { text: "Host env", value: "host" },
      { text: "Port env", value: "port" },
      { text: "Database env", value: "database" },
      { text: "User env", value: "username" },
      { text: "Password env", value: "password" },
      { text: "action", value: "" }
    ],
    item: {},
    defaultItem: {
      host: "HOST",
      port: "PORT",
      database: "DATABASE",
      username: "USERNAME",
      password: "PASSWORD"
    },
    itemname: ""
  }),
  computed: {
    hostlabel() {
      // debugger;
      let t = "";
      if (!this.exist) {
        t = "(default)";
      }
      return "host env name: " + t;
    },
    portlabel() {
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
  created() {},
  methods: {
    formIsValid(item) {
      return (
        item.host &&
        item.port &&
        item.database &&
        item.username &&
        item.password
      );
    },
    updateselect() {
      let a = Object.assign({}, this.defaultItem);
      a.name = this.itemname;
      this.item = a;
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
      if (item.id === "" || item.name === "") return;
      this.$emit("edit:item", item.id, item);
      this.editing = null;
    },
    deleteItem(item) {
      if (item.id === "" || item.email === "") return;
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
      if (item.name === "") {
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