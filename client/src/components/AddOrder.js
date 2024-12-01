import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getCustomers, getProducts } from '../services/api';
import styled from 'styled-components'; // Import styled-components

const FormContainer = styled.form`
  max-width: 600px;
  margin: 0 auto;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  position: relative;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const Dropdown = styled.ul`
  position: absolute;
  border: 1px solid #ddd;
  background-color: #fff;
  z-index: 1000;
  width: 100%;
`;

const DropdownItem = styled.li`
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f1f1f1;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const AddOrder = () => {
  const [shopName, setShopName] = useState('');
  const [items, setItems] = useState([{ productName: '', quantity: '', showDropdown: false }]);
  const [status, setStatus] = useState('');
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersData = await getCustomers();
        const productsData = await getProducts();
        setCustomers(customersData);
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching data:', error.message);
        alert('Failed to load customers or products.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (setSearch, setShow, value) => {
    setSearch(value);
    setShow(value.length > 0);
  };

  const handleSelectCustomer = (name) => {
    setShopName(name);
    setCustomerSearch(name);
    setShowCustomerDropdown(false);
  };

  const handleSelectProduct = (index, name) => {
    const newItems = [...items];
    newItems[index].productName = name;
    newItems[index].showDropdown = false;
    setItems(newItems);
  };

  const handleProductSearchChange = (index, value) => {
    const newItems = [...items];
    newItems[index].productName = value;
    newItems[index].showDropdown = value.length > 0;
    setItems(newItems);
  };

  const handleQuantityChange = (index, value) => {
    const newItems = [...items];
    newItems[index].quantity = value;
    setItems(newItems);
  };

  const addNewItem = () => {
    setItems([...items, { productName: '', quantity: '', showDropdown: false }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/api/orders/add-order',
        { shopName, items, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(response.data.message);
      setShopName('');
      setItems([{ productName: '', quantity: '', showDropdown: false }]);
      setStatus('');
      setCustomerSearch('');
    } catch (error) {
      console.error('Error adding order:', error.message);
      alert(`Failed to add order: ${error.message}`);
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    customer['Shop Name'].toLowerCase().includes(customerSearch.toLowerCase())
  );

  const filteredProducts = (index) =>
    products.filter((product) =>
      product['Product Name'].toLowerCase().includes(items[index].productName.toLowerCase())
    );

  if (loading) return <p>Loading customers and products...</p>;

  return (
    <FormContainer onSubmit={handleSubmit}>
      {/* Customer Search Input */}
      <FormGroup>
        <Label htmlFor="customerSearch">Shop Name</Label>
        <FormInput
          type="text"
          id="customerSearch"
          placeholder="Search Customer"
          value={customerSearch}
          onChange={(e) => handleSearch(setCustomerSearch, setShowCustomerDropdown, e.target.value)}
          onFocus={() => setShowCustomerDropdown(true)}
          onBlur={() => setTimeout(() => setShowCustomerDropdown(false), 200)}
          required
        />
        {showCustomerDropdown && filteredCustomers.length > 0 && (
          <Dropdown>
            {filteredCustomers.map((customer) => (
              <DropdownItem
                key={customer._id}
                onClick={() => handleSelectCustomer(customer['Shop Name'])}
              >
                {customer['Shop Name']}
              </DropdownItem>
            ))}
          </Dropdown>
        )}
      </FormGroup>

      {/* Items Section */}
      {items.map((item, index) => (
        <div key={index}>
          <FormGroup>
            <Label htmlFor={`productSearch-${index}`}>Product Name</Label>
            <FormInput
              type="text"
              id={`productSearch-${index}`}
              placeholder="Search Product"
              value={item.productName}
              onChange={(e) => handleProductSearchChange(index, e.target.value)}
              onFocus={() => handleProductSearchChange(index, item.productName)}
              onBlur={() => setTimeout(() => {
                const newItems = [...items];
                newItems[index].showDropdown = false;
                setItems(newItems);
              }, 200)}
              required
            />
            {item.showDropdown && filteredProducts(index).length > 0 && (
              <Dropdown>
                {filteredProducts(index).map((product) => (
                  <DropdownItem
                    key={product._id}
                    onClick={() => handleSelectProduct(index, product['Product Name'])}
                  >
                    {product['Product Name']}
                  </DropdownItem>
                ))}
              </Dropdown>
            )}
          </FormGroup>

          {/* Quantity Input */}
          <FormGroup>
            <Label htmlFor={`quantity-${index}`}>Quantity</Label>
            <FormInput
              type="number"
              id={`quantity-${index}`}
              placeholder="Quantity"
              value={item.quantity}
              onChange={(e) => handleQuantityChange(index, e.target.value)}
              required
            />
          </FormGroup>
        </div>
      ))}

      <button
        type="button"
        onClick={addNewItem}
        style={{
          width: '100%',
          padding: '15px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          marginBottom: '20px',
        }}
      >
        Add Another Item
      </button>

      <FormGroup>
        <Label htmlFor="status">Status</Label>
        <FormInput
          type="text"
          id="status"
          placeholder="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        />
      </FormGroup>

      <SubmitButton type="submit">Add Order</SubmitButton>
    </FormContainer>
  );
};

export default AddOrder;
