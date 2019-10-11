<template>
  <v-card>
    <v-toolbar dense color="transparent" flat>
      <v-toolbar-title>
        <h4>Projects</h4>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-icon v-on="on" @click="refreshProjects">refresh</v-icon>
        </template>
        <span>refresh projects list, takes 30 seconds for admin user</span>
      </v-tooltip>
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
                <td class="text-xs-left">
                  <!-- <v-switch
                    v-model="item.state"
                    :loading="loading"
                    @change="enableProject(item)"
                    slabel
                  ></v-switch>-->
                  <!-- <div v-if="showConfig"> -->
                  <project-config :project="item" />
                  <!-- </div> -->
                </td>
                <td class="text-xs-left">
                  <project-resource :project="item" />
                </td>
              </tr>
            </tbody>
          </template>

          <template v-slot:expanded-item="{ headers }">
            <td :colspan="headers.length">Peek-a-boo!</td>
          </template>
        </v-data-table>
      </template>
      <v-divider></v-divider>
    </v-card-text>

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
import ProjectConfig from "./ProjectConfig.vue";
import ProjectResource from "./ProjectResource.vue";
import { timeout } from "q";

export default {
  components: {
    ProjectConfig,
    ProjectResource
  },
  data() {
    return {
      user: {},
      notify: null,
      loading: false,
      projects: [],
      search: "",
      headers: [
        {
          text: "Project",
          align: "left",
          value: "name"
        },
        { text: "Git Address", value: "git" },
        { text: "Enable", value: "state", align: "left" },
        { text: "Action", value: "action", align: "left" }
      ]
    };
  },
  created() {
    this.fetchProjects();
  },
  methods: {
    refreshProjects() {
      console.log("try refresh projects lists");
      this.fetchProjects("yes");
    },
    fetchProjects(refresh) {
      if (!refresh) {
        refresh = "no";
      }
      this.loading = true;
      this.$GET(
        "/api/projects/",
        {
          refresh: refresh
        },
        30000
      )
        .then(res => {
          this.projects = res.data;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          console.log("getProjects err", err);
          this.notify = { color: "error", msg: err.message, timeout: 86400 };
        });
    }
  }
};
</script>
