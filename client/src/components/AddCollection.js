import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { getCustomers } from '../services/api';
import styled from 'styled-components'; // Import styled-components

// Styled components for UI
const FormContainer = styled.form`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 12px 15px;
  margin-top: 5px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  transition: border-color 0.3s;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  resize: vertical;
  padding: 12px 15px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  transition: border-color 0.3s;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const ErrorText = styled.p`
  color: #dc3545;
  font-size: 14px;
  margin-top: 5px;
`;

const Dropdown = styled.ul`
  position: absolute;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
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

const AddCollection = () => {
  const [billNumber, setBillNumber] = useState('');
  const [shopName, setShopName] = useState('');
  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [customers, setCustomers] = useState([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [billError, setBillError] = useState('');
  const token = localStorage.getItem('token');
  const dropdownRef = useRef(); // Ref for dropdown

  // Fetch customers on component mount
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const customersData = await getCustomers();
        console.log('Fetched customers:', customersData); // Debugging fetch
        setCustomers(customersData);
      } catch (error) {
        console.error('Error fetching customers:', error.message);
        alert('Failed to load customers.');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const handleSearch = (value) => {
    setCustomerSearch(value);
    setShowDropdown(value.length > 0);
  };

  const handleSelectCustomer = (customerName) => {
    setShopName(customerName);
    setCustomerSearch(customerName);
    setShowDropdown(false);
  };

  const validateBillNumber = (value) => {
    const regex = /^(RG|SG)\d{1,4}$/;
    if (!regex.test(value)) {
      setBillError('Bill number must start with RG or SG followed by 1-4 digits (e.g., RG123, SG999).');
    } else {
      setBillError('');
    }
    setBillNumber(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (billError) {
      alert('Please fix the bill number error before submitting.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/collections/add-collection',
        { billNumber, shopName, amount, remarks },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(response.data.message);
      setBillNumber('');
      setShopName('');
      setAmount('');
      setRemarks('');
      setCustomerSearch('');
    } catch (error) {
      console.error('Error adding collection:', error.message);
      alert(`Failed to add collection: ${error.response?.data?.message || 'Please try again.'}`);
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    customer['Shop Name'].toLowerCase().includes(customerSearch.toLowerCase())
  );

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) return <p>Loading customers...</p>;

  return (
    <FormContainer onSubmit={handleSubmit}>
      {/* Bill Number Input */}
      <FormGroup>
        <label htmlFor="billNumber">Bill Number</label>
        <FormInput
          type="text"
          id="billNumber"
          value={billNumber}
          onChange={(e) => validateBillNumber(e.target.value)}
          placeholder="Enter bill number (e.g., RA123)"
          required
        />
        {billError && <ErrorText>{billError}</ErrorText>}
      </FormGroup>

      {/* Customer Search Input */}
      <FormGroup>
        <label htmlFor="customerSearch">Shop Name</label>
        <div ref={dropdownRef}>
          <FormInput
            type="text"
            id="customerSearch"
            value={customerSearch}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search shop name"
            required
          />
          {showDropdown && filteredCustomers.length > 0 && (
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
        </div>
      </FormGroup>

      {/* Amount Input */}
      <FormGroup>
        <label htmlFor="amount">Amount</label>
        <FormInput
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter collection amount"
          required
        />
      </FormGroup>

      {/* Remarks Input */}
      <FormGroup>
        <label htmlFor="remarks">Remarks (Optional)</label>
        <Textarea
          id="remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Enter any remarks"
        />
      </FormGroup>

      {/* Submit Button */}
      <SubmitButton type="submit">Add Collection</SubmitButton>
    </FormContainer>
  );
};

export default AddCollection;
