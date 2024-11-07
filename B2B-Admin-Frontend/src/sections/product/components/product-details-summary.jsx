import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import { fCurrency } from 'src/utils/format-number';
import { Form } from 'src/components/hook-form';
import { itemGetByList } from 'src/store/action/productActions';
import { ProductDetailsCarousel } from './product-details-carousel';
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';

export function ProductDetailsSummary({ products, disableActions, ...other }) {
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(itemGetByList(id));
    }
  }, [id, dispatch]);

  return (
    <Form>
      <Stack spacing={4} sx={{ pt: 3, px: 3 }} {...other}>

        {/* Product Image and Basic Info */}
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <ProductDetailsCarousel images={products?.productImages ?? []} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>{products?.itemName}</Typography>
            <Typography variant="h6" color="primary.main">{fCurrency(products?.sellingPrice)}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
              {products?.description}
            </Typography>

             {/* Classification Table */}
             <Box mt={5}>
               <Typography variant="subtitle1" gutterBottom>Classification</Typography>
               <TableContainer component={Paper} elevation={0}>
                 <Table size="small" aria-label="classification table">
                   <TableBody>
                     <TableRow>
                       <TableCell>Group</TableCell>
                       <TableCell>{products?.group || '-'}</TableCell>
                     </TableRow>
                     <TableRow>
                       <TableCell>SubGroup1</TableCell>
                       <TableCell>{products?.subGroup1 || '-'}</TableCell>
                     </TableRow>
                     <TableRow>
                       <TableCell>SubGroup2</TableCell>
                       <TableCell>{products?.subGroup2 || '-'}</TableCell>
                     </TableRow>
                   </TableBody>
                 </Table>
               </TableContainer>
             </Box>
           </Grid>
         </Grid>

        <Divider sx={{ my: 2 }} />

       {/* Responsive Grid System */}
       <Grid container spacing={3}>

         {/* Box 1: Additional Information */}
         <Grid item xs={12} sm={6} md={4}>
           <Box>
             <Typography variant="subtitle1" gutterBottom>Additional Information</Typography>
             <Divider sx={{ my: 2 }} />
             <Stack spacing={1}>
               <Typography variant="body2">Alias: {products?.alias}</Typography>
               <Typography variant="body2">Part Number: {products?.partNo}</Typography>
               <Typography variant="body2">Selling Price Date: {products?.sellingPriceDate}</Typography>
             </Stack>
           </Box>
         </Grid>

         {/* Box 2: Tax & Unit Details */}
         <Grid item xs={12} sm={6} md={4}>
           <Box>
             <Typography variant="subtitle1" gutterBottom>Tax & Unit Details</Typography>
             <Divider sx={{ my: 2 }} />
             <Stack spacing={1}>
               <Typography variant="body2">GST Applicable: {products?.gstApplicable}</Typography>
               <Typography variant="body2">GST Applicable Date: {products?.gstApplicableDate}</Typography>
               <Typography variant="body2">GST Rate: {products?.gstRate}%</Typography>
               <Typography variant="body2">Base Unit: {products?.baseUnit}</Typography>
               <Typography variant="body2">Alternate Unit: {products?.alternateUnit}</Typography>
             </Stack>
           </Box>
         </Grid>

         {/* Box 3: Conversion & Dimensions */}
         <Grid item xs={12} sm={6} md={4}>
           <Box>
             <Typography variant="subtitle1" gutterBottom>Conversion & Dimensions</Typography>
             <Divider sx={{ my: 2 }} />
             <Stack spacing={1}>
               <Typography variant="body2">Taxability: {products?.taxability}</Typography>
               <Typography variant="body2">Conversion: {products?.conversion}</Typography>
               <Typography variant="body2">Denominator: {products?.denominator}</Typography>

               <Box>
                 <Typography variant="body2">Dimensional Files:</Typography>
                 <Divider sx={{ my: 2 }} />
                 {products?.dimensionalFiles?.length > 0 ? (
                   <Stack direction="column" spacing={0.5} sx={{ ml: 2, mt: 1 }}>
                     {products.dimensionalFiles.map((file, index) => (
                       <a
                         key={index}
                         href={file}
                         target="_blank"
                         rel="noopener noreferrer"
                         style={{ textDecoration: 'none', color: '#1976d2' }}
                       >
                         Dimensional File {index + 1}
                       </a>
                     ))}
                   </Stack>
                 ) : (
                   <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                     No dimensional files available
                   </Typography>
                 )}
               </Box>
             </Stack>
           </Box>
         </Grid>

       </Grid>

     </Stack>
     <Divider sx={{ my: 2 }} />
   </Form>
  );
}
