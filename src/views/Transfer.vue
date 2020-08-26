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
      </b-jumbotron>
    </div>

    <b-form @submit="findRoute">
      <b-form-row>
        <b-col md="6">
          <b-form-group id="startSelectGroup" label="Start Item:" label-for="startSelect">
            <b-form-select
              id="startSelect"
              v-model="form.startItem"
              :options="selectStartItems"
            ></b-form-select>
          </b-form-group>
        </b-col>

        <b-col md="6">
          <b-form-group id="finalSelectGroup" label="Final Item:" label-for="finalSelect">
            <b-form-select
              id="finalSelect"
              v-model="form.finalItem"
              :options="selectFinalItems"
            ></b-form-select>
          </b-form-group>
        </b-col>
      </b-form-row>

      <b-button type="submit" variant="primary">Submit</b-button>
    </b-form>

    <div id="display">
      <pre>{{ trueDisplay }}</pre>
    </div>

    <div id="result" v-if="namedTransferRoutes.length">
      <div class="mb-3">
        <b-button @click="sortRoute" variant="primary" v-if="routeSorted">Sort by the first found</b-button>
        <b-button @click="sortRoute" variant="primary" v-else>Sort by the shortest route</b-button>
      </div>

      <div v-for="(route, index) in namedTransferRoutes" :key="index">
        <h3>Route {{ index + 1 }}</h3>

        <ol>
          <li v-for="(material, index) in route.materialNames" :key="index">
            Synthesize <span class="resultItem">{{ route.itemNames[index + 1] }}</span>
            by adding <span class="resultItem">{{ route.itemNames[index] }}</span>
            in <span class="resultItem">{{ material }}</span> material loop
          </li>
        </ol>
      </div>
    </div>

    <Loading
      :active.sync="isLoading"
    ></Loading>
  </b-container>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import Loading from 'vue-loading-overlay'

