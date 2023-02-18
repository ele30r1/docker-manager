<template>
  <v-app dark>
    <v-navigation-drawer
      clipped
      v-model="drawer"
      :mini-variant="miniVariant"
      fixed
      app
    >
      <v-list>
        <v-list-group v-for="(item, i) in items" :key="i" :value="false">
          <template v-slot:activator>
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title style="font-size: 0.8125rem">{{
                item.title
              }}</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item
            v-for="(groupItem, key) in item.items"
            :key="`group-${key}`"
            dense
            router
            exact
            :to="groupItem.to"
            link
          >
            <v-list-item-icon>
              <v-icon>{{ groupItem.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ groupItem.title }}</v-list-item-title>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar clipped-left fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
      <v-spacer />
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      items: [
        {
          icon: 'mdi-ferry',
          title: 'Images',
          items: [
            {
              icon: 'mdi-view-dashboard',
              title: 'list',
              to: '/image',
            },
            {
              icon: 'mdi-search-web',
              title: 'search',
              to: '/image/search',
            },
          ],
        },
        {
          icon: 'mdi-docker',
          title: 'containers',
          items: [
            {
              icon: 'mdi-view-dashboard',
              title: 'list',
              to: '/container',
            },
          ],
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Devops-07',
    }
  },
}
</script>
