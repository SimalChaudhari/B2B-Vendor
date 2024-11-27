import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

import { varAlpha } from 'src/theme/styles';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';
import { useNavigate } from 'react-router';

// ----------------------------------------------------------------------

export function ProductFiltersResult({ filters, totalResults, sx }) {


  const navigate = useNavigate();

  const handleResetClick = () => {
    filters.onResetState(); // First function to reset the filters
    navigate('/product');   // Second function to navigate to /product
  };

  const handleRemoveGender = (inputValue) => {
    const newValue = filters.state.gender.filter((item) => item !== inputValue);

    filters.setState({ gender: newValue });
  };

  const handleRemoveCategory = () => {
    filters.setState({ category: 'all' });
  };

  const handleRemovesubGroup1 = () => {
    filters.setState({ subGroup1: 'all' });
  };

  const handleRemovesubGroup2 = () => {
    filters.setState({ subGroup2: 'all' });
  };

  const handleRemoveColor = (inputValue) => {
    const newValue = filters.state.colors.filter((item) => item !== inputValue);

    filters.setState({ colors: newValue });
  };

  const handleRemovePrice = () => {
    filters.setState({ priceRange: [0, 200] });
  };

  const handleRemoveRating = () => {
    filters.setState({ rating: '' });
  };

  return (
    <FiltersResult totalResults={totalResults} onReset={handleResetClick} sx={sx}>
      <FiltersBlock label="Gender:" isShow={!!filters.state.gender.length}>
        {filters.state.gender.map((item) => (
          <Chip {...chipProps} key={item} label={item} onDelete={() => handleRemoveGender(item)} />
        ))}
      </FiltersBlock>

      <FiltersBlock label="Category:" isShow={filters.state.category !== 'all'}>
        <Chip {...chipProps} label={filters.state.category} onDelete={handleRemoveCategory} />
      </FiltersBlock>

      <FiltersBlock label="subGroup1:" isShow={filters.state.subGroup1 !== 'all'}>
        <Chip {...chipProps} label={filters.state.subGroup1} onDelete={handleRemovesubGroup1} />
      </FiltersBlock>

      <FiltersBlock label="subGroup2:" isShow={filters.state.subGroup2 !== 'all'}>
        <Chip {...chipProps} label={filters.state.subGroup2} onDelete={handleRemovesubGroup2} />
      </FiltersBlock>

      <FiltersBlock label="Colors:" isShow={!!filters.state.colors.length}>
        {filters.state.colors.map((item) => (
          <Chip
            {...chipProps}
            key={item}
            label={
              <Box
                sx={{
                  ml: -0.5,
                  width: 18,
                  height: 18,
                  bgcolor: item,
                  borderRadius: '50%',
                  border: (theme) =>
                    `solid 1px ${varAlpha(theme.vars.palette.common.whiteChannel, 0.24)}`,
                }}
              />
            }
            onDelete={() => handleRemoveColor(item)}
          />
        ))}
      </FiltersBlock>

      {/*
        <FiltersBlock
          label="Price:"
          isShow={filters.state.priceRange[0] !== 0 || filters.state.priceRange[1] !== 200}
        >
          <Chip
            {...chipProps}
            label={`$${filters.state.priceRange[0]} - ${filters.state.priceRange[1]}`}
            onDelete={handleRemovePrice}
          />
        </FiltersBlock>
         */}

      <FiltersBlock label="Rating:" isShow={!!filters.state.rating}>
        <Chip {...chipProps} label={filters.state.rating} onDelete={handleRemoveRating} />
      </FiltersBlock>
    </FiltersResult>
  );
}
