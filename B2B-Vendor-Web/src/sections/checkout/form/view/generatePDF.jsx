/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable new-cap */

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { fNumber } from 'src/utils/format-number';

// Function to generate PDF
export const generatePDF = (address, items) => {
  // Create a new instance of jsPDF
  const doc = new jsPDF();

  // Set the main title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 87, 34); // Orange color similar to your reference
  doc.text('PURCHASE ORDER', 15, 20);

  // Add address title and customer details
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 87, 34);

  // Customer details
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0); // Black text
  const addressY = 0;

  // Delivery Information & Order Information
  const orderInfoY = addressY + 50;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 87, 34);
  doc.text('Deliver To:', 15, orderInfoY);
  doc.text('Order date:', 140, orderInfoY);

  // Delivery details - replaced with customer address details
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(`Customer Name: ${address.name || 'N/A'}`, 15, orderInfoY + 10);
  doc.text(`Phone Number: ${address.mobile || 'N/A'}`, 15, orderInfoY + 20);
  doc.text(`Email: ${address.email || 'N/A'}`, 15, orderInfoY + 30);
  doc.text(`Address: ${address.address || 'N/A'}`, 15, orderInfoY + 40);
  doc.text(`State: ${address.state || ''}, Pincode: ${address.pincode || ''}`, 15, orderInfoY + 50);
  doc.text(`Country: ${address.country || 'N/A'}`, 15, orderInfoY + 60);

  // Get current date in "dd/mm/yyyy" format
  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
  doc.text(formattedDate, 170, orderInfoY);

  // Table header and data
  const headers = [['SR.NO', 'Product Name', 'Qty', 'Rate', 'Amount']];
  const data = items.map((product, index) => [
    index + 1,
    product.itemName,
    product.quantity,
    `Rs: ${fNumber(product.sellingPrice)}`,
    `Rs: ${fNumber(product.quantity * product.sellingPrice)}`,
  ]);

  // Adding the product details table
  doc.autoTable({
    head: headers,
    body: data,
    startY: orderInfoY + 70,
    theme: 'grid', // Optional: styling for better visuals
    headStyles: {
      fillColor: [255, 87, 34], // Orange header
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 20 }, // Serial number alignment and width (Center aligned)
      1: { halign: 'center', cellWidth: 70 }, // Product name alignment and width (Center aligned)
      2: { halign: 'center', cellWidth: 20 }, // Quantity alignment and width (Center aligned)
      3: { halign: 'right', cellWidth: 30 }, // Rate alignment and width (Right aligned)
      4: { halign: 'right', cellWidth: 30 }, // Amount alignment and width (Right aligned)
    },
    didParseCell({ section, column, cell }) {
      if (section === 'head') {
        // Set alignment for each header cell based on column index
        if (column.index === 0 || column.index === 1 || column.index === 2) {
          cell.styles.halign = 'center'; // Center aligned for columns 0, 1, and 2
        } else if (column.index === 3 || column.index === 4) {
          cell.styles.halign = 'right'; // Right aligned for columns 3 and 4
        }
      }
    },
  });

  // Calculate total amount
  const totalAmount = items.reduce((total, product) => total + product.quantity * product.sellingPrice, 0);

  // Add the total amount below the table
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 87, 34); // Orange for total section
  doc.text(`Total Rs: ${fNumber(totalAmount)}`, 15, doc.previousAutoTable.finalY + 20);

  // Save the generated PDF
  doc.save('purchase_order.pdf');
};
