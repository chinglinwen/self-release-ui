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
        <v-btn left color="primary" dark v-on="on" @click="opensetting">Set</v-btn>
      </template>

      <v-card>
        <v-btn @click="dialog = false">
          <v-icon>arrow_back_ios</v-icon>
        </v-btn>
        <v-card-title outline>
          <span class="headline">Resource Binding for project: {{ project.name }}</span>
        </v-card-title>

        <v-tabs v-model="tab" background-color="deep-purple accent-2" class="elevation-0" dark>
          <!-- <v-tabs-slider></v-tabs-slider> -->

          <v-tab
            v-for="env in envlist"
            :key="env"
            @click="changeTab(env)"
            :href="`#${env}`"
          >{{ env }}</v-tab>

          <v-tab-item v-for="env in envlist" :key="env" :value="env">
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

              <!--           
          <v-row>
            <div class="d-flex">
              <v-select
                @change="updateselect"
                :items="envlist"
                label="deploy env select"
                name="item"
                outlined
                v-model="env"
              ></v-select>
            </div>
              </v-row>-->

              <Env
                :existItems="x.existEnvs"
                :items="envs"
                @add:item="envsSubmit"
                @delete:item="envsDelete"
              />

              <Mysql
                :existItems="x.existMysql"
                :items="mysqlinfo"
                @add:item="mysqlSubmit"
                @delete:item="mysqlDelete"
              />

              <Redis
                :existItems="x.existRedis"
                :items="redisinfo"
                @add:item="redisSubmit"
                @delete:item="redisDelete"
              />

              <Nfs
                :existItems="x.existNfs"
                :items="nfsinfo"
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

              <v-progress-linear
                v-if="loading"
                color="blue accent-4"
                indeterminate
                rounded
                height="2"
              ></v-progress-linear>

              <v-flex ma="5">
                <v-snackbar
                  v-if="notify"
                  v-model="notify"
                  :bottom="true"
                  :color="notify.color"
                  :multi-line="true"
                  :right="true"
                  :timeout="5000"
                >
                  {{ notify.msg }}
                  <v-btn dark text @click="notify = false">Close</v-btn>
                </v-snackbar>
              </v-flex>
            </v-card-text>
          </v-tab-item>
        </v-tabs>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import axios from "axios";

