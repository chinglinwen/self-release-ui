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
                      <v-icon v-else @click="hidepods">expand_less</v-icon>
                    </div>
                  </td>
                </tr>

                <tr :key="item.name+2">
                  <td v-if="expanded==item.name" :colspan="5">
                    <v-container>
                      <!-- <v-card class="d-flex pa-2" outlined tile> -->
                      <!-- <div v-if="loading">fetching...</div> -->
                      <!-- <div v-else>{{ pods }}</div> -->
                      <div>
                        <!-- <v-card
                        v-for="pod in pods"
                        :key="pod.pod_name"
                        class="d-flex pa-2"
                        outlined
                        tile
                        >-->
                        <!-- <v-card md="2" class="d-flex justify-start pa-2" outlined>{{ pod.pod_name }}</v-card>
                        <v-card md="2" class="d-flex justify-start pa-2" outlined>{{ pod.env }}</v-card>
                        <v-card md="2" class="d-flex justify-start pa-2" outlined>{{ pod.node }}</v-card>-->
                        <div v-if="nopods">no pods found</div>
                        <div v-else>
                          <v-row
                            v-for="pod in pods"
                            :key="pod.pod_name"
                            no-gutters
                            style="flex-wrap: nowrap;"
                            ma="2"
                            pa="2"
                          >
                            <v-col cols="3" class="flex-grow-0 flex-shrink-0">
                              <div>{{ pod.pod_name }}</div>
                            </v-col>
                            <v-col
                              cols="2"
                              style="min-width: 100px; max-width: 100%;"
                              class="flex-grow-0 flex-shrink-0"
                            >
                              <div>{{ pod.phase }}</div>
                            </v-col>
                            <v-col v-if="pod.phase!='Running'">
                              <div>Reason: {{pod.reason}}, Message: {{ pod.message}}</div>
                            </v-col>
                            <v-col
                              cols="2"
                              style="min-width: 100px; max-width: 100%;"
                              class="flex-grow-0 flex-shrink-0"
                            >
                              <div>{{ pod.starttime }}</div>
                            </v-col>
                            <v-col>
                              <div>
                                <a
                                  :href="`http://k8spod.haodai.net/?git=${pod.git_name}&pod=${pod.pod_name}`"
                                  target="_blank"
                                >Shell</a>
                              </div>
                            </v-col>

                            <!-- <v-col cols="4" style="min-width: 100px;" class="flex-grow-1 flex-shrink-1">
                          <div>{{ pod.node }}</div>
                            </v-col>-->
                          </v-row>
                          <!-- </v-card> -->
                        </div>
                      </div>
                      <!-- </v-card> -->
                    </v-container>
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
      pods: [],
      nopods: null
    };
  },
  created() {
    this.fetchProjects();
  },
  methods: {
    getpods(item) {
      this.pods = null;
      this.expanded = item.name;
      this.loading = true;
      let url = "/api/projects/" + item.name + "/pods";
      this.$GET(url)
        .then(json => json.data)
        .then(json => {
          this.pods = json;
          // this._config = JSON.parse(JSON.stringify(this.config));
          // this.notify = {
          //   color: "success",
          //   msg: "got " + this.pods.length + " pods ok"
          // };

          // console.log("got pods: ", JSON.stringify(this.pods, null, " "));
          this.loading = false;
          this.nopods = false;
        })
        .catch(err => {
          this.loading = false;

          if (err.code == 2) {
            this.nopods = true;
            return;
          }
          // console.log("getinfos err", err);
          this.notify = { color: "error", msg: err.message };
        });
    },
    hidepods() {
      this.expanded = "";
      this.pods = [];
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
