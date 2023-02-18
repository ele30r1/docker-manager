<template>
  <v-row v-if="container">
    <v-col cols="12">
      <v-alert prominent text color="warning">
        <h1 class="text-center my-lg-8">Container details</h1>
      </v-alert>
    </v-col>

    <v-col cols="12" class="text-center mb-8">
      <v-btn
        :disabled="status.label !== 'exited'"
        class="ml-4"
        @click="onStart"
        color="error"
      >
        start
      </v-btn>
      <v-btn
        :disabled="status.label !== 'running'"
        class="ml-4"
        @click="onPause"
        color="error"
      >
        pause
      </v-btn>
      <v-btn
        :disabled="status.label !== 'paused'"
        class="ml-4"
        @click="onUnpause"
        color="error"
      >
        unpause
      </v-btn>

      <v-btn
        :disabled="status.label !== 'running'"
        class="ml-4"
        @click="onRestart"
        color="error"
      >
        restart
      </v-btn>
      <v-btn
        :disabled="status.label !== 'running'"
        class="ml-4"
        @click="onStop"
        color="error"
      >
        Stop
      </v-btn>
      <v-btn class="ml-4" @click="showCommitDialog = true" color="info">
        Commit
      </v-btn>
    </v-col>

    <v-col cols="12" md="4">
      <v-card elevation="0">
        <v-alert
          :icon="status.icon"
          prominent
          border="left"
          text
          :color="status.color"
        >
          <p class="mb-1">STATUS</p>
          <p class="mb-1 font-weight-bold" style="font-size: 0.9rem">
            {{ status.label }}
          </p>
        </v-alert>
      </v-card>
    </v-col>
    <v-col cols="12" md="4">
      <v-card elevation="0">
        <v-alert icon="mdi-timer" prominent border="left" text color="success">
          <p class="mb-1">STARTED AT</p>
          <p class="mb-1 font-weight-bold" style="font-size: 0.9rem">
            {{ prettyDate(container.State.StartedAt) }}
          </p>
        </v-alert>
      </v-card>
    </v-col>
    <v-col cols="12" md="4">
      <v-card elevation="0">
        <v-alert
          icon="mdi-router-network"
          prominent
          border="left"
          text
          color="success"
        >
          <p class="mb-1">Network Mode</p>
          <p class="mb-1 font-weight-bold" style="font-size: 0.9rem">
            {{ container.HostConfig.NetworkMode }}
          </p>
        </v-alert>
      </v-card>
    </v-col>

    <v-col cols="12" md="4">
      <v-row>
        <v-col cols="12">
          <v-card elevation="0">
            <v-alert
              icon="mdi-docker"
              prominent
              border="left"
              text
              color="info"
            >
              <p class="mb-1">Container ID</p>
              <p class="mb-1 font-weight-bold" style="font-size: 0.9rem">
                {{ container.Id | truncate }}
              </p>
            </v-alert>
          </v-card>
        </v-col>

        <v-col cols="12">
          <v-card elevation="0">
            <v-alert icon="mdi-ferry" prominent border="left" text color="info">
              <p class="mb-1">Image</p>
              <p class="mb-1 font-weight-bold" style="font-size: 0.9rem">
                {{ imageId(container.Image) | truncate }}
              </p>
            </v-alert>
          </v-card>
        </v-col>

        <v-col cols="12">
          <v-card elevation="0">
            <v-alert
              icon="mdi-laptop"
              prominent
              border="left"
              text
              color="info"
            >
              <p class="mb-1">Host Name</p>
              <p class="mb-1 font-weight-bold" style="font-size: 0.9rem">
                {{ container.Config.Hostname }}
              </p>
            </v-alert>
          </v-card>
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="12" md="4">
      <v-row>
        <v-col cols="12">
          <v-card elevation="0">
            <v-alert
              icon="mdi-door-sliding"
              prominent
              border="left"
              text
              color="info"
            >
              <p class="mb-1">Entrypoint</p>
              <p class="mb-1 font-weight-bold" style="font-size: 0.9rem">
                {{ entrypoint(container.Config.Entrypoint) }}
              </p>
            </v-alert>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card elevation="0">
            <v-alert icon="mdi-xml" prominent border="left" text color="info">
              <p class="mb-1">CMD</p>
              <p class="mb-1 font-weight-bold" style="font-size: 0.9rem">
                {{ cmd(container.Config.Cmd) }}
              </p>
            </v-alert>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card elevation="0">
            <v-alert
              icon="mdi-router"
              prominent
              border="left"
              text
              color="info"
            >
              <p class="mb-1">Ports</p>

              <p
                v-for="(item, key) in ports"
                :key="key"
                class="mb-1 font-weight-bold"
                style="font-size: 0.9rem"
              >
                {{ item }}
              </p>
            </v-alert>
          </v-card>
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="12" md="4">
      <v-card dark>
        <v-card-title class="white--text">
          STATS
          <v-spacer></v-spacer>
        </v-card-title>

        <v-card-text class="pt-4">
          <v-simple-table v-if="stats">
            <tbody>
              <tr>
                <td>PIDS</td>
                <td>{{ stats.pids.toLocaleString() }}</td>
              </tr>
              <tr>
                <td>MEM USAGE</td>
                <td>
                  {{
                    `${humanSize(stats.used_memory)} / ${humanSize(
                      stats.available_memory
                    )}`
                  }}
                </td>
              </tr>
              <tr>
                <td>CPU USAGE</td>
                <td>
                  {{ `${stats.cpuUsage}` }}
                </td>
              </tr>
              <tr></tr>
            </tbody>
          </v-simple-table>
          <v-progress-circular
            v-else
            indeterminate
            color="white"
          ></v-progress-circular>
        </v-card-text>
      </v-card>
    </v-col>

    <v-dialog
      v-model="showCommitDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="showCommitDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Create a new image from container</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card elevation="0" max-width="600" class="mt-8 mx-auto">
          <v-form ref="commitForm" @submit.prevent="onCommit">
            <v-card-text>
              <v-text-field
                outlined
                dense
                label="repo"
                :rules="repoRules"
                v-model="commitData.repo"
                type="text"
              />
              <v-text-field
                outlined
                dense
                label="tag"
                :rules="tagRules"
                v-model="commitData.tag"
                type="text"
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn type="submit" color="info">commit</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-card>
    </v-dialog>
    <loader :show="showLoader" />
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      container: undefined,
      stats: undefined,
      statsTimer: undefined,
      commitData: {
        repo: '',
        tag: '',
      },
      showCommitDialog: false,
      showLoader: false,
    }
  },
  computed: {
    repoRules() {
      const rules = [
        (this.commitData.repo.length >= 2 &&
          this.commitData.repo.length <= 30) ||
          'This fieled must be a string between 2 and 30 characters',
      ]
      return rules
    },
    tagRules() {
      const rules = [
        (this.commitData.tag.length >= 2 && this.commitData.tag.length <= 30) ||
          'This fieled must be a string between 2 and 30 characters',
      ]
      return rules
    },
    status() {
      if (this.container?.State?.Status === 'running') {
        return {
          label: 'running',
          icon: 'mdi-run-fast',
          color: 'success',
        }
      }

      if (this.container?.State?.Status === 'paused') {
        return {
          label: 'paused',
          icon: 'mdi-pause-circle',
          color: 'warning',
        }
      }

      if (this.container?.State?.Status === 'exited') {
        return {
          label: 'exited',
          icon: 'mdi-close-octagon',
          color: 'error',
        }
      }

      return {
        label: 'unknown',
        icon: 'mdi-crosshairs-question',
        color: 'warning',
      }
    },
    ports() {
      try {
        const ports = []
        for (const [key1, item1] of Object.entries(
          this.container.NetworkSettings.Ports
        )) {
          item1.forEach((item2, key2) => {
            if (item2.HostIp !== '::')
              ports.push(`${item2.HostIp}:${item2.HostPort} -> ${key1}`)
          })
        }

        return ports
      } catch (e) {
        console.log(e)
        return []
      }
    },
  },
  mounted() {
    this.showLoader = true
    this.fetchData()
      .then(() => this.setStatsTimer())
      .catch((err) => console.error(err))
      .finally(() => (this.showLoader = false))
  },
  destroyed() {
    this.clearStatsTimer()
  },
  methods: {
    clearStatsTimer() {
      if (this.statsTimer) {
        clearInterval(this.statsTimer)
        this.statsTimer = undefined
      }
    },
    setStatsTimer() {
      this.clearStatsTimer()
      this.statsTimer = setInterval(() => {
        this.fectStats()
      }, 5000)
    },
    fetchData() {
      return this.$axios
        .$get(`/container/${this.$route.params.id}`)
        .then(({ data: { container } }) => {
          this.container = container
        })
    },
    fectStats() {
      return this.$axios
        .$get(`/container/${this.$route.params.id}/stats`)
        .then(({ data }) => {
          try {
            this.stats = {}

            // Memory
            this.stats.used_memory =
              data.memory_stats.usage - (data.memory_stats.stats?.cache ?? 0)
            this.stats.available_memory = data.memory_stats.limit
            this.stats.MemoryUsage =
              (this.stats.used_memory / this.stats.available_memory) * 100

            this.stats.MemoryUsage =
              this.stats.MemoryUsage.toLocaleString() + '%'

            // CPU
            const cpu_delta =
              data.cpu_stats.cpu_usage.total_usage -
              data.precpu_stats.cpu_usage.total_usage
            const system_cpu_delta =
              data.cpu_stats.system_cpu_usage -
              (data.precpu_stats.system_cpu_usage ?? 0)
            const number_cpus = data.cpu_stats.online_cpus
            this.stats.cpuUsage =
              (cpu_delta / system_cpu_delta) * number_cpus * 100

            this.stats.cpuUsage = this.stats.cpuUsage.toLocaleString() + '%'

            // stats
            this.stats.pids = data.pids_stats.current

            if (!this.stats.pids) {
              this.stats = {
                used_memory: 0,
                available_memory: 0,
                MemoryUsage: '0%',
                cpuUsage: '0%',
                pids: 0,
              }
            }
          } catch (err) {
            this.stats = {
              used_memory: 0,
              available_memory: 0,
              MemoryUsage: '0%',
              cpuUsage: '0%',
              pids: 0,
            }
          }
        })
    },
    humanSize(size) {
      if (size < 1024) return `${size.toLocaleString()} MB`
      if (size < 1024 * 1024) return `${(size / 1000).toLocaleString()} KB`
      if (size < 1024 * 1024 * 1024)
        return `${(size / 1e6).toLocaleString()} MB`
      return `${(size / 1e9).toLocaleString()} GB`
    },
    containerName(names) {
      return names[0].slice(1)
    },
    containerId(id) {
      return truncate(id, 12)
    },
    imageId(id) {
      return id.split(':')[1]
    },
    entrypoint(e) {
      try {
        return e.join(' ')
      } catch (err) {
        return ''
      }
    },
    cmd(c) {
      try {
        return c.join(' ')
      } catch (err) {
        return ''
      }
    },
    prettyDate(date) {
      const targetDate = new Date(date)
      const options = {
        hour: 'numeric',
        minute: 'numeric',
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      }
      return new Intl.DateTimeFormat('en-US', options).format(targetDate)
    },
    onStart() {
      this.showLoader = true
      this.$axios
        .$get(`/container/${this.$route.params.id}/action/start`)
        .then(() => this.fetchData())
        .catch((err) => {
          console.error(err)
        })
        .finally(() => (this.showLoader = false))
    },
    onPause() {
      this.showLoader = true
      this.$axios
        .$get(`/container/${this.$route.params.id}/action/pause`)
        .then(() => this.fetchData())
        .catch((err) => {
          console.error(err)
        })
        .finally(() => (this.showLoader = false))
    },
    onUnpause() {
      this.showLoader = true
      this.$axios
        .$get(`/container/${this.$route.params.id}/action/unpause`)
        .then(() => this.fetchData())
        .catch((err) => {
          console.error(err)
        })
        .finally(() => (this.showLoader = false))
    },
    onRestart() {
      this.showLoader = true
      this.$axios
        .$get(`/container/${this.$route.params.id}/action/restart`)
        .then(() => this.fetchData())
        .catch((err) => {
          console.error(err)
        })
        .finally(() => (this.showLoader = false))
    },
    onStop() {
      this.showLoader = true
      this.$axios
        .$get(`/container/${this.$route.params.id}/action/stop`)
        .then(() => this.fetchData())
        .catch((err) => {
          console.error(err)
        })
        .finally(() => (this.showLoader = false))
    },
    onCommit() {
      if (this.$refs.commitForm.validate()) {
        console.log(this.container.Id, this.commitData)

        this.showLoader = true
        this.$axios
          .$post(
            `/container-commit/${this.container.Id}/${this.commitData.repo}/${this.commitData.tag}`
          )
          .then(({ data }) => {
            this.$toast.success('action success')
            this.commitData = {
              repo: '',
              tag: '',
            }
            this.showCommitDialog = false
          })
          .catch((err) => console.error(err))
          .finally(() => (this.showLoader = false))
      }
    },
  },
}
</script>
