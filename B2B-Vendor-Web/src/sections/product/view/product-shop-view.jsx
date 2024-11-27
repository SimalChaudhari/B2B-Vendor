import { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';
import { useDebounce } from 'src/hooks/use-debounce';
import { useSetState } from 'src/hooks/use-set-state';

import { orderBy } from 'src/utils/helper';

import { useSearchProducts } from 'src/actions/product';
import {
  // PRODUCT_SORT_OPTIONS,
  PRODUCT_COLOR_OPTIONS,
  PRODUCT_GENDER_OPTIONS,
  PRODUCT_RATING_OPTIONS,
  PRODUCT_CATEGORY_OPTIONS,
} from 'src/_mock';

import { EmptyContent } from 'src/components/empty-content';

import { ProductList } from '../product-list';
import { ProductSort } from '../product-sort';
import { ProductSearch } from '../product-search';
import { CartIcon } from '../components/cart-icon';
import { ProductFilters } from '../product-filters';
import { useCheckoutContext } from '../../checkout/context';
import { ProductFiltersResult } from '../product-filters-result';
import { CustomSearch } from '../CustomSearch';
import { fetchItemsSearch } from 'src/services/productApi';

export function ProductShopView({ products = [], loading }) {

  const [page, setPage] = useState(1);
  // Extract unique item names
  const uniqueItemNames = Array.from(new Set(products.map(product => product.group)));
  const uniqueItemsubGroup1 = Array.from(new Set(products.map(product => product.subGroup1)));
  const uniqueItemsubGroup2 = Array.from(new Set(products.map(product => product.subGroup2)));

  const items = useSelector((state) => state.product.items.data);

  const PRODUCT_SORT_OPTIONS = [
    { value: 'AtoZ', label: 'A to Z' },
    { value: 'newest', label: 'Newest' },
    { value: 'priceDesc', label: 'Price: High - Low' },
    { value: 'priceAsc', label: 'Price: Low - High' },
  ];  

  // console.log(PRODUCT_SORT_OPTIONS);

  const checkout = useCheckoutContext();

  const openFilters = useBoolean();

  const [sortBy, setSortBy] = useState('AtoZ');

  const [searchQuery, setSearchQuery] = useState('');

  const [searchResults, setSearchResults] = useState([]);

  const [searchLoading, setSearchLoading] = useState(false);

  const debouncedQuery = useDebounce(searchQuery);

  
  useEffect(() => {
    if (debouncedQuery) {
      setPage(1); 
    }
  }, [debouncedQuery]);
  
  const filters = useSetState({
    gender: [],
    colors: [],
    rating: '',
    category: 'all',
    subGroup1 : 'all',
    subGroup2 : 'all',
    // priceRange: [0, 200000],
  });

  // const { searchResults, searchLoading } = fetchItemsSearch(debouncedQuery);
   // Fetch items based on search query
   useEffect(() => {
    const fetchSearchResults = async () => {
      if (debouncedQuery) {
        setSearchLoading(true);
        try {
          const results = await fetchItemsSearch(debouncedQuery);
          setSearchResults(results);
        } catch (error) {
          console.error('Error fetching search results:', error);
        } finally {
          setSearchLoading(false);
        }
      } else {
        setSearchResults([]);
      }
    };

    fetchSearchResults();
  }, [debouncedQuery]);

  // const dataFiltered = applyFilter({ inputData: products, filters: filters.state, sortBy, searchQuery: debouncedQuery });
  const dataFiltered = applyFilter({
    inputData: debouncedQuery ? searchResults : products, // Use searchResults if query exists, otherwise products
    filters: filters.state,
    sortBy,
    searchQuery: debouncedQuery,
  });
  
  // Reset the page to 1 whenever filters are changed
  useEffect(() => {
   setPage(1);
 }, [filters.state, sortBy]);
  
  
  const canReset =
    filters.state.gender.length > 0 ||
    filters.state.colors.length > 0 ||
    filters.state.rating !== '' ||
    filters.state.category !== 'all' ||
    filters.state.subGroup1 !== 'all' ||
    filters.state.subGroup2 !== 'all';
    // filters.state.priceRange[0] !== 0 ||
    // filters.state.priceRange[1] !== 200000;

  const notFound = !dataFiltered.length && canReset;

  const handleSortBy = useCallback((newValue) => {
    setSortBy(newValue);
  }, []);

  const handleSearch = useCallback((inputValue) => {
    setSearchQuery(inputValue);
  }, []);

  // const productsEmpty = !loading && !products?.length;
  const productsEmpty = !loading && !dataFiltered?.length;

  const renderFilters = (
    <Stack
      spacing={3}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-end', sm: 'center' }}
      direction={{ xs: 'column', sm: 'row' }}
    >
    {/*
      <ProductSearch
        query={debouncedQuery}
        results={searchResults}
        onSearch={handleSearch}
        loading={searchLoading}
      />
     */}
      <CustomSearch
        value={debouncedQuery}
        onSearch={handleSearch}
        loading={searchLoading} // pass loading state for better UX
      />

      <Stack direction="row" spacing={1} flexShrink={0}>
        <ProductFilters
          filters={filters}
          canReset={canReset}
          open={openFilters.value}
          onOpen={openFilters.onTrue}
          onClose={openFilters.onFalse}
          options={{
            colors: PRODUCT_COLOR_OPTIONS,
            ratings: PRODUCT_RATING_OPTIONS,
            genders: PRODUCT_GENDER_OPTIONS,
            categories: ['all', ...uniqueItemNames],
            subGroups1: ['all', ...uniqueItemsubGroup1],
            subGroups2: ['all', ...uniqueItemsubGroup2],
          }}
        />

        <ProductSort sort={sortBy} onSort={handleSortBy} sortOptions={PRODUCT_SORT_OPTIONS} />
      </Stack>
    </Stack>
  );

  const renderResults = (
    <ProductFiltersResult filters={filters} totalResults={dataFiltered.length} />
  );

  const renderNotFound = <EmptyContent filled sx={{ py: 10 }} />;

  return (
    <Container sx={{ mb: 15 }}>
      <CartIcon totalItems={checkout.totalItems} />

      {/* 
        <Typography variant="h4" sx={{ my: { xs: 3, md: 5 } }}>
          Shop
        </Typography>
        */}

      <Stack spacing={2.5} sx={{ mb: { xs: 3, md: 5 } }}>
        {renderFilters}

        {canReset && renderResults}
      </Stack>

      {(notFound || productsEmpty) && renderNotFound}

      <ProductList products={dataFiltered} loading={loading} page={page} setPage={setPage}  />
    </Container>
  );
}

function applyFilter({ inputData, filters, sortBy }) {
  
  // const { gender, category, colors, priceRange, rating, subGroup1, subGroup2 } = filters;
  const { gender, category, colors, rating, subGroup1, subGroup2 } = filters;

  // const min = priceRange[0];

  // const max = priceRange[1];
  
  // Sort by
  // if (sortBy === 'featured') {
  //   inputData = orderBy(inputData, ['totalSold'], ['desc']);
  // }

  // if (sortBy === 'newest') {
  //   inputData = orderBy(inputData, ['createdAt'], ['desc']);
  // }

  // if (sortBy === 'priceDesc') {
  //   inputData = orderBy(inputData, ['price'], ['desc']);
  // }

  // if (sortBy === 'priceAsc') {
  //   inputData = orderBy(inputData, ['price'], ['asc']);
  // }

  // Parse sellingPrice to Number for proper sorting
  inputData = inputData.map((product) => ({
    ...product,
    sellingPrice: Number(product.sellingPrice.replace(/[^0-9.-]+/g, '')),
  }));


   // Sort by
  switch (sortBy) {
    case 'AtoZ':
      inputData = inputData.sort((a, b) => a.itemName.localeCompare(b.itemName));
      break;
    case 'newest':
      inputData = inputData.sort((a, b) => a.id.localeCompare(b.id));
      break;
    case 'priceDesc':
      inputData = inputData.sort((a, b) => parseFloat(b.sellingPrice) - parseFloat(a.sellingPrice));
      break;
    case 'priceAsc':
      inputData = inputData.sort((a, b) => parseFloat(a.sellingPrice) - parseFloat(b.sellingPrice));
      break;
    default:
      inputData = inputData.sort((a, b) => a.id.localeCompare(b.id));
      break;
  }

  // filters
  if (gender.length) {
    inputData = inputData.filter((product) => product.gender.some((i) => gender.includes(i)));
  }

  if (category !== 'all') {
    inputData = inputData.filter((products) => products.group === category);
  }

  if (subGroup1 !== 'all') {
    inputData = inputData.filter((products) => products.subGroup1 === subGroup1);
  }

  if (subGroup2 !== 'all') {
    inputData = inputData.filter((products) => products.subGroup2 === subGroup2);
  }

  if (colors.length) {
    inputData = inputData.filter((product) =>
      product.colors.some((color) => colors.includes(color))
    );
  }

  // if (min !== 0 || max !== 200000) {
  //   inputData = inputData.filter((products) => products.sellingPrice >= min && products.sellingPrice <= max);
  // }

  if (rating) {
    inputData = inputData.filter((product) => {
      const convertRating = (value) => {
        if (value === 'up4Star') return 4;
        if (value === 'up3Star') return 3;
        if (value === 'up2Star') return 2;
        return 1;
      };
      return product.totalRatings > convertRating(rating);
    });
  }

  return inputData;
}