import Mysql from "./resource/Mysql";
import Env from "./resource/Env";
import Redis from "./resource/Redis";
import Nfs from "./resource/Nfs";
import { debuglog } from "util";
export default {
  components: {
    Mysql,
    Redis,
    Nfs,
    Env
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

    infos: {},

    notify: null,
    // notify: {
    //   color: null,
    //   msg: null
    // },

    // isokay: null,
    // okay: null,

    //deploy env
    tab: "online",
    // env: 0,
    // tabs: 3,
    envlist: ["online", "pre", "test"],

    x: {
      existMysql: {},
      existEnvs: {},
      existRedis: {},
      existNfs: {},
      _existMysql: {},
      _existEnvs: {},
      _existRedis: {},
      _existNfs: {}
    },
    _x: {},

    all: {
      online: {},
      pre: {},
      test: {}
    },
    // existResource: {},

    // cache

    // see if need update
    updated: false,
    loading: false,

    envs: [],
    mysqlinfo: [],
    // [
    //   {
    //     id: 0,
    //     name: "10-107-3307-liuliang",
    //     // the following are secret keys, not env value
    //     host: "host1",
    //     port: "port1",
    //     database: "database",
    //     username: "username",
    //     password: "password"
    //   },
    //   {
    //     id: 0,
    //     name: "10-107-3307-liuliang2",
    //     host: "host2",
    //     port: "port2",
    //     database: "database",
    //     username: "username",
    //     password: "password"
    //   },
    //   {
    //     id: 0,
    //     name: "10-107-3307-liuliang3",
    //     host: "host2",
    //     port: "port2",
    //     database: "database",
    //     username: "username",
    //     password: "password"
    //   },
    //   {
    //     id: 0,
    //     name: "10-107-3307-liuliang4",
    //     host: "host2",
    //     port: "port2",
    //     database: "database",
    //     username: "username",
    //     password: "password"
    //   }
    // {
    //   id: 0,
    //   name: "aa",
    //   host: "",
    //   port: ""
    // }
    // ],
    redisinfo: [],
    // [
    //   {
    //     id: 0,
    //     name: "Redis-proxy-flow-center-loanapi.Redis-cluster",
    //     host: "Redis-proxy-flow-center-loanapi.Redis-cluster",
    //     port: "19000"
    //   }
    // ],
    nfsinfo: [
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

    let namewithpath = this.project.name.split("/");
    this.ns = namewithpath[0];
    this.name = namewithpath[1];

    console.log("ns: ", this.ns, ", project: ", this.name);
  },
  // get projects exist resources
  methods: {
    changeTab(env) {
      console.log("changed to env key: ", env);
      // console.log("changed to tab: ", this.tab, "env:", this.envlist[this.tab]);

      console.log("online: ", this.all.online);
      console.log("pre: ", this.all.pre);
      console.log("test: ", this.all.test);

      this.x = this.all[env];
      console.log("got x: ", this.x, "for env: ", env);

      // this.x._existEnvs = Object.assign({}, this.x.existEnvs);
      this._x = Object.assign({}, this.x);
    },
    opensetting() {
      this.getInfo();
      console.log("infos: ", this.infos);

      // this.resources = this.getResource(this.project);
      // let a = this.getResource(this.project);

      // this.all.online = convert(this.resources["online"]);
      //   this.all.pre = convert(this.resources["pre"]);
      //   this.all.test = convert(this.resources["test"]);
      //   this.x = this.all.online;
      //   this._x = Object.assign({}, this.x);

      let x = {
        existMysql: [],
        existEnvs: [],
        existRedis: [],
        existNfs: []
      };

      // need to initialied
      this.all.online = x;
      this.all.pre = x;
      this.all.test = x;
      this.x = x;
      this._x = Object.assign({}, this.x);

      // console.log("getResource: ", this.resources);

      fetch(
        "http://192.168.10.234:8089/api/projects/" +
          this.project.name +
          "/values"
      )
        .then(response => response.json())

        .then(json => {
          this.resources = json.data;
          // a = json;
          // console.log("get resource api: ", json.data);

          // await this.getResource(this.project);

          this.all.online = convert(this.resources["online"]);
          this.all.pre = convert(this.resources["pre"]);
          this.all.test = convert(this.resources["test"]);
          this.x = this.all.online;
          this._x = Object.assign({}, this.x);
        })
        .catch(error => {
          console.log("get resource api err", error);
        });
    },
    mysqlDelete(item) {
      this.x.existMysql = this.x.existMysql.filter(value => {
        return value.id != item.id;
      });
      this.updated = true;
    },
    mysqlSubmit(item) {
      console.log("add mysql", item);

      if (
        JSON.stringify(this.x._existMysql) == JSON.stringify(this.x.existMysql)
      ) {
        console.log("no need update mysql");
      }
      let a = this.x.existMysql.find(e => e.id === item.id);
      if (!a) {
        this.x.existMysql.push(Object.assign({}, item));
      }
      a = item;
      this.updated = true;
      this.x._existMysql = this.x.existMysql;
    },
    envsDelete(item) {
      this.x.existEnvs = this.x.existEnvs.filter(value => {
        return value.id != item.id;
      });
      this.updated = true;
    },
    envsSubmit(item) {
      console.log("add envs", item);
      if (
        JSON.stringify(this.x._existEnvs) == JSON.stringify(this.x.existEnvs)
      ) {
        console.log("no need update envs");
      }
      let a = this.x.existEnvs.find(e => e.id === item.id);
      if (!a) {
        this.x.existEnvs.push(Object.assign({}, item));
      }
      a = item;
      this.updated = true;
      this.x._existEnvs = this.x.existEnvs;
    },
    redisDelete(item) {
      this.x.existRedis = this.x.existRedis.filter(value => {
        return value.id != item.id;
      });
      this.updated = true;
    },
    redisSubmit(item) {
      console.log("add redis", item);
      if (
        JSON.stringify(this.x._existRedis) == JSON.stringify(this.x.existRedis)
      ) {
        console.log("no need update redis");
      }
      let a = this.x.existRedis.find(e => e.id === item.id);
      if (!a) {
        this.x.existRedis.push(Object.assign({}, item));
      }
      a = item;
      this.updated = true;
      this.x._existRedis = this.x.existRedis;
    },
    nfsDelete(item) {
      this.x.existNfs = this.x.existNfs.filter(value => {
        return value.id != item.id;
      });
      this.updated = true;
    },
    nfsSubmit(item) {
      console.log("add nfs", item);
      if (JSON.stringify(this.x._existNfs) == JSON.stringify(this.x.existNfs)) {
        console.log("no need update nfs");
      }

      let a = this.x.existNfs.find(e => e.id === item.id);
      if (!a) {
        this.x.existNfs.push(Object.assign({}, item));
      }
      a = item;
      this.updated = true;
      this.x._existNfs = this.x.existNfs;
    },
    getInfo() {
      console.log("fetching info in the background");
      fetch("http://192.168.10.234:8089/api/resources/" + this.ns)
        .then(response => response.json())
        // .then(json => (this.infos = json))
        .then(json => {
          console.log("infos", json);
          this.infos = json;

          this.mysqlinfo = json.mysql;
          this.redisinfo = json.codis;
        })
        .catch(error => {
          console.log("getinfos err", error);
        });

      fetch("http://192.168.10.234:8006/api/")
        .then(response => response.json())
        .then(json => {
          console.log("infos", json);
          this.nfsinfo = json.data;
        })
        .catch(error => {
          console.log("get nfs infos err", error);
        });
      return;
    },
    // should be api call
    getResource(project) {
      // let namewithpath = this.project.name.split("/");
      // let ns = namewithpath[0];

      // const json = await fetch(
      //   "http://192.168.10.234:8089/api/projects/" +
      //     this.project.name +
      //     "/values"
      // ).then(response => response.json());
      // console.log(json);
      // debugger;
      // return json;

      // // let a = {};
      // return fetch(
      //   "http://192.168.10.234:8089/api/projects/" +
      //     this.project.name +
      //     "/values"
      // ).then(response => response.json());

      // .then(json => {
      //   // this.resources = json;
      //   a = json;
      //   console.log("get resource: ", json);
      // })
      // .catch(error => {
      //   console.log("get resource err", error);
      // });

      // let a = this.$GET(
      //   "http://192.168.10.234:8089/api/projects/" +
      //     this.project.name +
      //     "/values"
      // )
      //   .then(res => {
      //     this.resources = res;
      //   })
      //   .catch(e => {
      //     console.log("getResource err", e);
      //   });

      // "http://192.168.10.234:8089/api/resources/xindaiquan"
      // return json array
      return JSON.parse(_existResource);
      // debugger;
      // return a.data;
    },
    submitall() {
      let a = convertback(this.all);
      let url =
        // "http://192.168.10.234:8089/api/projects/${this.project.name}/values";
        "http://192.168.10.234:8089/api/projects/" +
        this.project.name +
        "/values";
      let data = JSON.stringify(a, replacer, 2);
      // console.log("all:", j);
      // console.log("need updateall:", this.updated);

      if (!this.updated) {
        this.notify = { color: "orange", msg: "there's no change" };
        return;
      }

      // call api
      this.loading = true;
      // update status

      // fetch(
      //   "http://192.168.10.234:8089/api/projects/" +
      //     this.project.name +
      //     "/values",
      //   {
      //     headers: {
      //       Accept: "application/json",
      //       "Content-Type": "application/json"
      //     },
      //     method: "post",
      //     body: j
      //   }
      // )
      //   .then(response => response.json())

      this.$POST(url, data)

        // console.log("done submit before err", this.err);

        // axios
        //   .post(
        //     "http://192.168.10.234:8089/api/projects/" +
        //       this.project.name +
        //       "/values"
        //   )

        // .then(res => {
        //   console.log("done submit");
        //   console.log("submit result", res);
        //   this.loading = false;

        //   if (res.code == 200) {
        //     this.notify = { color: "success", msg: "all saved" };

        //     // this.dialog = false;
        //   } else {
        //     this.notify = { color: "error", msg: res.message };
        //   }
        // })
        // .catch(err => {
        //   this.notify = true;
        //   // console.log(err.response.data);
        //   // console.log(err.response);

        //   this.notify = { color: "red", msg: "unknown errr " + err.message };
        // });

        .then(res => {
          console.log("done submit");
          console.log("submit result", res);
          this.loading = false;
          this.notify = { color: "success", msg: "all saved" };
        })
        .catch(err => {
          this.notify = { color: "error", msg: err.message };
        });
    }
    // getExistMysql() {
    //   let as = [];
    //   let mysql = this.x.existResource.mysql;
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

function convert(resources) {
  console.log("try convert for resource", resources);
  // if (!resources) {
  if (!resources || Object.keys(resources).length == 0) {
    let x = {
      existMysql: [],
      existEnvs: [],
      existRedis: [],
      existNfs: []

      // existMysql: null,
      // existEnvs: null,
      // existRedis: null,
      // existNfs: null
    };
    console.log("convert empty, return empty back", x);
    return x;
  }

  let existMysql = resources.mysql;
  if (existMysql) {
    existMysql.forEach((element, i) => {
      element.id = i + 1;
    });
  }
  console.log("exist mysql", existMysql);

  // envs
  let e = resources.envs;
  let envsKeys = Object.keys(e);
  let envs = [];
  for (let i = 0; i < envsKeys.length; i++) {
    let a = {};
    a.name = envsKeys[i];
    a.value = e[envsKeys[i]];
    envs.push(a);
  }

  let existEnvs = envs;
  if (existEnvs) {
    existEnvs.forEach((element, i) => {
      element.id = i + 1;
    });
  }
  console.log("exist envs", existEnvs);

  // transform codis to array
  let r = resources.codis;
  let redisKeys = Object.keys(r);
  let redis = [];
  let a2 = {};
  for (let i = 0; i < redisKeys.length; i++) {
    if (i % 2 == 0) {
      a2 = {};
      a2.name = r[redisKeys[i]];
      a2.host = r[redisKeys[i]];
      a2.hostkey = redisKeys[i];
    } else {
      a2.port = r[redisKeys[i]];
      a2.portkey = redisKeys[i];
      redis.push(a2);
    }
  }

  // console.log("redis", redis);
  let existRedis = redis;
  if (existRedis) {
    existRedis.forEach((element, i) => {
      element.id = i + 1;
    });
  }
  console.log("exist redis", existRedis);

  // nfs
  let existNfs = resources.nfs;
  if (existNfs) {
    existNfs.forEach((element, i) => {
      element.id = i + 1;
    });
  }
  console.log("exist nfs", existNfs);

  // this.x.existResource = resources;

  // for later to compare
  // this.x._existMysql = Object.assign({}, this.x.existMysql);
  // this.x._existEnvs = Object.assign({}, this.x.existEnvs);
  // this.x._existRedis = Object.assign({}, this.x.existRedis);
  // this.x._existNfs = Object.assign({}, this.x.existNfs);
  // envResource

  let x = {
    existMysql: existMysql,
    existEnvs: existEnvs,
    existRedis: existRedis,
    existNfs: existNfs
  };
  return x;
}

// may test,pre append to online?
function convertback(all) {
  let newall = {};
  console.log("try convertback json for sumbit");
  for (let x in all) {
    let envs = {};
    let redis = {};
    let e = all[x]["existEnvs"];
    if (e && e.length != 0) {
      for (let i = 0; i < e.length; i++) {
        envs[e[i].name] = e[i].value;
      }
      console.log("new envs", envs);
    }
    let r = all[x]["existRedis"];
    if (r && r.length != 0) {
      for (let i = 0; i < r.length; i++) {
        redis[r[i].hostkey] = r[i].host;
        redis[r[i].portkey] = r[i].port;
      }
      console.log("new redis", redis);
    }
    let a = {
      envs: envs,
      codis: redis,
      mysql: all[x]["existMysql"],
      nfs: all[x]["existNfs"]
    };
    newall[x] = a;
  }
  // console.log("newall:", newall);
  return newall;
}

// ignore field start with underscore
function replacer(key, value) {
  if (key.indexOf("_") == 0) return undefined;
  else return value;
}
// var _existResource = `{
//   "online": {
//     "envs": {
//         "EXAMPLE-KEYdemo": "EXAMPLE-valuedemo"
//     },
//     "mysql": [
//         {
//           "name": "10-107-3307-liuliang",
//           "host": "DB_HOSTdemo",
//           "port": "DB_PORT",
//           "database": "DB_DATABASE",
//           "username": "DB_USERNAME",
//           "password": "DB_PASSWORD"
//         }
//     ],
//     "codis": {

//     },
//     "nfs": [

//     ]
//   }
// }`;

// var _existResource2 = `{
//   "online": {
//     "envs": {
//         "EXAMPLE-KEY": "EXAMPLE-value"
//     },
//     "mysql": [
//         {
//           "name": "10-107-3307-liuliang",
//           "host": "DB_HOST",
//           "port": "DB_PORT",
//           "database": "DB_DATABASE",
//           "username": "DB_USERNAME",
//           "password": "DB_PASSWORD"
//         }
//     ],
//     "codis": {
//         "SESSION_REDIS_HOST": "codis-proxy-flow-center-loanapi.codis-cluster",
//         "SESSION_REDIS_PORT": "19000",
//         "REDIS_HOST": "192.168.10.99",
//         "REDIS_PORT": "7201"
//     },
//     "nfs": [
//         {
//           "name": "loanapi-public",
//           "path": "/data/staticfile_yjr/file_data/openapi",
//           "server": "172.31.83.26",
//           "mountPath": "/apps/loanapi/www/Publicdemo"
//         }
//     ]
//   }
// }`;
</script>