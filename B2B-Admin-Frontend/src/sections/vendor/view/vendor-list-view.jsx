import React from 'react';

export function VendorListView() {
  // Sample vendor data, this could come from props or API calls
  const vendors = [
    { id: 1, name: 'Vendor One', description: 'Description for vendor one' },
    { id: 2, name: 'Vendor Two', description: 'Description for vendor two' },
    // Add more vendors as needed
  ];

  return (
    <div>
      <h1>Vendor List</h1>
      <ul>
        {vendors.map(vendor => (
          <li key={vendor.id}>
            <h2>{vendor.name}</h2>
            <p>{vendor.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
