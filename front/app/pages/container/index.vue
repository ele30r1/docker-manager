<template>
  <v-row>
    <v-col cols="12">
      <v-alert prominent text color="info">
        <h1 class="text-center my-lg-8">Containers</h1>
      </v-alert>
    </v-col>

    <v-col cols="12">
      <v-data-table
        :headers="headers"
        :items="containers"
        class="elevation-1"
        hide-default-footer
        disable-pagination
      >
        <!-- <template v-slot:item.repo="{ item }">
          {{ repo(item.RepoTags) }}
        </template>
        <template v-slot:item.tag="{ item }">
          {{ tag(item.RepoTags) }}
        </template>
        <template v-slot:item.id="{ item }">
          {{ imageId(item.Id) }}
        </template>
        <template v-slot:item.size="{ item }">
          {{ humanSize(item.Size) }}
        </template> -->
        <template v-slot:item.created_at="{ item }">
          {{ prettyDate(item.Created) }}
        </template>
        <template v-slot:item.State="{ item }">
          <v-chip :color="getStateColor(item.State)">
            {{ item.Status }}
          </v-chip>
        </template>
        <template v-slot:item.id="{ item }">
          {{ containerId(item.Id) }}
        </template>
        <template v-slot:item.name="{ item }">
          {{ containerName(item.Names) }}
        </template>
        <template v-slot:item.image="{ item }">
          {{ item.Image }}
        </template>
        <template v-slot:item.action="{ item }">
          <v-btn icon :to="`/container/${item.Id}`">
            <v-icon small> mdi-eye </v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-col>

    <loader :show="showLoader" />
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        { text: 'Names', value: 'name', sortable: false },
        { text: 'id', value: 'id', sortable: false },
        { text: 'image', value: 'image', sortable: false },
        { text: 'created_at', value: 'created_at', sortable: false },
        { text: 'command', value: 'Command', sortable: false },
        { text: 'state', value: 'State', sortable: false },
        { text: 'details', value: 'action', sortable: false },
      ],
      showLoader: false,
      containers: [],
    }
  },
  mounted() {
    this.showLoader = true
    this.fetchData()
      .catch((err) => console.error(err))
      .finally(() => (this.showLoader = false))
  },
  methods: {
    fetchData() {
      return this.$axios.$get(`/container`).then(({ data: { containers } }) => {
        this.containers = containers
      })
    },
    containerName(names) {
      return names[0].slice(1)
    },
    containerId(id) {
      return id.slice(0, 12)
    },
    imageId(id) {
      return id.split(':')[1].slice(0, 12)
    },
    getStateColor(state) {
      if (state === 'running') return 'success'
      if (state === 'exited') return 'error'

      return 'warning'
    },
    prettyDate(date) {
      const targetDate = new Date(date * 1000)
      const options = {
        hour: 'numeric',
        minute: 'numeric',
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      }
      return new Intl.DateTimeFormat('en-US', options).format(targetDate)
    },
  },
}
</script>
