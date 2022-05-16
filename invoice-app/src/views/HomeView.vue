<template>
  <div class="home">
    <h2 style="text-align: left">Vue Invoice Calc</h2>
    <div class="adding-row">
      <input
        v-model="productName"
        class="border input string"
        type="text"
        placeholder="Product name"
      />
      <!-- I picked some linter that disagrees with me too often, needs reconfig -->
      <!-- eslint-disable-next-line -->
      <input
        v-model="productPrice"
        class="border input number"
        type="number"
        placeholder="Price"
        @input="checkPrice($event)"
      />
      <!-- eslint-disable-next-line -->
      <input
        v-model="productQuantity"
        class="border input number"
        type="number"
        placeholder="Quantity"
        @input="checkQuantity($event)"
        @change="checkMinValue($event, 1)"
      />
      <button
        class="border button add-button"
        @click="addNewItem"
        :class="{ disabled: !canAdd }"
      >
        Add
      </button>
    </div>
    <ItemTable :invoiceItems="invoiceItems" />
    <br />
    <button class="border button float-left" @click="deleteSelected">
      Delete
    </button>
    <div style="float: right">Total: {{ totalPrice }}$</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ItemTable from "@/components/ItemTable.vue";
import { ItemType } from "@/store";
import { v4 as uuidv4 } from "uuid";

@Component({
  components: {
    ItemTable,
  },
})
export default class HomeView extends Vue {
  productName: string | null = null;
  productPrice: number | null = null;
  productQuantity: number | null = null;

  get invoiceItems(): Array<ItemType> {
    return this.$store.getters.getInvoiceItems;
  }

  get totalPrice(): number {
    let count = 0;
    this.invoiceItems.forEach((item: ItemType) => {
      count += item.price * item.quantity;
    });
    return count;
  }

  get canAdd(): boolean {
    if (!this.productName || !this.productPrice || !this.productQuantity) {
      return false;
    }
    return true;
  }

  clearForm(): void {
    this.productName = null;
    this.productPrice = null;
    this.productQuantity = null;
  }

  // eslint-disable-next-line
  checkPrice(event: any): void {
    if (!event.target.value) {
      event.target.value = null;
      this.productPrice = null;
      return;
    }
  }

  // eslint-disable-next-line
  checkQuantity(event: any): void {
    if (!event.target.value) {
      event.target.value = null;
      this.productQuantity = null;
      return;
    }
  }

  // eslint-disable-next-line
  checkMinValue(event: any, min = 0): void {
    if (event.target.value < min) {
      event.target.value = null;
      this.productQuantity = null;
      return;
    }
  }

  deleteSelected(): void {
    // TODO: confirm from user (w/ element count)
    this.invoiceItems.forEach((item: ItemType) => {
      if (item.checked) {
        this.$store.commit("deleteInvoiceItem", item);
      }
    });
  }

  addNewItem(): void {
    if (!this.canAdd) return;
    // Here I use "!" since I implemented custom data checking, compiler rightfully assumes possible null
    // values for properties but this function won't execute if they are null anyways
    const item: ItemType = {
      checked: false,
      name: this.productName!,
      price: this.productPrice!,
      quantity: this.productQuantity!,
      idHash: uuidv4(),
    };
    this.$store.commit("addInvoiceItem", item);
    this.clearForm();
  }
}
</script>

<style lang="scss">
.home {
  width: 80vw;
  max-width: 800px;
  margin: 0 auto;
}

/* if smaller than 1024 px, we let the inputs break into two lines*/
@media (min-width: 1024px) {
  .adding-row {
    display: grid;
    grid-template-columns: 50% 15% 15% 20%;
  }
}

.input {
  margin-right: 1rem;
  margin-bottom: 1rem;

  &.string {
    max-width: 20rem;
  }

  &.number {
    max-width: 5rem;
  }
}

.button {
  box-shadow: 0.2rem 0.2rem black;

  &.float-left {
    width: 4rem;
    height: 2rem;
    float: left;
  }

  &.add-button {
    width: 4rem;
    height: 2rem;
    justify-self: end;
    background-color: green;
    cursor: pointer;

    &.disabled {
      background-color: grey;
      cursor: not-allowed;
    }
  }
}

.border {
  border: 0.2rem solid black;
  border-radius: 0.1rem;
}
</style>
