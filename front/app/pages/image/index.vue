<template>
  <v-row>
    <v-col cols="12">
      <v-alert prominent text color="info">
        <h1 class="text-center my-lg-8">Images</h1>
      </v-alert>
    </v-col>

    <v-col cols="12">
      <v-data-table
        :headers="headers"
        :items="images"
        class="elevation-1"
        hide-default-footer
        disable-pagination
      >
        <template v-slot:item.repo="{ item }">
          {{ repo(item.RepoTags, item.RepoDigests) }}
        </template>
        <template v-slot:item.tag="{ item }">
          {{ tag(item.RepoTags) }}
        </template>
        <template v-slot:item.id="{ item }">
          {{ imageId(item.Id) }}
        </template>
        <template v-slot:item.size="{ item }">
          {{ humanSize(item.Size) }}
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
        { text: 'REPOSITORY', value: 'repo', sortable: false },
        { text: 'TAG', value: 'tag', sortable: false },
        { text: 'size', value: 'size', sortable: false },
        { text: 'id', value: 'id', sortable: false },
      ],
      showLoader: false,
      images: [],
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
      return this.$axios.$get(`/image`).then(({ data: { images } }) => {
        this.images = images
      })
    },
    imageId(id) {
      return id.split(':')[1].slice(0, 12)
    },
    humanSize(size) {
      if (size < 1024) return `${size.toLocaleString()} MB`
      if (size < 1024 * 1024) return `${(size / 1000).toLocaleString()} KB`
      if (size < 1024 * 1024 * 1024)
        return `${(size / 1e6).toLocaleString()} MB`
      return `${(size / 1e9).toLocaleString()} GB`
    },
    repo(RepoTags, RepoDigests) {
      try {
        return RepoTags[0].split(':')[0]
      } catch (err) {
        return RepoDigests[0].split('@')[0]
      }
    },
    tag(RepoTags) {
      try {
        return RepoTags[0].split(':')[1]
      } catch (err) {
        return '<none>'
      }
    },
  },
}
</script>
