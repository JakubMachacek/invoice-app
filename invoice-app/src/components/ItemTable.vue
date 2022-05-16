<template>
  <div class="wrap">
    <div>
      <table style="width: 100%; text-align: left">
        <thead>
          <tr>
            <th>
              <!-- keeping this kinda naive, should ideally compute own state -->
              <input type="checkbox" @click="selectAll" />
            </th>
            <th>Product name</th>
            <th>Price</th>
            <th>Qta</th>
            <th>Sum</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) of invoiceItems" :key="index">
            <td>
              <input type="checkbox" v-model="item.checked" />
            </td>
            <td>{{ item.name }}</td>
            <td>{{ item.price }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.price * item.quantity }}$</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { ItemType } from "@/store";

@Component
export default class ItemTable extends Vue {
  @Prop() private invoiceItems!: Array<ItemType>;

  // I could not figure out the typing here in reasonable time so I used 'any'
  // eslint-disable-next-line
  selectAll(event: any): void {
    const value = event.target.checked;
    this.invoiceItems.forEach((item: ItemType) => {
      item.checked = value;
      this.$store.commit("setInvoiceItem", item);
    });
  }
}
</script>

<style scoped lang="scss">
table,
th,
td {
  border: 0.2rem solid black;
  border-collapse: collapse;
}

th {
  background: #888;
}

tr:nth-child(even) {
  background: #ccc;
}

tr:nth-child(odd) {
  background: #fff;
}
</style>