export default {
  name: 'Transfer',
  components: {
    Loading
  },
  props: {
    categories: Object,
    items: Object,
    materials: Object
  },
  data() {
    return {
      form: {
        startItem: 0,
        finalItem: 0
      },
      selectStartItems: [
        { text: 'Select Item...', value: 0 },
      ],
      selectFinalItems: [
        { text: 'Select Item...', value: 0 },
      ],
      finder: {
        display: '',
        depth: 0,
        seenItemIds: [],
        seenMaterialIds: [],
        seenItemDepths: [],
        seenMaterialDepths: [],
        oneRouteItemIds: [],
        oneRouteMaterialIds: [],
        transferRoutes: []
      },
      trueDisplay: '',
      // result: [],
      // loader: null,
      isLoading: false,
      routeSorted: false,
    }
  },
  computed: {
    namedTransferRoutes() {
      let routes = []

      for (let route of this.finder.transferRoutes) {
        let itemNames = []

        for (let itemId of route.itemSequence) {
          let itemName = this.items.find({ id: itemId }).value().name
          itemNames.push(itemName)
        }

        let materialNames = []

        for (let materialId of route.materialSequence) {
          let material = this.materials.find({ id: materialId }).value()
          let materialName = ''

          if (material.materialableType == 'category') {
            materialName = this.categories.find({ id: material.materialableId }).value().name
          } else {
            materialName = this.items.find({ id: material.materialableId }).value().name
          }

          materialNames.push(materialName)
        }

        routes.push({
          itemNames: itemNames,
          materialNames: materialNames
        })
      }

      if (this.routeSorted) {
        return this.$_.sortBy(routes, [function(o) { return o.itemNames.length }])
      } else {
        return routes
      }
    }
  },
  methods: {
    resetFinder() {
      this.finder.display = '',
      this.finder.depth = 0,
      this.finder.seenItemIds = [],
      this.finder.seenMaterialIds = [],
      this.finder.seenItemDepths = [],
      this.finder.seenMaterialDepths = [],
      this.finder.oneRouteItemIds = [],
      this.finder.oneRouteMaterialIds = [],
      this.finder.transferRoutes = []
    },
    sortRoute() {
      // this.namedTransferRoutes = this.$_.sortBy(this.namedTransferRoutes, [function(o) { return o.itemNames.length }])
      this.routeSorted = !this.routeSorted
    },
    async findRoute(evt) {
      evt.preventDefault()

      this.resetFinder()

      if (this.form.startItem > 0 && this.form.finalItem > 0) {
        this.isLoading = true
        // let findResult = await this.find(this.form.startItem, this.form.finalItem, true)

        // ADD THIRD PARAMETER TO TOGGLE DISPLAY
        await this.find(this.form.startItem, this.form.finalItem)
        // await this.fakeFind(1, 10)

        // if (findResult) {
        //   this.isLoading = false
        //   console.log('found')
        // } else {
        //   console.log('not found')
        // }

        this.trueDisplay = this.finder.display

        this.isLoading = false

        console.log('this should be executed after find has been completed')
      }

      // this.result = this.finder.transferRoutes

      // this.isLoading = true
      // await this.recur(10);
      // this.isLoading = false
    },
    noWait() {
      return new Promise(resolve => resolve)
    },
    wait(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    },
    async recur(num) {
      if (num <= 0) {
        return
      } else {

        await this.wait(1000)

        console.log(num)

        return await this.recur(num - 1)
      }
    },
    tab(count) {
      let tab = ''

      for (let i = 0; i < count; i++) {
        tab += ' .'
      }

      return tab
    },
    async fakeFind(startItemId, finalItemId) {
      if (startItemId >= finalItemId) {
        return
      } else {
        await this.wait(1000)
        return await this.fakeFind(startItemId + 1, finalItemId)
      }
    },
    async find(startItemId, finalItemId, display = false) {
      // Display the start item
      if (display) {
        let item = this.items.find({ id: startItemId }).value()

        this.finder.display += this.tab(this.finder.depth) + item.name + '\n'
      }

      // Start Item met Final Item, END
      if (startItemId == finalItemId) {
        // Mark Final Item
        if (display) {
          this.finder.depth++
          this.finder.display += this.tab(this.finder.depth) + 'VV\n'
          this.finder.depth--
        }

        this.finder.depth--

        this.finder.oneRouteItemIds.push(startItemId)

        // Push one route
        if (!display) {
          this.finder.transferRoutes.push({
            itemSequence: JSON.parse(JSON.stringify(this.finder.oneRouteItemIds)),
            materialSequence: JSON.parse(JSON.stringify(this.finder.oneRouteMaterialIds))
          })
        }

        this.finder.oneRouteItemIds.pop()

        console.log('finish!')

        return true
      }

      // If current item already seen, do below
      // Else, push to seen
      if (this.finder.seenItemIds.includes(startItemId)) {
        let seenIndex = this.finder.seenItemIds.indexOf(startItemId)

        // If current depth is greater than seen item depth, mark as seen,
        // and skip to the next recursion
        // Else, update old seen item depth with the new one
        if (this.finder.depth >= this.finder.seenItemDepths[seenIndex]) {
          // Mark item as seen
          if (display) {
            this.finder.depth++
            this.finder.display += this.tab(this.finder.depth) + 'S\n'
            this.finder.depth--
          }

          this.finder.depth--

          return false
        } else {
          this.finder.seenItemIds.splice(seenIndex, 1)
          this.finder.seenItemDepths.splice(seenIndex, 1)

          this.finder.seenItemIds.push(startItemId)
          this.finder.seenItemDepths.push(this.finder.depth)
          this.finder.oneRouteItemIds.push(startItemId)
        }
      } else {
        this.finder.seenItemIds.push(startItemId)
        this.finder.seenItemDepths.push(this.finder.depth)
        this.finder.oneRouteItemIds.push(startItemId)
      }

      // Get material from item
      let materialableItems = [this.materials.find({
        materialableType: 'item',
        materialableId: startItemId
      }).value()]

      // Get materials from categories
      let materialableCategories = []
      let startItemCategoryIds = this.items.find({ id: startItemId }).value().categories

      for (let categoryId of startItemCategoryIds) {
        let materialableCategory = this.materials.find({
          materialableType: 'category',
          materialableId: categoryId
        }).value()

        materialableCategories.push(materialableCategory)
      }

      // Merge the item material and category material
      let materialSlots = [...materialableItems, ...materialableCategories]

      for (let slot of materialSlots) {
        this.finder.depth++

        // Display the material slot
        if (display) {
          let material = null

          if (slot.materialableType == 'category') {
            material = this.categories.find({ id: slot.materialableId }).value()
          } else {
            material = this.items.find({ id: slot.materialableId }).value()
          }

          this.finder.display += this.tab(this.finder.depth) + '*' + material.name + '\n'
        }

        // If material slot already seen, do below
        // Else, push to seen
        if (this.finder.seenMaterialIds.includes(slot.id)) {
          let seenIndex = this.finder.seenMaterialIds.indexOf(slot.id)

          // If current depth is greater than seen material depth, skip to the
          // next iteration
          // Else, update the depth
          if (this.finder.depth >= this.finder.seenMaterialDepths[seenIndex]) {
            // Mark the material as seen
            if (display) {
              this.finder.depth++
              this.finder.display += this.tab(this.finder.depth) + 'S\n'
              this.finder.depth--
            }

            this.finder.depth--

            continue
          } else {
            this.finder.seenMaterialIds.splice(seenIndex, 1)
            this.finder.seenMaterialDepths.splice(seenIndex, 1)

            this.finder.seenMaterialIds.push(slot.id)
            this.finder.seenMaterialDepths.push(this.finder.depth)
            this.finder.oneRouteMaterialIds.push(slot.id)
          }
        } else {
          this.finder.seenMaterialIds.push(slot.id)
          this.finder.seenMaterialDepths.push(this.finder.depth)
          this.finder.oneRouteMaterialIds.push(slot.id)
        }

        // Get enterable item from material slot
        let enterableItems = this.items.filter(function (o) {
          return o.materials.includes(slot.id)
        })

        // If material don't have enterable item, continue next material
        if (enterableItems.size().value() < 1) {
          // Mark material as un-enterable
          if (display) {
            this.finder.depth++
            this.finder.display += this.tab(this.finder.depth) + 'X\n'
            this.finder.depth--
          }

          this.finder.depth--

          this.finder.oneRouteMaterialIds.pop()

          continue
        }

        for (let enterableItem of enterableItems) {
          this.finder.depth++

          await this.wait(0)
          // await this.noWait()

          let findResult = await this.find(enterableItem.id, finalItemId, display)

          // If item has not been met with final item, continue next item
          if (!findResult) {
            continue
          }
        }

        this.finder.depth--
        this.finder.oneRouteMaterialIds.pop()
      }

      this.finder.depth--
      this.finder.oneRouteItemIds.pop()
    },
  },
  mounted() {
    let items = []
    let noMaterialItems = []

    // let pseudoSortedItems = this.items.sortBy('id')

    for (let item of this.items.value()) {
      items.push({
        text: item.name,
        value: item.id
      })

      if (item.materials.length > 0) {
        noMaterialItems.push({
          text: item.name,
          value: item.id
        })
      }
    }

    let sortedItems = this.$_.sortBy(items, 'text')
    let sortedNoMaterialItems = this.$_.sortBy(noMaterialItems, 'text')
    this.selectStartItems = [...this.selectStartItems, ...sortedItems]
    this.selectFinalItems = [...this.selectFinalItems, ...sortedNoMaterialItems]
  }
}
</script>

<style>
#display, #result {
  text-align: left;
}

#display {
  /* max-height: 400px; */
  overflow-x: auto;
}

#result .resultItem {
  /* color: #007bff; */
  color: rgb(152, 104, 1);
  font-weight: bold;
}
</style>
