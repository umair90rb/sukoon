import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

export default function SalaryCard({ salary, allowances }) {
  return (
    <Card sx={{ maxWidth: 345, padding: 2 }}>
      <CardContent>
        <Typography variant="h5" color="text.primary">
          Base Salary: {salary}
        </Typography>
        {allowances.length > 0 &&
          allowances.map((allowance, index) => (
            <Typography key={index} variant="h5" color="text.primary">
              {allowance.type}: {allowance.amount}
            </Typography>
          ))}
        <Typography variant="h5" color="text.primary">
          Gross Salary: {salary + allowances.reduce((total, all) => all.amount + total, 0)}
        </Typography>
      </CardContent>
    </Card>
  );
}
