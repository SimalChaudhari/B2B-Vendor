import React from 'react';

export function OrderListView() {
    // Sample order data, this could come from props or API calls
    const orders = [
        { id: 1, customerName: 'John Doe', totalAmount: 120.00, status: 'Shipped' },
        { id: 2, customerName: 'Jane Smith', totalAmount: 75.50, status: 'Pending' },
        { id: 3, customerName: 'Mike Johnson', totalAmount: 200.00, status: 'Delivered' },
        // Add more orders as needed
    ];

    return (
        <div>
            <h1>Order List</h1>
            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer Name</th>
                        <th>Total Amount</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.customerName}</td>
                            <td>${order.totalAmount.toFixed(2)}</td>
                            <td>{order.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
