import React from 'react';
import { Divider, Grid, Card, CardContent, Typography } from '@mui/material';

const OrderSummaryCard = ({ payments, discount, subtotal, tax, total }) => {
  return (
    <Card sx={{ minWidth: 275, mt: 2, padding: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
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
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">Tax:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" align="right">
              Rs.{tax}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">Discount:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" align="right">
              Rs.{discount}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>

          {payments && Array.isArray(payments) && payments.length > 0 && (
            <>
              <Grid item xs={6}>
                <Typography variant="body1">Received Payments:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" align="right">
                  Rs.
                  {payments != undefined &&
                    Array.isArray(payments) &&
                    payments.reduce((prev, payment) => (payment.type === 'received' ? payment.amount + prev : prev), 0)}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body1">Pending Payments:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" align="right">
                  Rs.
                  {payments != undefined &&
                    Array.isArray(payments) &&
                    payments.reduce((prev, payment) => (payment.type === 'pending' ? payment.amount + prev : prev), 0)}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
            </>
          )}

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
