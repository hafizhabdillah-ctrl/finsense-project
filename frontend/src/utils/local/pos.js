export let carts = [
  { id:1, name: 'Beras Premium', price: 10000, qty: 2 },
  { id:2, name: 'Minyak Goreng', price: 20000, qty: 1 },
  { id:3, name: 'Telur 1kg', price: 15000, qty: 3 },
  { id:4, name: 'Ayam 1kg', price: 35000, qty: 1 },
  { id:5, name: 'Beras Premium', price: 10000, qty: 2 },
  { id:6, name: 'Minyak Goreng', price: 20000, qty: 1 },
  { id:7, name: 'Telur 1kg', price: 15000, qty: 3 },
  { id:8, name: 'Ayam 1kg', price: 35000, qty: 1 },
];

export function addCart({ name, price, qty }) {
  carts = [...carts, {
    id: carts.length + 1,
    name: name,
    price: Number(price),
    qty: Number(qty),
  }];
}

export function deleteCart(id) {
  carts = carts.filter((cart) => cart.id !== id);
}