<template>
  <b-container>
    <div>
      <b-jumbotron>
        <template v-slot:header>Trait Transfer</template>

        <template v-slot:lead>
          Helps you transfer one or more traits from an item
          to another item by finding the possible transfer routes.
        </template>

        <hr class="my-4">

        <p>
          This function assumes all effects "Add (category)" are unlocked
          and all traits are transferable, so you may need to unlock the
          required effects and try one ore more routes until you found the
          right one. Please wait while the process is running.
        </p>

        <b-button variant="primary" href="#">Do Something</b-button>
        <b-button variant="success" href="#">Do Something Else</b-button>
      </b-jumbotron>
    </div>
  </b-container>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Transfer',
  components: {
  }
}
</script>
