import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { ProductItem } from './product-item';
import { ProductItemSkeleton } from './product-skeleton';

// ----------------------------------------------------------------------

const PRODUCTS_PER_PAGE = 14; // Display 10 products per page

export function ProductList({ products, loading, ...other }) {
  const [page, setPage] = useState(1); // Track the current page number

  // Calculate the number of pages needed
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

  // Determine the products to show for the current page
  const paginatedProducts = useMemo(() => {
    const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    return products.slice(startIndex, endIndex);
  }, [page, products]);

  const renderLoading = <ProductItemSkeleton />;

  const renderList = paginatedProducts.map((product) => (
    <ProductItem key={product.id} product={product} />
  ));

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <div>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(3, 1fr)',
          md: 'repeat(4, 1fr)',
          lg: 'repeat(7, 1fr)',
        }}
        {...other}
      >
        {loading ? renderLoading : renderList}
      </Box>

      {/* Render pagination only if there are multiple pages */}
      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={page}
          onChange={handleChangePage}
          sx={{
            mt: { xs: 5, md: 8 },
            [`& .${paginationClasses.ul}`]: { justifyContent: 'center' },
          }}
        />
      )}
    </div>
  );
}
