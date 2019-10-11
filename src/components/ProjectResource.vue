<template>
  <!-- <v-row justify="center"> -->
  <!-- <v-row >  -->
  <v-dialog
    justify="center"
    v-model="dialog"
    persistent
    max-width="600px"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on }">
      <!-- <div>
        <v-btn left class="d-inline" color="primary" dark v-on="on" @click="opensetting">Set</v-btn>
      </div>-->

      <v-chip color="blue" dark v-on="on" @click="opensetting">资源设置</v-chip>

      <!-- <div pa="0" ma="0" class="d-inline" v-on="on" @click="opensetting">Set</div> -->
    </template>

    <v-card>
      <v-btn @click="close">
        <v-icon>arrow_back_ios</v-icon>
      </v-btn>
      <v-card-title outline>
        <span class="headline">Resource Binding for project: {{ project.name }}</span>
        <v-spacer></v-spacer>
        <Yaml :project="project" :envlist="envlist" />
      </v-card-title>

      <v-tabs v-model="tab" background-color="deep-purple accent-2" class="elevation-0" dark>
        <v-tab v-for="env in envlist" :key="env" @click="changeTab(env)" :href="`#${env}`">{{ env }}</v-tab>

        <v-tab-item v-for="env in envlist" :key="env" :value="env">
          <v-card-text>
            <!-- <v-row v-if="env=='online'">nodePort: 80</v-row> -->
            <!-- <v-row>nodePort {{env}}</v-row> -->

            <Config :env="env" :existConfig="x.existConfig" @add:item="configSubmit" />

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
              <v-btn color="blue darken-1" text @click="close">Close</v-btn>
              <v-btn :disabled="submitting" color="blue darken-1" text @click="submitall">Save All</v-btn>
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
                :timeout="notify.timeout"
              >
                {{ notify.msg }}
                <v-btn pa="10" dark text @click="notify = false">Close</v-btn>
              </v-snackbar>
            </v-flex>
          </v-card-text>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </v-dialog>
  <!-- </v-row> -->
</template>

<script>
var nfssvcDomain = "http://nfssvc.newops.haodai.net";
import Mysql from "./resource/Mysql";
import Config from "./resource/Config";
import Env from "./resource/Env";
import Redis from "./resource/Redis";
import Nfs from "./resource/Nfs";

import Yaml from "./Yaml";

