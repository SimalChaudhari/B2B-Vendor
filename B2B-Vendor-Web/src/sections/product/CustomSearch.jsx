import React, { useState } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { Iconify } from 'src/components/iconify'; // Replace this with your icon if necessary

export function CustomSearch({ query, onSearch, placeholder = 'Search...' }) {
  const [inputValue, setInputValue] = useState(query);

  const handleChange = (event) => {
    const value = event?.target?.value;  // ESLint warning here
    // console.log('====================================');
    // console.log("value :", value);
    // console.log('====================================');
    setInputValue(value);
    onSearch(value); // Trigger the parent search handler
  };
  

  return (
    <TextField
      value={inputValue}
      onChange={handleChange}
      placeholder={placeholder}
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
          </InputAdornment>
        ),
      }}
      sx={{ maxWidth: 400, marginBottom: 2 }}
    />
  );
}
