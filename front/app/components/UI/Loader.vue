<template>
  <v-overlay :value="show" z-index="1000">
    <v-card color="primary" dark>
      <v-card-text>
        Fetching Data...
        <v-progress-linear
          indeterminate
          color="white"
          class="mb-0"
        ></v-progress-linear>
      </v-card-text>
    </v-card>
  </v-overlay>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      default: 'Fetching Data...',
    },
  },
}
</script>
