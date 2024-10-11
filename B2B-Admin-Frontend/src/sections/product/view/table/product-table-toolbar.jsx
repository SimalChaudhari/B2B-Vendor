import { useCallback, useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

export function ProductTableToolbar({ options, filters, onResetPage }) {
    const popover = usePopover();
    const [availableSubcategories, setAvailableSubcategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState(filters.state.group || []);

    // Remove duplicates (case-insensitive) from categories
    const uniqueCategories = Array.from(
        new Set(options.map(option => option.group.toLowerCase()))
    ).map(group =>
        options.find(option => option.group.toLowerCase() === group).group
    );

    // Update available subcategories when selected categories change
    useEffect(() => {
        const subcategories = options
            .filter(option => selectedCategories.includes(option.group))
            .map(option => option.group);

        // Remove duplicates (case-insensitive)
        const uniqueSubcategories = Array.from(new Set(subcategories.map(sub => sub.toLowerCase()))).map(sub =>
            subcategories.find(s => s.toLowerCase() === sub)
        );

        setAvailableSubcategories(uniqueSubcategories);
        // Clear selected subcategories if they no longer exist in available subcategories
        filters.setState(prev => ({
            ...prev,
            subcategory: prev.subcategory.filter(sub => uniqueSubcategories.includes(sub))
        }));
    }, [selectedCategories, options, filters]);

    // Handle filter by category
    const handleFilterCategory = useCallback(
        (event) => {
            const newValue = typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;
            onResetPage();
            setSelectedCategories(newValue);
            filters.setState({ category: newValue });
        },
        [filters, onResetPage]
    );

    // Handle filter by subcategory
    const handleFilterSubcategory = useCallback(
        (event) => {
            const newValue = typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;
            onResetPage();
            filters.setState({ subcategory: newValue });
        },
        [filters, onResetPage]
    );

    // Handle filter by search term
    const handleFilterName = useCallback(
        (event) => {
            onResetPage();
            filters.setState({ searchTerm: event.target.value });
        },
        [filters, onResetPage]
    );

    return (
        <>
            <Stack
                spacing={2}
                alignItems={{ xs: 'flex-end', md: 'center' }}
                direction={{ xs: 'column', md: 'row' }}
                sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
            >
                {/* Category Filter */}
                <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
                    <InputLabel htmlFor="category-filter-select-label">Category</InputLabel>
                    <Select
                        multiple
                        value={selectedCategories}
                        onChange={handleFilterCategory}
                        input={<OutlinedInput label="Category" />}
                        renderValue={(selected) => selected.join(', ')}
                        inputProps={{ id: 'category-filter-select-label' }}
                        MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
                    >
                        {uniqueCategories.map((option) => (
                            <MenuItem key={option} value={option}>
                                <Checkbox
                                    disableRipple
                                    size="small"
                                    checked={selectedCategories.includes(option)}
                                />
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Subcategory Filter */}
                <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
                    <InputLabel htmlFor="subcategory-filter-select-label">Subcategory</InputLabel>
                    <Select
                        multiple
                        value={filters.state.subcategory || []}
                        onChange={handleFilterSubcategory}
                        input={<OutlinedInput label="Subcategory" />}
                        renderValue={(selected) => selected.join(', ')}
                        inputProps={{ id: 'subcategory-filter-select-label' }}
                        MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
                    >
                        {availableSubcategories.map((option) => (
                            <MenuItem key={option} value={option}>
                                <Checkbox
                                    disableRipple
                                    size="small"
                                    checked={filters.state.subcategory?.includes(option) || false}
                                />
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Search Filter */}
                <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
                    <TextField
                        fullWidth
                        value={filters.state.searchTerm}
                        onChange={handleFilterName}
                        placeholder="Search..."
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <IconButton onClick={popover.onOpen}>
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </Stack>
            </Stack>

            {/* Popover Menu for additional actions */}
            <CustomPopover
                open={popover.open}
                anchorEl={popover.anchorEl}
                onClose={popover.onClose}
                slotProps={{ arrow: { placement: 'right-top' } }}
            >
                <MenuList>
                    <MenuItem onClick={popover.onClose}>
                        <Iconify icon="solar:printer-minimalistic-bold" />
                        Print
                    </MenuItem>

                    <MenuItem onClick={popover.onClose}>
                        <Iconify icon="solar:import-bold" />
                        Import
                    </MenuItem>

                    <MenuItem onClick={popover.onClose}>
                        <Iconify icon="solar:export-bold" />
                        Export
                    </MenuItem>
                </MenuList>
            </CustomPopover>
        </>
    );
}
