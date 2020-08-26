<template>
  <!-- <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div> -->

  <b-container>
    <div>
      <b-jumbotron>
        <template v-slot:header>-RyZa-</template>

        <template v-slot:lead>
          -RyZa, your synthesiZing assistance-
        </template>

        <hr class="my-4">

        <p>
          A simple tool that can help you synthesize items in Atelier Ryza.
        </p>
      </b-jumbotron>
    </div>

    <div>
      <b-card-group deck>
        <b-card
          title="Trait Transfer"
          tag="article"
          class="mb-2"
        >
          <b-card-text>
            Helps you transfer one or more traits from an item
            to another item by finding the possible transfer routes.
          </b-card-text>

          <b-button to="/transfer" variant="primary">Enter</b-button>
        </b-card>

        <b-card
          title="Item List"
          tag="article"
          class="mb-2"
        >
          <b-card-text>
            All items (material items, synthesis items, battle items, equipments) in Atelier Ryza.
          </b-card-text>

          <b-button to="/items" variant="primary">Enter</b-button>
        </b-card>
      </b-card-group>
    </div>
  </b-container>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    // HelloWorld
  },
  props: {
    categories: Object,
    items: Object,
    materials: Object
  }
}
</script>
