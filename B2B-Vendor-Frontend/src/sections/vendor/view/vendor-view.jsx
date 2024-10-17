import { useEffect } from 'react';
import { DashboardContent } from 'src/layouts/dashboard';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { vendorGetByList } from 'src/store/action/vendorActions';
import {
  Card,
  CardHeader,
  Divider,
  Stack,
  Box,
  Grid,
  Typography,
  Alert,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export function VendorView() {
  const dispatch = useDispatch();
  const { id } = useParams(); // Get the vendor ID from URL
  const vendors = useSelector((state) => state.vendor.getByVendor); // Access the vendor from the Redux store

  useEffect(() => {
    // Fetch the vendor data when the component mounts
    if (id) {
      dispatch(vendorGetByList(id));
    }
  }, [id, dispatch]);

  return (
    <DashboardContent maxWidth='2xl'>
      <CustomBreadcrumbs
        heading="View"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Vendors', href: paths?.dashboard?.vendor?.root },
          { name: 'View' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Stack spacing={3}>
          <Card 
            sx={{ 
              width: '100%', 
              boxShadow: 3, 
              padding: 3, 
              borderRadius: 2,
              bgcolor: 'white', // White background for the card
            }}
          >
            <CardHeader title="Vendor" sx={{ py: 2 }} />
            <Divider />

    
              <Stack spacing={3} sx={{ p: 2 }}>
                <Grid container spacing={3}>
                  {[
                    { label: 'SL No', value: vendors.slno, icon: 'mdi:numeric' },
                    { label: 'Name', value: vendors.name, icon: 'mdi:account-circle' },
                    { label: 'Alias', value: vendors.alias, icon: 'mdi:label' },
                    { label: 'Active', value: vendors.active ? 'Yes' : 'No', icon: 'mdi:check-circle' },
                    { label: 'Parent', value: vendors.parent, icon: 'mdi:account-group' },
                    { label: 'Address', value: vendors.address, icon: 'mdi:home' },
                    { label: 'Country', value: vendors.country, icon: 'mdi:earth' },
                    { label: 'State', value: vendors.state, icon: 'mdi:map' },
                    { label: 'Pincode', value: vendors.pincode, icon: 'mdi:pin' },
                    { label: 'Contact Person', value: vendors.contactperson, icon: 'mdi:account' },
                    { label: 'Phone', value: vendors.phone, icon: 'mdi:phone' },
                    { label: 'Email', value: vendors.email, icon: 'mdi:email' },
                    { label: 'PAN', value: vendors.pan, icon: 'mdi:credit-card' },
                    { label: 'GST Type', value: vendors.gsttype, icon: 'mdi:tag' },
                    { label: 'GST No', value: vendors.gstno, icon: 'mdi:barcode' },
                    { label: 'GST Details', value: vendors.gstdetails, icon: 'mdi:clipboard-text' },
                  ].map((item) => (
                    <Grid item xs={12} sm={6} key={item.label}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Iconify icon={item.icon} sx={{ marginRight: 1, color: 'primary.main' }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {item.label}:
                        </Typography>
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {item.value || 'Not Available'}
                        </Typography>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
              </Stack>
           
          </Card>
        </Stack>
    </DashboardContent>
  );
}
