import { useCallback, useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import { usePopover } from 'src/components/custom-popover';

export function ProductToolbar({ options, filters,clearFilters }) {
    const popover = usePopover();
    const [selectedGroups, setSelectedGroups] = useState(filters.state.group || []);
    const [availableSubGroup1, setAvailableSubGroup1] = useState([]);
    const [selectedSubGroup1, setSelectedSubGroup1] = useState(filters.state.subGroup1 || []);
    const [availableSubGroup2, setAvailableSubGroup2] = useState([]);
    const [selectedSubGroup2, setSelectedSubGroup2] = useState(filters.state.subGroup2 || []);
   
    const uniqueGroups = Array.from(
        new Set(options.map(option => option.group.toLowerCase()))
    ).map(group => options.find(option => option.group.toLowerCase() === group).group);

    useEffect(() => {
        // Filtered options based on selected groups only
        const filteredOptions = options.filter(option => {
            const matchesGroup = selectedGroups.length === 0 || selectedGroups.includes(option.group);
            return matchesGroup;
        });
    
        // Update available SubGroup1 based on selected Groups only
        const availableSubGroup1Set = new Set();
        const availableSubGroup2Set = new Set();
    
        filteredOptions.forEach(option => {
            if (selectedGroups.includes(option.group)) {
                availableSubGroup1Set.add(option.subGroup1);
            }
        });
    
        // Update available SubGroup1 without removing options based on SubGroup2
        setAvailableSubGroup1(Array.from(availableSubGroup1Set));
    
        // Update available SubGroup2 based on selected groups and subgroup1 without restriction from each other
        options.forEach(option => {
            if (selectedGroups.includes(option.group) || selectedSubGroup1.includes(option.subGroup1)) {
                availableSubGroup2Set.add(option.subGroup2);
            }
        });
    
        setAvailableSubGroup2(Array.from(availableSubGroup2Set));
    
        // Filter selected subgroups to ensure they are valid with the new available options
        filters.setState(prev => ({
            ...prev,
            subGroup1: prev.subGroup1.filter(sub => availableSubGroup1Set.has(sub)),
            subGroup2: prev.subGroup2.filter(sub => availableSubGroup2Set.has(sub)),
        }));
    // }, [selectedGroups, options, selectedSubGroup1, filters]);
    }, [selectedGroups, selectedSubGroup1]);

    
    // Handle filter changes
    const handleFilterGroup = useCallback(
        (event) => {
            const newValue = typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;
           
            setSelectedGroups(newValue);
            filters.setState({ group: newValue });
            setSelectedSubGroup1([]); // Reset SubGroup1 on group change
            setSelectedSubGroup2([]); // Reset SubGroup2 on group change
        },
        [filters]
    );

    const handleFilterSubGroup1 = useCallback(
        (event) => {
            const newValue = typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;
           
            setSelectedSubGroup1(newValue);
            filters.setState({ subGroup1: newValue });
            setSelectedSubGroup2([]); // Reset SubGroup2 on SubGroup1 change
        },
        [filters]
    );

    const handleFilterSubGroup2 = useCallback(
        (event) => {
            const newValue = typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;
           
            setSelectedSubGroup2(newValue);
            filters.setState({ subGroup2: newValue });
        },
        [filters]
    );
//------------------------------------------------------------------------------------------------------------------

useEffect(() => {
    clearFilters.current = () => {
        setSelectedGroups([]);
        setSelectedSubGroup1([]);
        setSelectedSubGroup2([]);
        filters.setState({ group: [], subGroup1: [], subGroup2: [] });
    };
}, [clearFilters, filters]);

    
    return (

        <Stack
            spacing={2}
            direction="row"
            sx={{
                width: '100%', // Full width for the entire stack
                flexWrap: 'wrap', // Allow wrapping for smaller screens
                gap: 2, // Add spacing between elements
                // p: 2.5,
            }}
        >
            {/* Group Filter */}
            <FormControl sx={{ flex: 1, minWidth: 200 }}>
                <InputLabel htmlFor="group-filter-select-label">Group</InputLabel>
                <Select
                    multiple
                    value={selectedGroups}
                    onChange={handleFilterGroup}
                    input={<OutlinedInput label="Group" />}
                    renderValue={(selected) => selected.join(', ')}
                    inputProps={{ id: 'group-filter-select-label' }}
                    MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
                >
                    {uniqueGroups.map((option) => (
                        <MenuItem key={option} value={option}>
                            <Checkbox
                                disableRipple
                                size="small"
                                checked={selectedGroups.includes(option)}
                            />
                            {option}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* SubGroup1 Filter */}
            <FormControl sx={{ flex: 1, minWidth: 200 }}>
                <InputLabel htmlFor="subgroup1-filter-select-label">Sub-Group</InputLabel>
                <Select
                    multiple
                    value={selectedSubGroup1}
                    onChange={handleFilterSubGroup1}
                    input={<OutlinedInput label="SubGroup1" />}
                    renderValue={(selected) => selected.join(', ')}
                    inputProps={{ id: 'subgroup1-filter-select-label' }}
                    MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
                >
                    {availableSubGroup1.map((option) => (
                        <MenuItem key={option} value={option}>
                            <Checkbox
                                disableRipple
                                size="small"
                                checked={selectedSubGroup1.includes(option)}
                            />
                            {option}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* SubGroup2 Filter */}
            <FormControl sx={{ flex: 1, minWidth: 200 }}>
                <InputLabel htmlFor="subgroup2-filter-select-label">Sub-Group 2</InputLabel>
                <Select
                    multiple
                    value={selectedSubGroup2}
                    onChange={handleFilterSubGroup2}
                    input={<OutlinedInput label="SubGroup2" />}
                    renderValue={(selected) => selected.join(', ')}
                    inputProps={{ id: 'subgroup2-filter-select-label' }}
                    MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
                >
                    {availableSubGroup2.map((option) => (
                        <MenuItem key={option} value={option}>
                            <Checkbox
                                disableRipple
                                size="small"
                                checked={selectedSubGroup2.includes(option)}
                            />
                            {option}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Stack>


    );
}
