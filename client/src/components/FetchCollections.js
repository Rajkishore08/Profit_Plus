// FetchCollections.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import './FetchCollections.css'; // Optional: Add styles here

const FetchCollections = ({ token }) => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/collections', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCollections(response.data);
      } catch (err) {
        console.error('Error fetching collections:', err);
        setError('Failed to fetch collections. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, [token]);

  if (loading) return <div className="loader">Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="table-container">
      <h3>Collections</h3>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Bill Number</th>
            <th>Shop Name</th>
            <th>Amount</th>
            <th>Remarks</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {collections.map((collection) => (
            <tr key={collection._id}>
              <td>{collection.billNumber}</td>
              <td>{collection.shopName}</td>
              <td>{`₹${collection.amount.toFixed(2)}`}</td>
              <td>{collection.remarks}</td>
              <td>{new Date(collection.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FetchCollections;
