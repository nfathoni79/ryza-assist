<template>
  <div id="app">
    <div id="navbar">
      <b-navbar toggleable="lg" type="dark" variant="info" fixed="top">
        <b-navbar-brand to="/">-RyZa-</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="mx-auto">
            <b-nav-item to="/">Home</b-nav-item>
            <b-nav-item to="/transfer">Trait Transfer</b-nav-item>
            <b-nav-item to="/items">Item List</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>


    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/transfer">Trait Transfer</router-link> |
      <router-link to="/items">Item List</router-link>
    </div> -->

    <router-view :categories="categories" :items="items" :materials="materials"/>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
  },
  data() {
    return {
      categories: [],
      items: [],
      materials: [],
    }
  },
  created() {
    this.categories = this.$db.get('categories')
    this.items = this.$db.get('items')
    this.materials = this.$db.get('materials')
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

// #nav {
//   padding: 30px;
//
//   a {
//     font-weight: bold;
//     color: #2c3e50;
//
//     &.router-link-exact-active {
//       color: #42b983;
//     }
//   }
// }

#navbar {
  padding-bottom: 70px;

  a {
    &.router-link-exact-active {
      color: rgba(255, 255, 255, 255);
    }
  }
}
</style>
