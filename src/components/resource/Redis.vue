<template>
  <div>
    <v-card-title>Redis</v-card-title>

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
            <!-- <td v-if="editing === item.id">
              <v-text-field disabled label v-model="item.host"></v-text-field>
            </td>
            <td v-else>{{ item.host }}</td>-->
            <td>{{ item.host }}</td>
            <td v-if="editing === item.id">
              <v-text-field label v-model="item.hostkey"></v-text-field>
            </td>
            <td v-else>{{ item.hostkey }}</td>

            <!-- <td v-if="editing === item.id">
              <v-text-field disabled label v-model="item.port"></v-text-field>
            </td>
            <td v-else>{{ item.port }}</td>-->
            <td>{{ item.port }}</td>
            <td v-if="editing === item.id">
              <v-text-field label v-model="item.portkey"></v-text-field>
            </td>
            <td v-else>{{ item.portkey }}</td>

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
              label="redis select"
              name="item"
              outlined
              v-model="itemname"
              item-text="host"
            ></v-select>
          </div>
        </v-row>

        <v-container v-if="'name' in item">
          <v-row>
            <v-layout>
              <v-flex md5 pa-2>
                <v-text-field disabled :label="hostlabel" v-model="item.host"></v-text-field>
              </v-flex>
              <v-flex md2 pa-2>
                <v-text-field :label="hostkeylabel" v-model="item.hostkey"></v-text-field>
              </v-flex>

              <v-flex md1 pa-2>
                <v-text-field disabled :label="portlabel" v-model="item.port"></v-text-field>
              </v-flex>
              <v-flex md2 pa-2>
                <v-text-field :label="portkeylabel" v-model="item.portkey"></v-text-field>
              </v-flex>

              <v-flex md2 py-5>
                <v-btn text @click="cancelCreate(item)">cancel</v-btn>
                <v-btn text :disabled="!formIsValid(item)" @click="handleSubmit(item)">save</v-btn>
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
      { text: "Host", value: "host" },
      { text: "Host env", value: "hostkey", align: "left" },
      { text: "Port", value: "port" },
      { text: "Port env", value: "portkey" },
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
    // console.log("existItems", this.existItems);
  },
  methods: {
    formIsValid(item) {
      return item.hostkey && item.host && item.portkey && item.port;
    },
    updateselect() {
      let a = this.items.find(item => item.host == this.itemname);
      a.hostkey = this.defaultItem.hostkey;
      a.portkey = this.defaultItem.portkey;
      a.name = this.itemname;
      this.item = a;
      // console.log("redis selected item", item);
    },
    checkitem(item) {
      // console.log("show detail div", this.itemname);
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
      if (item.id === "" || item.name === "") return;
      // console.log("delete", item);
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