import { useCallback } from 'react';
import Stack from '@mui/material/Stack';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { formHelperTextClasses } from '@mui/material/FormHelperText';
import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { fIsBetween } from 'src/utils/format-time';
import { generatePrintableContent } from '../components/file-downlaod/pdf-generation';
import { exportToExcel } from '../components/file-downlaod/excel-generation';
// ----------------------------------------------------------------------

export function LedgerTableToolbar({ filters, onResetPage, dateError, data }) {

  const popover = usePopover();

  const handleFilterName = useCallback(
    (event) => {
      onResetPage();
      filters.setState({ name: event.target.value });
    },
    [filters, onResetPage]
  );

  const handleFilterStartDate = useCallback(
    (newValue) => {
      onResetPage();
      filters.setState({ startDate: newValue });
    },
    [filters, onResetPage]
  );

  const handleFilterEndDate = useCallback(
    (newValue) => {
      onResetPage();
      filters.setState({ endDate: newValue });
    },
    [filters, onResetPage]
  );

  const handlePrint = () => {
    if (!data || data.length === 0) {
      console.error('No data available for export.');
      return;
    }

    const { startDate, endDate } = filters.state;

    // Filter data based on the date range

    const filteredData = startDate && endDate
      ? data.filter((item) => fIsBetween(item.createdAt, startDate, endDate))
      : data;

    if (filteredData.length === 0) {
      console.warn('No data found for the selected date range.');
      return;
    }

    // Generate printable content
    const printableContent = generatePrintableContent(filteredData);

    // Open a new window and print the content
    const newWindow = window.open('', '_blank');
    newWindow.document.write(printableContent);
    newWindow.document.close();
    newWindow.print();
  };



  const handleExport = () => {
    exportToExcel(data, filters, fIsBetween);
  };


  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
      >



        <DatePicker
          label="Start date"
          value={filters.state.startDate}
          onChange={handleFilterStartDate}
          slotProps={{ textField: { fullWidth: true } }}
          sx={{ maxWidth: { md: 200 } }}
        />

        <DatePicker
          label="End date"
          value={filters.state.endDate}
          onChange={handleFilterEndDate}
          slotProps={{
            textField: {
              fullWidth: true,
              error: dateError,
              helperText: dateError ? 'End date must be later than start date' : null,
            },
          }}
          sx={{
            maxWidth: { md: 200 },
            [`& .${formHelperTextClasses.root}`]: {
              position: { md: 'absolute' },
              bottom: { md: -40 },
            },
          }}
        />

        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            fullWidth
            value={filters.state.name}
            onChange={handleFilterName}
            placeholder="Search customer or order number..."
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

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              popover.onClose();
              handlePrint()
            }}
          >
            <Iconify icon="solar:printer-minimalistic-bold" />
            Print
          </MenuItem>

          <MenuItem

            onClick={() => {
              popover.onClose();
              handleExport(); // Call export function on "Export" button click
            }}
          >
            <Iconify icon="solar:export-bold" />
            Export
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}
