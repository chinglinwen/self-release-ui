<template>
  <v-card>
    <!-- <v-switch :loading="loading" label></v-switch> -->

    <v-toolbar card dense color="transparent">
      <v-toolbar-title>
        <h4>Projects</h4>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-text-field
        prepend-inner-icon="search"
        :label="search"
        clearable
        class="search"
        v-model.lazy="searchkey"
        @change="dosearch"
      ></v-text-field>-->
      <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
      <!-- <v-btn icon>
        <v-icon>search</v-icon>
      </v-btn>-->
      <!-- <v-btn icon>
        <v-icon>more_vert</v-icon>
      </v-btn>-->
    </v-toolbar>
    <v-divider></v-divider>
    <v-card-text class="pa-0">
      <template>
        <v-data-table :headers="headers" :items="projects" :search="search" class="elevation-0">
          <template slot="items" slot-scope="props">
            <!-- <td>
              <v-avatar size="36px">
                <img :src="props.item.avatar" :alt="props.item.username" />
              </v-avatar>
            </td>-->
            <td>{{ props.item.name }}</td>
            <td class="text-xs-left">
              <a :href="props.item.git">{{ props.item.git }}</a>
            </td>
            <td class="text-xs-left">
              <!-- <v-progress-linear :value="props.item.progress" height="5" :color="props.item.color"></v-progress-linear> -->
              <v-switch v-model="switch1" :label="`Switch 1: ${switch1.toString()}`"></v-switch>
              <!-- <v-switch v-model="props.item.state" :loading="loading" label></v-switch> -->
            </td>
            <td class="text-xs-right">
              <v-btn flat icon color="grey">
                <v-icon>edit</v-icon>
              </v-btn>
              <v-btn flat icon color="grey">
                <v-icon>delete</v-icon>
              </v-btn>
            </td>
          </template>
        </v-data-table>
      </template>
      <v-divider></v-divider>
    </v-card-text>
  </v-card>
</template>

<script>
// import { Projects } from "@/api/project"
export default {
  data() {
    return {
      loading: false,
      projects: [],
      search: "",
      headers: [
        // {
        //   text: "",
        //   align: "center",
        //   sortable: false,
        //   value: "avatar"
        // },
        {
          text: "Project",
          align: "left",
          value: "name"
        },
        { text: "Git Address", value: "git" },
        { text: "State", value: "state" },
        { text: "Action", value: "action", align: "right" }
      ]
    };
  },
  created() {
    fetch(
      // "http://fs.haodai.net/t/projects.json",
      // "https://jsonplaceholder.typicode.com/users",
      "http://192.168.10.234:8089/api/projects"
      // {
      //   mode: "cors"
      // }
    )
      .then(response => response.json())
      .then(json => (this.projects = json))
      // {
      //   // p = json
      //   // Projects.concat(json)
      //   // console.log("get before1 ok", Projects)
      //   // Projects = json
      //   // console.log("get after1 ok", Projects)
      //   this.projects = json
      // })
      .catch(error => console.log("getProjects err", error));
  },
  methods: {}
};
</script>
