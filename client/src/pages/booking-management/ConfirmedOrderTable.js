import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { orderListIsLoadingSelector, orderListSelector } from 'store/slices/order/orderSelector';
import { fetchAllOrder } from 'store/slices/order/fetchOrder';
import location from 'utils/location';
const orderTableHeadCell = [
  {
    id: 'id',
    label: 'ID.'
  },
  {
    id: 'order_number',
    label: 'Order#'
  },
  {
    id: 'total_price',
    label: 'Total Amount'
  },
  {
    id: 'total_tax',
    label: 'Tax Amount'
  },
  {
    id: 'status',
    label: 'Order Status'
  },
  {
    id: 'total_discounts',
    label: 'Discount'
  },
  {
    id: 'createdAt',
    label: 'Received At'
  }
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export default function ConfirmedOrderTable({ order = 'desc', orderBy = 'id' }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const listIsLoading = useSelector(orderListIsLoadingSelector);
  // const orderImportIsLoading = useSelector(orderImportIsLoadingSelector);
  const orders = useSelector(orderListSelector);

  useEffect(() => {
    dispatch(fetchAllOrder({ body: { status: 'Confirmed' } }));
  }, []);

  if (listIsLoading) {
    return null;
  }

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          sx={{
            '& .MuiTableCell-root:first-of-type': {
              pl: 2
            },
            '& .MuiTableCell-root:last-of-type': {
              pr: 3
            }
          }}
        >
          <TableHead>
            <TableRow>
              {orderTableHeadCell.map((headCell) => (
                <TableCell key={headCell.id} align={'center'} padding={'normal'} sortDirection={orderBy === headCell.id ? order : false}>
                  {headCell.label}
                </TableCell>
              ))}
              {/* <TableCell key={'actions'} align={'center'} padding={'normal'} sortDirection={orderBy === 'actions' ? order : false}>
                Actions
              </TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {stableSort(orders || [], getComparator(order, orderBy)).map((row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  onClick={() => navigate(location.viewOrder(row['id']))}
                  hover
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  tabIndex={-1}
                  key={row[orderBy]}
                >
                  {orderTableHeadCell.map(({ id: cellId }) => (
                    <TableCell key={row['id']} id={labelId} component="th" align="center">
                      {row[cellId]}
                    </TableCell>
                  ))}
                  {/* <TableCell key={Math.random()} id={labelId} component="th" align="center">
                    <>
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleDelete(row.id)}
                        disabled={row['id'] === user.id}
                        size="large"
                        color="error"
                      >
                        <DeleteOutlined />
                      </IconButton>
                      <IconButton
                        aria-label="update"
                        onClick={() => handleUpdate(row, index)}
                        disabled={row['id'] === user.id}
                        size="large"
                        color="primary"
                      >
                        <EditOutlined />
                      </IconButton>
                    </>
                  </TableCell> */}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

ConfirmedOrderTable.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired
};
