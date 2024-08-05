import React, { useState } from 'react';

export const Prueba = () => {
  const [items, setItems] = useState([
    { id: 1, name: 'item 1', category: 'category A' },
    { id: 2, name: 'item 2', category: 'category B' },
    { id: 3, name: 'item 3', category: 'category A' },
    { id: 4, name: 'item 4', category: 'category C' },
    { id: 5, name: 'item 5', category: 'category B' },
  ]);

  const removeItem = (index: number) => {
    items.splice(index, 1);
    setItems([...items]);
  };

  return (
    <section>
      <h3>Items</h3>
      <ul>
        {items.map((item, index) => (
          <li key={item.id}>
            <span>Name: {item.name}</span>
            <span>Category: {item.category}</span>
            <button onClick={() => removeItem(index)}>Remove item</button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Prueba