<template>
  <v-row>
    <v-col cols="12">
      <v-alert prominent text color="info">
        <h1 class="text-center my-lg-8">Search in dockerhub</h1>
      </v-alert>
    </v-col>

    <v-col cols="12">
      <v-card class="mx-auto" elevation="0" max-width="600">
        <v-form ref="searchForm" @submit.prevent="onSearch">
          <v-card-text>
            <v-text-field
              outlined
              dense
              name="term"
              label="Term"
              :rules="termRules"
              v-model="term"
              type="text"
              prepend-icon="mdi-search-web"
              @click:prepend="onSearch"
            />
            <!-- <v-btn type="submit" color="info">Search</v-btn> -->
          </v-card-text>
          <v-card-actions> </v-card-actions>
        </v-form>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-data-table
        :headers="headers"
        :items="images"
        class="elevation-1"
        hide-default-footer
        disable-pagination
      >
        <template v-slot:item.description="{ item }">
          <p class="pa-3">{{ item.description }}</p>
        </template>
        <template v-slot:item.is_automated="{ item }">
          <v-icon color="success" v-if="item.is_automated">
            mdi-check-circle
          </v-icon>
          <v-icon color="error" v-else> mdi-minus-circle </v-icon>
        </template>
        <template v-slot:item.is_official="{ item }">
          <v-icon color="success" v-if="item.is_official">
            mdi-check-circle
          </v-icon>
          <v-icon color="error" v-else> mdi-minus-circle </v-icon>
        </template>
        <template v-slot:item.pull="{ item }">
          <v-btn icon @click="onPull(item.name)">
            <v-icon color="info"> mdi-download </v-icon>
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
      term: '',
      images: [],
      headers: [
        { text: 'name', value: 'name', sortable: false },
        { text: 'description', value: 'description', sortable: false },
        { text: 'official', value: 'is_official', sortable: false },
        { text: 'automated', value: 'is_automated', sortable: false },
        { text: 'stars', value: 'star_count', sortable: false },
        { text: 'pull', value: 'pull', sortable: false },
      ],
      showLoader: false,
    }
  },
  computed: {
    termRules() {
      const rules = [
        (this.term.length >= 2 && this.term.length <= 30) ||
          'This fieled must be a string between 2 and 30 characters',
      ]
      return rules
    },
  },
  mounted() {},
  methods: {
    onSearch() {
      if (this.$refs.searchForm.validate()) {
        this.showLoader = true
        this.$axios
          .$get(`/image/search?term=${this.term}`)
          .then(({ data }) => {
            this.images = data
          })
          .catch((err) => console.error(err))
          .finally(() => (this.showLoader = false))
      }
    },
    onPull(name) {
      this.showLoader = true
      this.$axios
        .$post(`/image/create/${name}`)
        .then((data) => {
          this.$toast.success(data.data.status)
        })
        .catch((err) => console.error(err))
        .finally(() => (this.showLoader = false))
    },
    // imageId(id) {
    //   return id.split(':')[1].slice(0, 12)
    // },
    // humanSize(size) {
    //   if (size < 1024) return `${size.toLocaleString()} MB`
    //   if (size < 1024 * 1024) return `${(size / 1000).toLocaleString()} KB`
    //   if (size < 1024 * 1024 * 1024)
    //     return `${(size / 1e6).toLocaleString()} MB`
    //   return `${(size / 1e9).toLocaleString()} GB`
    // },
    // repo(RepoTags) {
    //   return RepoTags[0].split(':')[0]
    // },
    // tag(RepoTags) {
    //   return RepoTags[0].split(':')[1]
    // },
  },
}
</script>
