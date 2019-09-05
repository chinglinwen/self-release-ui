<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <template v-slot:activator="{ on }">
        <!-- <v-btn left text icon color="grey">
          <v-icon>mdi-settings</v-icon>
        </v-btn>-->
        <!-- <v-btn color="primary" dark v-on="on">Open Dialog</v-btn> -->
        <v-btn left color="primary" dark v-on="on">Set</v-btn>
      </template>
      <v-card>
        <v-btn @click="dialog = false">
          <v-icon>arrow_back_ios</v-icon>
        </v-btn>
        <v-card-title outline>
          <span class="headline">Resource Binding for project: {{ project.name }}</span>
        </v-card-title>

        <v-card-text>
          <!-- <v-row>
            <v-col v-for="resourceType in resourceTypes" :key="resourceType">
              <v-btn @click="selectedResource=resourceType">
                <v-icon>add</v-icon>
                {{ resourceType }}
              </v-btn>
            </v-col>
          </v-row>-->
          <!-- <v-container> -->
          <Mysql
            :existItems="existMysql"
            :items="mysqls"
            @add:item="mysqlSubmit"
            @delete:item="mysqlDelete"
          />

          <Redis
            :existItems="existRedis"
            :items="Redises"
            @add:item="redisSubmit"
            @delete:item="redisDelete"
          />

          <Nfs
            :existItems="existNfs"
            :items="nfses"
            @add:item="nfsSubmit"
            @delete:item="nfsDelete"
          />

          <!-- <Redis :items="Redises" />
          <Nfs :items="mysqls" />-->
          <!-- <Mysql :mysqls="mysqls" />
          <Mysql :mysqls="mysqls" />-->

          <!-- <v-card class="d-flex pa-2" outlined tile>
              <div>Mysql</div>
          </v-card>-->

          <!-- <v-text-field :label="field.label" :value="field.model"></v-text-field>-->

          <!-- show all mysql first -->
          <!-- <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Legal first name*" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Legal middle name" hint="example of helper text only on focus"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  label="Legal last name*"
                  hint="example of persistent helper text"
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Email*" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Password*" type="password" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select :items="['0-17', '18-29', '30-54', '54+']" label="Age*" required></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-autocomplete
                  :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                  label="Interests"
                ></v-autocomplete>
              </v-col>
          </v-row>-->
          <!-- </v-container> -->
          <!-- <small>*indicates required field</small> -->

          <!-- <v-text-field v-if="loading" color="success" loading disabled></v-text-field> -->

          <!-- <v-progress-linear
          :active="loading"
          :indeterminate="loading"
          absolute
          bottom
          color="deep-purple accent-4"
          ></v-progress-linear>-->
          <v-card-actions>
            <!-- <div class="flex-grow-1"></div> -->
            <v-btn color="blue darken-1" text @click="dialog = false;loading=false">Close</v-btn>
            <v-btn color="blue darken-1" text @click="submitall">Save All</v-btn>
          </v-card-actions>

          <v-progress-linear v-if="loading" color="blue accent-4" indeterminate rounded height="2"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import Mysql from "./resource/Mysql";
