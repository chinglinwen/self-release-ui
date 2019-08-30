<template>
  <v-container grid-list-xl fluid>
    <v-layout row wrap>
      <v-flex lg sm12 xs12>
        <projects />
      </v-flex>
      <!-- <v-flex lg5 sm12 xs12>
          <plain-table-order></plain-table-order>
      </v-flex>-->
    </v-layout>
  </v-container>
</template>

<script>
import Projects from "../components/Projects";

export default {
  components: {
    Projects
  }
};
</script>
