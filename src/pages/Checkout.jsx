import React, {useState} from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

export default function Checkout(){
  const [cart, setCart] = useLocalStorage('cart', []);
  const [orders, setOrders] = useLocalStorage('orders', []);
  const [name,setName]=useState('');
  const [address,setAddress]=useState('');

  function placeOrder(){
    if(!name||!address) return alert('Fill details');
    const order = { id: Date.now(), name, address, items: cart, total: cart.reduce((s,i)=>s+i.price*(i.qty||1),0), status:'pending', createdAt: new Date().toISOString() };
    setOrders([order, ...orders]);
    setCart([]);
    alert('Order placed!');
  }

  return (
    <div>
      <h1>Checkout</h1>
      <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
      <input placeholder="Address" value={address} onChange={e=>setAddress(e.target.value)} />
      <div>Total: ${cart.reduce((s,i)=>s+i.price*(i.qty||1),0).toFixed(2)}</div>
      <button onClick={placeOrder}>Place Order</button>
    </div>
  );
}
