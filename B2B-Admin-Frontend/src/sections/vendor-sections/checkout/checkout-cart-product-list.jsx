import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';

import { CheckoutCartProduct } from './checkout-cart-product';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'product', label: 'Product',align: 'center' },
  { id: 'price', label: 'Price' },
  { id: 'quantity', label: 'Quantity', align: 'center'  },
  { id: 'totalAmount', label: 'Total Price', align: 'center' },
  { id: 'dimensional', label: 'Dimensional', align: 'center' },
  { id: '' },
];

// ----------------------------------------------------------------------

export function CheckoutCartProductList({
  products,
  onDownload,
  onDelete,
  onIncreaseQuantity,
  onDecreaseQuantity,
}) {
  return (
    <Scrollbar>
      <Table sx={{ minWidth: 720 }}>
        <TableHeadCustom headLabel={TABLE_HEAD} />

        <TableBody>
          {products.map((row) => (
            <CheckoutCartProduct
              key={row.id}
              row={row}
              onDownload={() => onDownload(row.id)}
              onDelete={() => onDelete(row.id)}
              onDecrease={() => onDecreaseQuantity(row.id)}
              onIncrease={() => onIncreaseQuantity(row.id)}
            />
          ))}
        </TableBody>
      </Table>
    </Scrollbar>
  );
}
