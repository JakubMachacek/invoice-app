import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";

export interface ItemType {
  checked: boolean;
  name: string;
  price: number;
  quantity: number;
  idHash: string;
}

export interface InvoiceItems {
  itemEntries: Array<ItemType>;
}

const vuexLocal = new VuexPersistence<InvoiceItems>({
  storage: window.localStorage,
  key: "invoice-persist",
});

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    itemEntries: [],
  },
  getters: {
    getInvoiceItems: function (state: InvoiceItems): Array<ItemType> {
      return state.itemEntries;
    },
  },
  mutations: {
    // it would be better to mutate properties individually but I chose to
    // be pragmatic here
    setInvoiceItem: function (state: InvoiceItems, itemEntry: ItemType): void {
      const copy = [...state.itemEntries];
      const index = copy.findIndex((x: ItemType) => {
        return x.idHash === itemEntry.idHash;
      });
      if (index < 0) return; // throw some error?
      copy[index] = itemEntry;
      state.itemEntries = copy;
    },
    // linter is being stupid here for some reason
    // eslint-disable-next-line
    deleteInvoiceItem: function (state: InvoiceItems, itemEntry: ItemType): void {
      const copy = [...state.itemEntries];
      const index = copy.findIndex((x: ItemType) => {
        return x.idHash === itemEntry.idHash;
      });
      if (index < 0) return; // throw some error?
      copy.splice(index, 1);
      state.itemEntries = copy;
    },
    addInvoiceItem: function (state: InvoiceItems, itemEntry: ItemType): void {
      const copy = [...state.itemEntries];
      copy.push(itemEntry);
      state.itemEntries = copy;
    },
  },
  actions: {},
  modules: {},
  plugins: [vuexLocal.plugin],
});
