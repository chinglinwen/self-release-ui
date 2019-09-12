<template>
  <div>
    <v-tabs
      v-model="tab"
      background-color="deep-purple accent-4"
      class="elevation-2"
      dark
      :centered="centered"
      :grow="grow"
      :vertical="vertical"
      :right="right"
      :prev-icon="prevIcon ? 'mdi-arrow-left-bold-box-outline' : undefined"
      :next-icon="nextIcon ? 'mdi-arrow-right-bold-box-outline' : undefined"
      :icons-and-text="icons"
    >
      <!-- <v-tabs-slider></v-tabs-slider> -->

      <v-tab v-for="i in tabs" :key="i" :href="`#tab-${i}`">
        Tab {{ i }}
        <v-icon v-if="icons">mdi-phone</v-icon>
      </v-tab>

      <v-tab-item v-for="i in tabs" :key="i" :value="'tab-' + i">
        <v-card flat tile>
          <v-card-text>{{ text }} {{ i }}</v-card-text>

          <v-container>
            <v-row>
              <v-layout>
                <v-flex md2 pa-2>
                  <v-text-field label="env key" v-model="item.name"></v-text-field>
                </v-flex>
                <v-flex md2 pa-2>
                  <v-text-field label="env value" v-model="item.value"></v-text-field>
                </v-flex>
                <v-flex md2 py-5>
                  <v-btn text>cancel</v-btn>
                  <v-btn text>save</v-btn>
                </v-flex>
              </v-layout>
            </v-row>
            <!-- <v-row class="float-right">
            <v-btn text @click="cancelCreate(item)">cancel</v-btn>
            <v-btn text @click="handleSubmit(item)">save</v-btn>
            </v-row>-->
          </v-container>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      item: {
        name: "hel",
        value: "val"
      },
      tab: null,
      text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      icons: false,
      centered: false,
      grow: false,
      vertical: false,
      prevIcon: false,
      nextIcon: false,
      right: false,
      tabs: 3
    };
  }
};
</script>