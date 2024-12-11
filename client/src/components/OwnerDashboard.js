import React, { useEffect, useState, memo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import '../App.css'; // Ensure responsive styles are defined here.
//import SalespersonRegister from '../pages/SalespersonRegister'; // Import the registration component

const OwnerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [collections, setCollections] = useState([]);
  const [completedOrders, setCompletedOrders] = useState({});
  const [dailyTotal, setDailyTotal] = useState(0);
  const [weeklyTotal, setWeeklyTotal] = useState(0);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [dailyAverage, setDailyAverage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
  const token = localStorage.getItem('token');
    

    const fetchData = async () => {
      try {
        const [ordersResponse, collectionsResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/orders/all-orders', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/collections', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setOrders(ordersResponse.data);
        setCollections(collectionsResponse.data);
        calculateTotals(collectionsResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Unable to fetch data. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const calculateTotals = (collections) => {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    let dailySum = 0;
    let weeklySum = 0;
    let monthlySum = 0;

    collections.forEach((collection) => {
      const collectionDate = new Date(collection.createdAt);
      if (collectionDate >= startOfDay) dailySum += collection.amount;
      if (collectionDate >= startOfWeek) weeklySum += collection.amount;
      if (collectionDate >= startOfMonth) monthlySum += collection.amount;
    });

    setDailyTotal(dailySum);
    setWeeklyTotal(weeklySum);
    setMonthlyTotal(monthlySum);
    setDailyAverage(monthlySum / daysInMonth);
  };

  const groupByDate = (records) =>
    records.reduce((acc, record) => {
      const date = new Date(record.createdAt).toLocaleDateString();
      acc[date] = acc[date] || [];
      acc[date].push(record);
      return acc;
    }, {});

  const downloadPDF = (records, date, title) => {
    const doc = new jsPDF();
    doc.text(`${title} - ${date}`, 10, 10);

    const data = records.map((record) => {
      if (title === 'Orders') {
        return [
          record._id,
          record.shopName,
          record.items.map((item) => `${item.productName} - ${item.quantity}`).join(', '),
          record.status,
          new Date(record.createdAt).toLocaleString(),
        ];
      } else {
        return [
          record.billNumber,
          record.shopName,
          `₹${record.amount.toFixed(2)}`,
          record.remarks,
          new Date(record.createdAt).toLocaleString(),
        ];
      }
    });

    const headers =
      title === 'Orders'
        ? ['Order ID', 'Shop Name', 'Products', 'Status', 'Timestamp']
        : ['Bill Number', 'Shop Name', 'Amount', 'Remarks', 'Timestamp'];

    doc.autoTable({
      head: [headers],
      body: data,
      styles: { cellPadding: 2, fontSize: 10, overflow: 'linebreak' },
    });

    doc.save(`${title}-${date}.pdf`);
  };

  const handleOrderCompletion = (orderId) => {
    setCompletedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId], // Toggle the checkbox state
    }));
  };

  const ordersByDate = groupByDate(orders);
  const collectionsByDate = groupByDate(collections);

  if (loading) return <div className="loader">Loading...</div>;
  if (error)
    return (
      <div style={{ color: 'red', textAlign: 'center' }}>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );

  return (
    <div className="dashboard-container">
      <h2>Owner Dashboard </h2>
      <div className="summary-container">
        <p><strong>Total Collections Today:</strong> ₹{dailyTotal.toFixed(2)}</p>
        <p><strong>Total Collections This Week:</strong> ₹{weeklyTotal.toFixed(2)}</p>
        <p><strong>Total Collections This Month:</strong> ₹{monthlyTotal.toFixed(2)}</p>
        <p><strong>Average Daily Collection:</strong> ₹{dailyAverage.toFixed(2)}</p>
      </div>

      <button onClick={() => navigate('/salesperson-register')}>Add Salesperson</button> {/* Button to navigate to registration page */}
      <h2>ORDERS</h2>
      <div className="table-container">
        <TableSection
          title="Orders"
          recordsByDate={ordersByDate}
          downloadPDF={downloadPDF}
          handleCompletion={handleOrderCompletion}
          completedOrders={completedOrders}
        />
      </div>

      <h2>Collections</h2>
      <div className="table-container">
        <TableSection
          title="Collections"
          recordsByDate={collectionsByDate}
          downloadPDF={downloadPDF}
        />
      </div>
    </div>
  );
};

const TableSection = memo(({ title, recordsByDate, downloadPDF, handleCompletion, completedOrders }) => (
  <table className="styled-table">
    <thead>
      <tr>
        <th className="date-column">Date</th>
        {title === 'Orders' ? <th>Order ID</th> : <th>Bill Number</th>}
        <th>Shop Name</th>
        <th>{title === 'Orders' ? 'Products' : 'Amount'}</th>
        {title === 'Orders' && <th>Status</th>}
        {title === 'Orders' && <th>Completed</th>}
        {title === 'Collections' && <th>Remarks</th>} {/* Added Remarks column */}
        <th>Timestamp</th>
      </tr>
    </thead>
    <tbody>
      {Object.keys(recordsByDate).map((date) => (
        <React.Fragment key={date}>
          <tr style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
            <td colSpan={title === 'Orders' ? 7 : 6} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{date}</span>
              <span
                role="button"
                aria-label={`Download ${title} PDF`}
                style={{ cursor: 'pointer', fontSize: '20px' }}
                onClick={() => downloadPDF(recordsByDate[date], date, title)}
              >
                ▼ {/* Down Arrow Symbol */}
              </span>
            </td>
          </tr>
          {recordsByDate[date].map((record) => (
            <tr key={record._id}>
              <td></td>
              {title === 'Orders' ? (
                <>
                  <td>{record._id}</td>
                  <td>{record.shopName}</td>
                  <td>{record.items.map(item => `${item.productName} - ${item.quantity}`).join(', ')}</td>
                  <td>{record.status}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={completedOrders[record._id] || false}
                      onChange={() => handleCompletion(record._id)}
                    />
                  </td>
                </>
              ) : (
                <>
                  <td>{record.billNumber}</td>
                  <td>{record.shopName}</td>
                  <td>₹{record.amount.toFixed(2)}</td>
                  <td>{record.remarks}</td>
                </>
              )}
              <td>{new Date(record.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </React.Fragment>
      ))}
    </tbody>
  </table>
));

export default OwnerDashboard;
