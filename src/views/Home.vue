<template>
  <!-- <HelloWorld /> -->
  <v-container grid-list-xl fluid>
    <v-layout row wrap>
      <v-flex lg sm12 xs12>
        <plain-table></plain-table>
      </v-flex>
      <!-- <v-flex lg5 sm12 xs12>
          <plain-table-order></plain-table-order>
      </v-flex>-->
    </v-layout>
  </v-container>
</template>

<script>
import PlainTable from "../components/PlainTable";

export default {
  components: {
    PlainTable
  }
};
</script>
