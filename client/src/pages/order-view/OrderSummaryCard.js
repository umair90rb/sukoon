import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';

const OrderSummaryCard = ({ subtotal, tax, total }) => {
  return (
    <Card sx={{ minWidth: 275, mt: 2, padding: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Order Summary
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body1">Subtotal:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" align="right">
              Rs.{subtotal}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">Tax:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" align="right">
              Rs.{tax}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" className="total-label">
              Total:
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" align="right" className="total-value">
              Rs.{total}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default OrderSummaryCard;