import Redis from "./resource/Redis";
import Nfs from "./resource/Nfs";
import { debuglog } from "util";
export default {
  components: {
    Mysql,
    Redis,
    Nfs
  },
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    // resourceTypes: ["mysql", "Redis", "nfs"],
    selectedResource: "",
    showmysql: false,
    mysql: {},
    dialog: false,
    // existResource: {},
    existMysql: {},
    existRedis: {},
    existNfs: {},
    // cache
    _existMysql: {},
    _existRedis: {},
    _existNfs: {},

    // see if need update
    updated: false,
    loading: false,

    mysqls: [
      {
        id: 0,
        name: "10-107-3307-liuliang",
        // the following are secret keys, not env value
        host: "host1",
        port: "port1",
        database: "database",
        username: "username",
        password: "password"
      },
      {
        id: 0,
        name: "10-107-3307-liuliang2",
        host: "host2",
        port: "port2",
        database: "database",
        username: "username",
        password: "password"
      },
      {
        id: 0,
        name: "10-107-3307-liuliang3",
        host: "host2",
        port: "port2",
        database: "database",
        username: "username",
        password: "password"
      },
      {
        id: 0,
        name: "10-107-3307-liuliang4",
        host: "host2",
        port: "port2",
        database: "database",
        username: "username",
        password: "password"
      }
      // {
      //   id: 0,
      //   name: "aa",
      //   host: "",
      //   port: ""
      // }
    ],
    Redises: [
      {
        id: 0,
        name: "Redis-proxy-flow-center-loanapi.Redis-cluster",
        host: "Redis-proxy-flow-center-loanapi.Redis-cluster",
        port: "19000"
      }
    ],
    nfses: [
      {
        name: "loanapi-public",
        path: "/data/staticfile_yjr/file_data/openapi",
        server: "172.31.83.26",
        mountPath: "/apps/loanapi/www/Public"
      }
    ]
  }),
  created() {
    if (!this.project.name) this.project.name = "unknown";
    console.log("project", this.project);

    let resources = this.getResource("projecta");
    // mysql
    this.existMysql = resources.mysql;
    this.existMysql.forEach((element, i) => {
      element.id = i + 1;
    });

    // transform codis to array
    let r = resources.codis;
    let redisKeys = Object.keys(r);
    let redis = [];
    let a = {};
    for (let i = 0; i < redisKeys.length; i++) {
      if (i % 2 == 0) {
        a = {};
        a.name = r[redisKeys[i]];
        a.host = r[redisKeys[i]];
        a.hostkey = redisKeys[i];
      } else {
        a.port = r[redisKeys[i]];
        a.portkey = redisKeys[i];
        redis.push(a);
      }
    }
    // console.log("redis", redis);
    this.existRedis = redis;
    this.existRedis.forEach((element, i) => {
      element.id = i + 1;
    });
    // nfs
    this.existNfs = resources.nfs;
    this.existNfs.forEach((element, i) => {
      element.id = i + 1;
    });

    // this.existResource = resources;

    // for later to compare
    this._existMysql = Object.assign({}, this.existMysql);
    this._existRedis = Object.assign({}, this.existRedis);
    this._existNfs = Object.assign({}, this.existNfs);

    // debugger;
  },
  // get projects exist resources
  methods: {
    mysqlDelete(item) {
      this.existMysql = this.existMysql.filter(value => {
        return value.id != item.id;
      });
      this.updated = true;
    },
    mysqlSubmit(item) {
      console.log("add mysql", item);

      if (JSON.stringify(this._existMysql) == JSON.stringify(this.existMysql)) {
        console.log("no need update mysql");
      }
      let a = this.existMysql.find(e => e.id === item.id);
      if (!a) {
        this.existMysql.push(Object.assign({}, item));
      }
      a = item;
      this.updated = true;
      this._existMysql = this.existMysql;
    },
    redisDelete(item) {
      this.existRedis = this.existRedis.filter(value => {
        return value.id != item.id;
      });
      this.updated = true;
    },
    redisSubmit(item) {
      console.log("add redis", item);
      if (JSON.stringify(this._existRedis) == JSON.stringify(this.existRedis)) {
        console.log("no need update mysql");
      }
      let a = this.existRedis.find(e => e.id === item.id);
      if (!a) {
        this.existRedis.push(Object.assign({}, item));
      }
      a = item;
      this.updated = true;
      this._existRedis = this.existRedis;
    },
    nfsDelete(item) {
      this.existNfs = this.existNfs.filter(value => {
        return value.id != item.id;
      });
      this.updated = true;
    },
    nfsSubmit(item) {
      console.log("add nfs", item);
      if (JSON.stringify(this._existNfs) == JSON.stringify(this.existNfs)) {
        console.log("no need update mysql");
      }

      let a = this.existNfs.find(e => e.id === item.id);
      if (!a) {
        this.existNfs.push(Object.assign({}, item));
      }
      a = item;
      this.updated = true;
      this._existNfs = this.existNfs;
    },
    // should be api call
    getResource(project) {
      // return json array
      return JSON.parse(_existResource);
    },
    submitall() {
      let a = {};
      a.mysql = this.existMysql;
      a.codis = this.existRedis;
      a.nfs = this.existNfs;
      let j = JSON.stringify(a);
      console.log("all", j, "need update2:", this.updated);

      // call api
      this.loading = true;
      // update status

      setTimeout(function() {
        // alert("hello");
        this.loading = false;
        this.dialog = false;
      }, 3000);

      // this.dialog = false;
      this.updated = false;
      // this.loading = false;
    }
    // getExistMysql() {
    //   let as = [];
    //   let mysql = this.existResource.mysql;
    //   let name = "";
    //   console.log("existMysql", mysql, "length", mysql.length);
    //   for (let i = 0; i < mysql.length; i++) {
    //     name = mysql[i].secret;
    //     if (i == 0) {
    //       let a = {};
    //       a.name = name;
    //     }
    //     // console.log("mysql[i]:", );
    //     // console.log("a[secret]:", a[secret]);
    //     // console.log("a[mysql[i].secret]:", a[mysql[i].secret]);

    //     let key = mysql[i].key;
    //     // if (i == 0) {
    //     //   a[secret] = {};
    //     // }
    //     // a[secret] = a[secret][key] ? {} : a[secret];
    //     a[key] = mysql[i].name;
    //     as.push(a);
    //   }

    //   console.log("as", as);
    //   // debugger;
    //   return as;
    // }
  }
};

var _existResource = `{
   "envs": {
      "EXAMPLE-KEY": "EXAMPLE-value"
   },
   "mysql": [
      {
         "name": "10-107-3307-liuliang",
         "host": "DB_HOST",
         "port": "DB_PORT",
         "database": "DB_DATABASE",
         "username": "DB_USERNAME",
         "password": "DB_PASSWORD"
      }
   ],
   "codis": {
      "SESSION_REDIS_HOST": "codis-proxy-flow-center-loanapi.codis-cluster",
      "SESSION_REDIS_PORT": "19000",
      "REDIS_HOST": "192.168.10.99",
      "REDIS_PORT": "7201"
   },
   "nfs": [
      {
         "name": "loanapi-public",
         "path": "/data/staticfile_yjr/file_data/openapi",
         "server": "172.31.83.26",
         "mountPath": "/apps/loanapi/www/Public"
      }
   ]
}`;
</script>