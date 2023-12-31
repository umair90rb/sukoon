import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userIsLoadingSelector, userUsersSelector } from 'store/slices/user/userSelector';
import { fetchAllUser } from 'store/slices/user/fetchUser';
import ChipsArray from 'components/ChipArray';
import PropTypes from 'prop-types';
import { Box, Table, TableBody, TableCell, IconButton, TableContainer, TableHead, TableRow } from '@mui/material';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { authUserSelector } from 'store/slices/auth/authSelector';
import { setMessage } from 'store/slices/util/utilSlice';
import { setUserForUpdate, deleteUser } from 'store/slices/user/userSlice';
import { userService } from 'api/index';
const userTableHeadCell = [
  {
    id: 'id',
    label: 'ID.'
  },
  {
    id: 'name',
    label: 'Name'
  },
  {
    id: 'email',
    label: 'Email'
  },
  {
    id: 'phone',
    label: 'Phone'
  },
  {
    id: 'roles',
    label: 'Roles',
    component: ChipsArray,
    dataKey: 'name'
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

export default function UserTable({ order = 'desc', orderBy = 'id', openUpateForm }) {
  const dispatch = useDispatch();
  const userIsLoading = useSelector(userIsLoadingSelector);
  const users = useSelector(userUsersSelector);
  const user = useSelector(authUserSelector);

  useEffect(() => {
    dispatch(fetchAllUser());
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await userService.fetchDeleteUser(id);
      dispatch(setMessage({ message: 'User deleted!', type: 'success' }));
      dispatch(deleteUser(id));
    } catch (error) {
      dispatch(setMessage({ message: 'User not deleted!', type: 'error' }));
    }
  };

  const handleUpdate = (data, index) => {
    dispatch(setUserForUpdate({ data, index }));
    openUpateForm(true);
  };

  if (userIsLoading) {
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
              {userTableHeadCell.map((headCell) => (
                <TableCell key={headCell.id} align={'center'} padding={'normal'} sortDirection={orderBy === headCell.id ? order : false}>
                  {headCell.label}
                </TableCell>
              ))}
              <TableCell key={'actions'} align={'center'} padding={'normal'} sortDirection={orderBy === 'actions' ? order : false}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stableSort(users || [], getComparator(order, orderBy)).map((row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow hover role="checkbox" sx={{ '&:last-child td, &:last-child th': { border: 0 } }} tabIndex={-1} key={row[orderBy]}>
                  {userTableHeadCell.map(({ id: cellId, component: Component, dataKey }) => (
                    <TableCell key={Math.random()} id={labelId} component="th" align="center">
                      {Component ? <Component data={row[cellId]} dataKey={dataKey} /> : row[cellId]}
                    </TableCell>
                  ))}
                  <TableCell key={Math.random()} id={labelId} component="th" align="center">
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
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

UserTable.propTypes = {
  data: PropTypes.array.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  headCells: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
      dataKey: PropTypes.string,
      component: PropTypes.string
    })
  ).isRequired
};
