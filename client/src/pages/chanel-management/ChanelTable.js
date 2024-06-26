import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';
import { chanelChanelsSelector, chanelIsLoadingSelector } from 'store/slices/chanel/chanelSelector';
import { fetchAllChanel, fetchDeleteChanel } from 'store/slices/chanel/fetchChanel';
import { deleteChanel } from 'store/slices/chanel/chanelSlice';
import useAccess from 'hooks/useAccess';
import { PERMISSIONS } from 'constants/permissions-and-roles';

const columns = (handleEditAction, handleDeleteAction) => [
  {
    field: 'id',
    headerName: 'ID',
    flex: 0.3
  },
  {
    field: 'name',
    headerName: 'Name',
    flex: 1.3
  },
  {
    field: 'source',
    headerName: 'Source',
    flex: 1.3
  },
  {
    field: 'brand',
    headerName: 'Brand',
    flex: 1.1,
    valueGetter: ({ value }) => value && value.name
  },
  {
    field: 'actions',
    headerName: 'Actions',
    flex: 1,
    type: 'actions',
    cellClassName: 'actions',
    getActions: ({ id, row }) => {
      const actions = [];
      if (handleEditAction) {
        actions.push(
          <GridActionsCellItem
            key={id}
            icon={<EditIcon />}
            label="View"
            className="textPrimary"
            onClick={() => handleEditAction(row)}
            color="inherit"
          />
        );
      }
      if (handleDeleteAction) {
        actions.push(
          <GridActionsCellItem
            key={id}
            icon={<DeleteIcon />}
            label="Disable"
            className="textPrimary"
            onClick={() => handleDeleteAction(id)}
            color="inherit"
          />
        );
      }
      return actions;
    }
  }
];

export default function ChanelTable({ updateChanelHandler }) {
  const dispatch = useDispatch();
  const chanelsIsLoading = useSelector(chanelIsLoadingSelector);
  const chanels = useSelector(chanelChanelsSelector);
  const { hasPermission } = useAccess();

  useEffect(() => {
    dispatch(fetchAllChanel());
  }, []);

  const handleDelete = (id) => {
    dispatch(fetchDeleteChanel({ id })).then((action) => {
      if (action.type === 'chanel/delete/fetch/fulfilled') {
        dispatch(deleteChanel({ id }));
      }
    });
  };

  return (
    <div style={{ width: '100%' }}>
      <DataGrid
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true
          }
        }}
        loading={chanelsIsLoading}
        pageSizeOptions={[25, 50, 75, 100]}
        rows={chanels}
        columns={columns(
          hasPermission(PERMISSIONS.PERMISSION_UPDATE_SALES_CHANEL) ? updateChanelHandler : undefined,
          hasPermission(PERMISSIONS.PERMISSION_DELETE_SALES_CHANEL) ? handleDelete : undefined
        )}
      />
    </div>
  );
}
