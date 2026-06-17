import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface CartItem {
  id: number;
  product_id: number;
  product_attr_unique: string;
  cart_num: number;
  product?: any;
  attr?: any;
  checked?: boolean;
}

export const useCartStore = defineStore('cart', () => {
  const list = ref<CartItem[]>([]);

  const totalCount = computed(() => list.value.reduce((sum, item) => sum + item.cart_num, 0));
  const totalPrice = computed(() =>
    list.value
      .filter((item) => item.checked)
      .reduce((sum, item) => sum + (item.attr?.price || item.product?.price || 0) * item.cart_num, 0)
  );
  const checkedItems = computed(() => list.value.filter((item) => item.checked));
  const allChecked = computed(() => list.value.length > 0 && list.value.every((item) => item.checked));

  function setList(val: CartItem[]) {
    list.value = val.map((item) => ({ ...item, checked: true }));
  }

  function toggleCheck(id: number) {
    const item = list.value.find((i) => i.id === id);
    if (item) item.checked = !item.checked;
  }

  function toggleAll() {
    const newVal = !allChecked.value;
    list.value.forEach((item) => (item.checked = newVal));
  }

  function updateQuantity(id: number, num: number) {
    const item = list.value.find((i) => i.id === id);
    if (item) item.cart_num = Math.max(1, num);
  }

  function removeItem(id: number) {
    list.value = list.value.filter((i) => i.id !== id);
  }

  function clear() {
    list.value = [];
  }

  return { list, totalCount, totalPrice, checkedItems, allChecked, setList, toggleCheck, toggleAll, updateQuantity, removeItem, clear };
});
