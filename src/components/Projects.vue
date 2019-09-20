<template>
  <v-card>
    <v-toolbar dense color="transparent" flat>
      <v-toolbar-title>
        <h4>Projects</h4>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
    </v-toolbar>
    <v-divider></v-divider>
    <v-card-text class="pa-0">
      <template>
        <v-data-table
          :headers="headers"
          :items="projects"
          :search="search"
          class="elevation-0"
          :loading="loading"
          loading-text="Loading... Please wait"
        >
          <template v-slot:body="{ items }">
            <tbody>
              <tr v-for="item in items" :key="item.name">
                <td>{{ item.name }}</td>

                <td class="text-xs-left">
                  <a :href="item.git" target="_blank">{{ item.git }}</a>
                </td>
                <!-- <td>
                  <v-switch
                    v-model="item.state"
                    :loading="loading"
                    @change="enableProject(item)"
                    slabel
                  ></v-switch>
                </td>-->
                <td class="text-xs-left">
                  <config-project :project="item" />
                </td>
              </tr>
            </tbody>
          </template>
        </v-data-table>
      </template>
      <v-divider></v-divider>
    </v-card-text>
    <!-- <v-snackbar
      v-model="iserror"
      :bottom="true"
      color="red"
      :multi-line="true"
      :right="true"
      :timeout="5000"
    >
      {{ error }}
      <v-btn dark text @click="iserror = false">Close</v-btn>
    </v-snackbar>-->

    <v-flex ma="5">
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
        <v-btn pa="10" dark text @click="notify = false">Close</v-btn>
      </v-snackbar>
    </v-flex>
  </v-card>
</template>

<script>
var domain = "http://release.haodai.net";
// import axios from "axios";
import ConfigProject from "./ConfigProject.vue";

export default {
  components: {
    ConfigProject
  },
  data() {
    return {
      user: {},
      notify: null,
      // iserror: false,
      // error: "",
      loading: false,
      projects: [],
      // projects: mockProjects,
      search: "",
      headers: [
        {
          text: "Project",
          align: "left",
          value: "name"
        },
        { text: "Git Address", value: "git" },
        // { text: "State", value: "state" },
        { text: "Action", value: "action", align: "left" }
      ]
    };
  },
  created() {
    // return;
    this.loading = true;
    // fetch(
    //   // "http://192.168.10.234:8089/api/projects/"
    //   domain + "/api/projects/"
    // )
    this.$GET(domain + "/api/projects/")
      .then(res => {
        this.projects = res.data;
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
        console.log("getProjects err", err);
        this.notify = { color: "error", msg: err.message, timeout: 86400 };
      });
  },
  methods: {
    // call project init?
    enableProject(project) {
      this.$POST("http://192.168.10.234:8089/api/projects/" + project.id, {
        name: "foo",
        surname: "bar"
      })
        // axios
        //   .post("http://192.168.10.234:8090/api/projects/" + project.id, {
        //     name: "hello" //project.name
        //   })
        .then(res => {
          console.log("called", res);
        })
        .catch(err => {
          console.log(err.message);
          // this.iserror = true;
          // this.error = err.message;
          project.state = false;

          this.notify = { color: "error", msg: err.message, timeout: 86400 };
        });
    }
  }
};

// for dev phase
var mockProjects = [
  {
    id: 1,
    username: "Dessie",
    avatar:
      "https://s3.amazonaws.com/uifaces/faces/twitter/ludwiczakpawel/128.jpg",
    name: "haodai/main",
    git: "https://g.haodai.net/yunwei/kubernetes",
    state: false,
    color: "pink"
  },
  {
    id: 2,
    username: "Dessie",
    avatar:
      "https://s3.amazonaws.com/uifaces/faces/twitter/ludwiczakpawel/128.jpg",
    name: "xindaiquan/kubernetes",
    git: "https://g.haodai.net/yunwei/kubernetes",
    state: false,
    color: "pink"
  },
  {
    id: 3,
    username: "config-deploy",
    avatar:
      "https://s3.amazonaws.com/uifaces/faces/twitter/ludwiczakpawel/128.jpg",
    name: "xindaiquan/config-deploy",
    git: "https://g.haodai.net/yunwei/config-deploy",
    state: true,
    color: "pink"
  }
];
</script>
