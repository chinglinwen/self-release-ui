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
          <v-tab
            v-for="env in envlist"
            :key="env"
            @click="changeTab(env)"
            :href="`#${env}`"
          >{{ env }}</v-tab>

          <v-tab-item v-for="env in envlist" :key="env" :value="env">
            <v-card-text>
              <Env :existItems="x.existEnvs" @add:item="envsSubmit" @delete:item="envsDelete" />

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

              <v-card-actions>
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
    // mysql: {},

    dialog: false,

    notify: null,
    //deploy env
    tab: "online",
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

    infos: {},
    // envsinfo: [],
    mysqlinfo: [],
    redisinfo: [],
    nfsinfo: []
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

      this._x = Object.assign({}, this.x);
    },
    opensetting() {
      this.getInfo();
      console.log("infos: ", this.infos);

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

      fetch(
        "http://192.168.10.234:8089/api/projects/" +
          this.project.name +
          "/values"
      )
        .then(response => response.json())

        .then(json => {
          this.resources = json.data;
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
        "http://192.168.10.234:8089/api/projects/" +
        this.project.name +
        "/values";
      let data = JSON.stringify(a, replacer, 2);

      if (!this.updated) {
        this.notify = { color: "orange", msg: "there's no change" };
        return;
      }

      // call api
      this.loading = true;
      this.$POST(url, data)
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
</script>