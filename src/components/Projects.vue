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
              <template v-for="item in items">
                <tr :key="item.name+1">
                  <td>{{ item.name }}</td>
                  <td class="text-xs-left">
                    <a :href="item.git" target="_blank">{{ item.git }}</a>
                  </td>
                  <td class="text-xs-left">
                    <project-config :project="item" />
                  </td>
                  <td class="text-xs-left">
                    <project-resource :project="item" />
                  </td>
                  <td>
                    <div>
                      <v-icon
                        v-if="expanded!=item.name"
                        v-model="expanded"
                        @click="getpods(item)"
                      >expand_more</v-icon>
                      <v-icon v-else @click="expanded=''">expand_less</v-icon>
                    </div>
                  </td>
                </tr>

                <tr :key="item.name+2">
                  <td v-if="expanded==item.name" :colspan="5">
                    <div v-if="loading">fetching...</div>
                    <div v-else>{{ pods }}</div>
                  </td>
                </tr>
              </template>
            </tbody>
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
        { text: "Action", value: "action", align: "left" },
        { text: "", value: "data-table-expand" }
      ],
      expanded: "",
      pods: []
    };
  },
  created() {
    this.fetchProjects();
  },
  methods: {
    getpods(item) {
      this.expanded = item.name;
      this.loading = true;
      let url = "/api/projects/" + item.name + "/pods";
      this.$GET(url)
        .then(json => json.data)
        .then(json => {
          this.pods = json;
          // this._config = JSON.parse(JSON.stringify(this.config));
          this.notify = {
            color: "success",
            msg: "got " + this.pods.length + " pods ok"
          };

          console.log("got pods: ", JSON.stringify(this.pods, null, " "));
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          // console.log("getinfos err", err);
          this.notify = { color: "error", msg: err.message };
        });
    },
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
