<template>
  <b-container>
    <div>
      <b-jumbotron>
        <template v-slot:header>Item List</template>

        <template v-slot:lead>
          All items (material items, synthesis items, battle items, equipments) in Atelier Ryza.
        </template>

        <hr class="my-4">

        <p>
          You can search and filter by category and material.
          All categories in each items are unlocked and can be filtered.
        </p>
      </b-jumbotron>
    </div>

    <b-row>
      <b-col md="4">
        <b-form-group id="searchGroup" label="Search:" label-for="search">
          <b-form-input
            id="search"
            type="search"
            v-model="form.search"
            placeholder="Search item..."
          ></b-form-input>
        </b-form-group>
      </b-col>

      <b-col md="4">
        <div>
          <b-form>
            <b-form-group id="categorySelectGroup" label="Category:" label-for="categorySelect">
              <b-form-select
                id="categorySelect"
                v-model="form.category"
                :options="selectCategories"
              ></b-form-select>
            </b-form-group>
          </b-form>
        </div>
      </b-col>

      <b-col md="4">
        <div>
          <b-form>
            <b-form-group id="materialSelectGroup" label="Material:" label-for="materialSelect">
              <b-form-select
                id="materialSelect"
                v-model="form.material"
                :options="selectMaterials"
              ></b-form-select>
            </b-form-group>
          </b-form>
        </div>
      </b-col>
    </b-row>

    <div>
      <b-table striped hover :items="tableItems">
        <template v-slot:cell(name)="data">
          <!-- `data.value` is the value after formatted by the Formatter -->
          <!-- <a :href="`#${data.value.replace(/[^a-z]+/i,'-').toLowerCase()}`">{{ data.value }}</a> -->
          <!-- <router-link :to="`/items/${data.item.no}`">
            {{ data.value }}
          </router-link> -->
          <b-link @click="setModalItem(data.item.no)" v-b-modal.itemModal>{{ data.value }}</b-link>
        </template>
      </b-table>
    </div>

    <div>
      <b-modal id="itemModal" :title="modal.title" ok-only>
        <div>
          <h6>Categories:</h6>

          <ul v-if="modal.categories.length">
            <li v-for="category in modal.categories" :key="category.id">
              <b-link @click="filterCategory(category.id)">
                {{ category.name }}
              </b-link>
            </li>
          </ul>
          <p v-else>No category.</p>

          <h6>Materials:</h6>

          <ul v-if="modal.materials.length">
            <li v-for="material in modal.materials" :key="material.id">
              <b-link @click="filterMaterial(material.id)">
                {{ material.name }}
              </b-link>
            </li>
          </ul>
          <p v-else>No material.</p>

          {{ modal.content }}
        </div>
      </b-modal>
    </div>
  </b-container>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Items',
  components: {
  },
  data() {
    return {
      categories: [],
      items: [],
      materials: [],
      form: {
        search: '',
        category: 0,
        material: 0
      },
      selectCategories: [
        { text: 'All', value: 0 },
      ],
      selectMaterials: [
        { text: 'All', value: 0 },
      ],
      modal: {
        title: 'Item',
        categories: [],
        materials: []
      }
    }
  },
  methods: {
    setModalItem: function (id) {
      this.modal.categories = []
      this.modal.materials = []

      let item = this.items.find({ id: id}).value()
      this.modal.title = item.name

      let categories = this.categories.filter(function (o) {
        return o.items.includes(id)
      })

      for (let category of categories) {
        this.modal.categories.push({ id: category.id, name: category.name })
      }

      let materials = this.materials.filter(function (o) {
        return o.items.includes(id)
      })

      for (let material of materials) {
        if (material.materialableType == 'category') {
          let category = this.categories.find({ id: material.materialableId }).value()
          this.modal.materials.push({ id: material.id, name: category.name })
        } else {
          let item = this.items.find({ id: material.materialableId }).value()
          this.modal.materials.push({ id: material.id, name: item.name })
        }
      }
    },
    filterCategory: function (categoryId) {
      this.form.category = categoryId
      this.form.search = ''
      this.form.material = 0
      this.$bvModal.hide('itemModal')
    },
    filterMaterial: function (materialId) {
      this.form.material = materialId
      this.form.search = ''
      this.form.category = 0
      this.$bvModal.hide('itemModal')
    },
  },
  computed: {
    tableItems: function () {
      var items = this.items.value()
      var tableItems = []

      if (this.form.search != '') {
        let search = this.form.search

        items = items.filter(function (o) {
          return o.name.toLowerCase().includes(search)
        })
      }

      if (this.form.category != 0) {
        let category = this.form.category

        items = items.filter(function (o) {
          return o.categories.includes(category)
        })
      }

      if (this.form.material != 0) {
        let material = this.form.material

        items = items.filter(function (o) {
          return o.materials.includes(material)
        })
      }

      for (let item of items) {
        tableItems.push({ no: item.id, name: item.name })
      }

      return tableItems
    }
  },
  created() {
    this.categories = this.$db.get('categories')
    this.items = this.$db.get('items')
    this.materials = this.$db.get('materials')

    let sortedCategories = this.categories.sortBy('name')

    for (let category of sortedCategories) {
      this.selectCategories.push({ text: category.name, value: category.id })
    }

    let materials = []

    for (let material of this.materials) {
      if (material.materialableType == 'category') {
        materials.push({
          text: this.categories.find({ id: material.materialableId}).value().name,
          value: material.id
        })
      } else {
        materials.push({
          text: this.items.find({ id: material.materialableId}).value().name,
          value: material.id
        })
      }
    }

    let sortedMaterials = this.$_.sortBy(materials, 'text')
    this.selectMaterials = [...this.selectMaterials, ...sortedMaterials];
  }
}
</script>

<style lang="scss">
#itemModal {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