import { debuglog } from "util";
export default {
  components: {
    Mysql,
    Redis,
    Nfs,
    Env,
    Yaml,
    Config
  },
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    dialog: false,
    notify: null,
    //deploy env
    tab: "online",
    envlist: ["online", "pre", "test"],
    // existConfig: {
    //   nodePort: "30000",
    //   domain: "example.com",
    //   deploy: {
    //     replicas: 2
    //   }
    // },
    x: {
      existMysql: {},
      existEnvs: {},
      existRedis: {},
      existNfs: {}
    },
    all: {
      online: {},
      pre: {},
      test: {}
    },
    // cache to compare if updated
    _all: {},
    // form status
    loading: false,
    submitting: false,
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

    // console.log("ns: ", this.ns, ", project: ", this.name);
  },
  // get projects exist resources
  methods: {
    changeTab(env) {
      // console.log("changed to env key: ", env);
      // console.log("changed to tab: ", this.tab, "env:", this.envlist[this.tab]);

      // console.log("online: ", this.all.online);
      // console.log("pre: ", this.all.pre);
      // console.log("test: ", this.all.test);

      this.x = this.all[env];
      // console.log("got x: ", this.x, "for env: ", env);

      this.env = env;
    },
    opensetting() {
      this.getInfo();
      // console.log("infos: ", this.infos);
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
      // this._all = Object.assign({}, this.all);
      this._all = JSON.parse(JSON.stringify(this.all));

      this.$GET("/api/projects/" + this.project.name + "/values")
        .then(res => {
          this.resources = res.data;
          this.all.online = convert(this.resources["online"]);
          this.all.pre = convert(this.resources["pre"]);
          this.all.test = convert(this.resources["test"]);
          this.x = this.all.online;

          // create default values for all env (if not set before)
          if (!this.all.online.existConfig)
            this.all.online.existConfig = {
              nodePort: 0,
              domain: "",
              deploy: {
                replicas: 0
              },
              monitor: {
                address: ""
              }
            };
          if (!this.all.pre.existConfig)
            this.all.pre.existConfig = {
              nodePort: 0,
              domain: "",
              deploy: {
                replicas: 0
              },
              monitor: {
                address: ""
              }
            };
          if (!this.all.test.existConfig)
            this.all.test.existConfig = {
              nodePort: 0,
              domain: "",
              deploy: {
                replicas: 0
              },
              monitor: {
                address: ""
              }
            };

          // deep copy instead
          this._all = JSON.parse(JSON.stringify(this.all));
        })
        .catch(err => {
          // console.log("get resource api err", err);
          this.notify = { color: "error", msg: err.message, timeout: 86400 };
        });
    },
    close() {
      this.notify = null;
      this.dialog = false;
      this.loading = false;
    },
    mysqlDelete(item) {
      this.x.existMysql = this.x.existMysql.filter(value => {
        return value.id != item.id;
      });
      this.updated = true;
    },
    mysqlSubmit(item) {
      console.log("add mysql", item);
      let a = this.x.existMysql.find(e => e.id === item.id);
      if (!a) {
        this.x.existMysql.push(Object.assign({}, item));
      }
    },
    configSubmit(item) {
      console.log("add config", item);
      this.x.existConfig = item;
      // console.log("config json", JSON.stringify(item));
    },

    envsDelete(item) {
      this.x.existEnvs = this.x.existEnvs.filter(value => {
        return value.id != item.id;
      });
    },
    envsSubmit(item) {
      console.log("add envs", item);
      let a = this.x.existEnvs.find(e => e.id === item.id);
      if (!a) {
        this.x.existEnvs.push(Object.assign({}, item));
      }
    },
    redisDelete(item) {
      this.x.existRedis = this.x.existRedis.filter(value => {
        return value.id != item.id;
      });
    },
    redisSubmit(item) {
      console.log("add redis", item);
      let a = this.x.existRedis.find(e => e.id === item.id);
      if (!a) {
        this.x.existRedis.push(Object.assign({}, item));
      }
    },
    nfsDelete(item) {
      this.x.existNfs = this.x.existNfs.filter(value => {
        return value.id != item.id;
      });
    },
    nfsSubmit(item) {
      console.log("add nfs", item);
      let a = this.x.existNfs.find(e => e.id === item.id);
      if (!a) {
        this.x.existNfs.push(Object.assign({}, item));
      }
    },
    getInfo() {
      // console.log("fetching info in the background");
      this.$GET("/api/resources/" + this.ns)
        .then(json => json.data)
        .then(json => {
          // this.infos = json;
          this.mysqlinfo = json.mysql;
          this.redisinfo = json.codis;
        })
        .catch(err => {
          // console.log("getinfos err", err);
          this.notify = { color: "error", msg: err.message, timeout: 86400 };
        });

      // fetch("http://nfssvc.newops.haodai.net/api/")
      //   .then(response => response.json())

      this.$GET(nfssvcDomain + "/api/")

        .then(json => {
          this.nfsinfo = json.data;
        })
        .catch(err => {
          // console.log("get nfs infos err", err);
          this.notify = { color: "error", msg: err.message, timeout: 86400 };
        });
      return;
    },
    submitall() {
      if (JSON.stringify(this._all) == JSON.stringify(this.all)) {
        this.notify = { color: "orange", msg: "there's no change" };
        console.log("no need update all");
        return;
      }
      // prevent submitting during submitting
      this.submitting = true;

      let a = convertback(this.all);
      let url = "/api/projects/" + this.project.name + "/values";
      let data = JSON.stringify(a, replacer, 2);

      console.log("data:", data);

      // call api
      this.loading = true;
      this.$POST(url, data)
        .then(res => {
          console.log("done submit");
          console.log("submit result", res);
          this.loading = false;
          this.submitting = false;
          this.updated = false;
          this.notify = {
            color: "success",
            msg: "all saved",
            timeout: 50000
          };
          // deep copy instead
          this._all = JSON.parse(JSON.stringify(this.all));
        })
        .catch(err => {
          console.log("submit all err", err);
          this.loading = false;
          this.submitting = false;
          this.updated = false;
          this.notify = { color: "error", msg: err.message, timeout: 86400 };
        });
    }
  }
};

function convert(resources) {
  // console.log("try convert for resource", resources);
  let x = {
    existMysql: [],
    existEnvs: [],
    existRedis: [],
    existNfs: [],
    existConfig: resources.config
  };

  if (!resources || Object.keys(resources).length == 0) {
    console.log("convert empty, return empty back", x);
    return x;
  }

  let existMysql = resources.mysql;
  if (existMysql) {
    existMysql.forEach((element, i) => {
      element.id = i + 1;
    });

    console.log("exist mysql", existMysql);
    x.existMysql = existMysql;
  }

  // envs
  let e = resources.envs;
  if (e && e.length != 0) {
    let envsKeys = Object.keys(e);
    let envs = [];
    for (let i = 0; i < envsKeys.length; i++) {
      let a = {};
      a.name = envsKeys[i];
      a.value = e[envsKeys[i]];
      envs.push(a);
    }

    x.existEnvs = envs;
    if (x.existEnvs) {
      x.existEnvs.forEach((element, i) => {
        element.id = i + 1;
      });
    }
    console.log("exist envs", x.existEnvs);
  }
  // transform codis to array
  let r = resources.codis;
  if (r && r.length != 0) {
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
    x.existRedis = redis;
    if (x.existRedis) {
      x.existRedis.forEach((element, i) => {
        element.id = i + 1;
      });
    }
    console.log("exist redis", x.existRedis);
  }
  // nfs
  let existNfs = resources.nfs;
  if (existNfs) {
    existNfs.forEach((element, i) => {
      element.id = i + 1;
    });
    console.log("exist nfs", existNfs);
    x.existNfs = existNfs;
  }
  return x;
}

// may test,pre append to online?
function convertback(all) {
  let newall = {};
  // console.log("try convertback json for sumbit");
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
      nfs: all[x]["existNfs"],
      config: all[x]["existConfig"]
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