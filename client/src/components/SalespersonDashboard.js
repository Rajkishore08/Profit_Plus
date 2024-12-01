import React from 'react';
import AddOrder from './AddOrder';
import AddCollection from './AddCollection';
import '../App.css';

const SalespersonDashboard = () => {
  return (
    <div>
      <h1>Salesperson Dashboard</h1>
      <h2>Add Order</h2>
      <AddOrder />
      <h2>Add Collection</h2>
      <AddCollection />
    </div>
  );
};

export default SalespersonDashboard;
