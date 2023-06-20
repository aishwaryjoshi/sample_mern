import React, { useState } from 'react';

const OrderForm = ({ onSubmit }) => {
    const [orderNumber, setOrderNumber] = useState('');
    const [amount, setAmount] = useState('');

    const handlePlaceOrder = () => {
        const orderData = {
            orderNumber,
            amount,
        };
        onSubmit(orderData);
    };

    return (
        <div>
            <h3>Order Form</h3>
            <div>
                <label>Order Number:</label>
                <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                />
            </div>
            <div>
                <label>Amount:</label>
                <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
            </div>
            <button onClick={handlePlaceOrder}>Place Order</button>
        </div>
    );
};

export default OrderForm;