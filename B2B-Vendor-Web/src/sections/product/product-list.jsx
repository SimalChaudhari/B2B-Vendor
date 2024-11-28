import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { ProductItem } from './product-item';
import { ProductItemSkeleton } from './product-skeleton';

// ----------------------------------------------------------------------

const PRODUCTS_PER_PAGE = 12; // Display 10 products per page
// const PRODUCTS_PER_PAGE = 14; // Display 10 products per page

export function ProductList({ products, loading, page, setPage, ...other }) {
  // const [page, setPage] = useState(1); // Track the current page number

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
          xs: 'repeat(1, 1fr)',    // 1 column on extra small screens
          sm: 'repeat(3, 1fr)',    // 3 columns on small screens
          md: 'repeat(4, 1fr)',    // 4 columns on medium screens
          lg: 'repeat(5, 1fr)',    // 5 columns on large screens
          xl: 'repeat(6, 1fr)',    // 6 columns on extra large screens
          '2xl': 'repeat(7, 1fr)', // 7 columns on 2xl screens (if your system supports '2xl' breakpoint)
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
