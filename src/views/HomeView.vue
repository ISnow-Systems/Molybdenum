<template>
  <div>
    <v-breadcrumbs :items="dirpath">
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: 'HomeView',
  data() {
    return {
      dirpath: [
        {
          text: 'システムルート (/)',
          disabled: false,
        },
      ]
    }
  }
}
</script>
