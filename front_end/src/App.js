import React, { useState } from 'react';
import GoogleLoginButton from './GoogleLoginButton';
import OrderForm from './PlaceOrder';
import { GoogleOAuthProvider } from '@react-oauth/google';
const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isAddOrder, setIsAddOrder] = useState(false);
  const [isShowOrder, setIsShowOrder] = useState(false);
  const getEmail = async (token) => {
    try {
      const url = 'http://localhost:5000/login';

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(token),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleLoginSuccess = async (user) => {
    console.log(user);
    let data = await getEmail({
      token: user.credential,
      type: 'google'
    })
    console.log(data);
    setLoggedInUser(data);
  };

  const handleLoginFailure = (error) => {
    console.log('Google login failed:', error);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setIsShowOrder(false);
    setIsAddOrder(false);
  };

  const handleAddOrder = () => {
    setIsAddOrder(!isAddOrder);
  };
  const addOrderToMongo = async (order) => {
    try {
      const url = 'http://localhost:5000/add_order';
      order['email'] = loggedInUser.email;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const getOrderFromMongo = async (order) => {
    try {
      const url = 'http://localhost:5000/get_orders';

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: loggedInUser.email }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const placeOrder = (order) => {
    setOrders([...orders, order]);
    setIsAddOrder(!isAddOrder);
    addOrderToMongo(order);

  }
  const handleShowOrder = async () => {
    let ordersFromMongo = await getOrderFromMongo();
    setOrders(ordersFromMongo.data);
    setIsShowOrder(!isShowOrder);
  }
  return (
    <GoogleOAuthProvider clientId="371060853820-kksdf5b9nqd3ge3qd7imqk31cl61tpk9.apps.googleusercontent.com">
      <div>
        {loggedInUser ? (
          <div>
            <h2>Welcome, {loggedInUser.name}!</h2>
            <button onClick={handleLogout}>Logout</button>
            <h3>Add Order</h3>
            {/* Implement order form here */}
            <button onClick={() => handleAddOrder()}>Add Order</button>
            {isAddOrder ? (<OrderForm onSubmit={placeOrder}></OrderForm>) : <div></div>}
            <button onClick={() => handleShowOrder()}>Show Orders</button>
            {isShowOrder ?
              (<div>
                <h3>All Orders</h3>
                <table style={{ border: '2px solid black' }}>
                  <thead>
                    <tr style={{ border: '2px solid black' }}>
                      <th style={{ border: '2px solid black' }}>Order Number</th>
                      <th style={{ border: '2px solid black' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, index) => (
                      <tr key={index} style={{ border: '2px solid black' }}>
                        <td>{order.orderNumber}</td>
                        <td>{order.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>) : <div></div>}
          </div>
        ) : (
          <div>
            <h2>Login with Google</h2>
            <GoogleLoginButton
              onSuccess={handleLoginSuccess}
              onFailure={handleLoginFailure}
            />
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
};

export default App;