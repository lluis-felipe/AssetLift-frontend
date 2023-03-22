import React, { useState, useEffect, Component } from 'react';
import {
  Button,
  Grid,
  Column,
  DataTable,
  Table,
  TableContainer,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  TableSelectAll,
  TableSelectRow,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  DataTableSkeleton,
  Link,
  Theme
} from '@carbon/react';
import { InfoSection, InfoCard } from '../../components/Info';
import { Globe, Application, PersonFavorite, Add, TrashCan, Save, Download } from '@carbon/react/icons';
import axios from 'axios';

const headers = [
  { key: 'username', header: 'Username' },
  { key: 'password', header: 'Password' }
  // { key: 'role', header: 'Role' },
  // { key: 'status', header: 'Status' },
  // { key: 'actions', header: 'Actions' }
];

const TableUsers = () => {

  function deleteUser(selectedRows) {
    const idsToDelete = selectedRows.map((row) => row.id);
    idsToDelete.forEach((id) => {
      axios.delete(`assetlift/user/${id}`)
        .then((response) => {
          console.log(`Deleted user with id: ${id}`);
          setRows((prevRows) =>
            prevRows.filter((row) => row.id !== id)
          );
        })
        .catch((error) => {
          console.error(`Error deleting user with id ${id}:`, error);
        });
    });
  }

  const [rows, setRows] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get('assetlift/user');
      console.log(response.data);
      setRows(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <DataTable rows={rows} headers={headers}>
        {({
          rows,
          headers,
          getHeaderProps,
          getRowProps,
          getSelectionProps,
          getToolbarProps,
          getBatchActionProps,
          onInputChange,
          selectedRows,
          getTableProps,
          getTableContainerProps,
        }) => {
          const batchActionProps = getBatchActionProps();

          return (
            <TableContainer
              title="Users"
              description={
                <p>
                  The main objective of user application management is to provide users with
                  the necessary tools and resources to perform their job functions efficiently
                  and effectively.
                  <br />
                  This may involve ensuring that user applications are available
                  and accessible, providing training and support for users, and monitoring application
                  usage to identify and address any issues or inefficiencies.
                </p>
              }
              {...getTableContainerProps()}>
              <TableToolbar {...getToolbarProps()}>
                <TableToolbarContent
                  aria-hidden={batchActionProps.shouldShowBatchActions}>
                  <TableToolbarSearch
                    tabIndex={batchActionProps.shouldShowBatchActions ? -1 : 0}
                    onChange={onInputChange}
                  />
                  <Button
                    tabIndex={batchActionProps.shouldShowBatchActions ? -1 : 0}
                    renderIcon={TrashCan}
                    iconDescription="Delete"
                    onClick={() => deleteUser(selectedRows)}
                    hasIconOnly
                    size="small"
                    kind="ghost">
                    Delete
                  </Button>
                  <Button
                    href="add-user"
                    tabIndex={batchActionProps.shouldShowBatchActions ? -1 : 0}
                    size="small"
                    kind="primary">
                    Add new
                  </Button>
                </TableToolbarContent>
              </TableToolbar>
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    <TableSelectAll {...getSelectionProps()} />
                    {headers.map((header, i) => (
                      <TableHeader key={i} {...getHeaderProps({ header })}>
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, i) => (
                    <TableRow key={i} {...getRowProps({ row })}>
                      <TableSelectRow {...getSelectionProps({ row })} />
                      {row.cells.map((cell) => (
                        <TableCell key={cell.id}>
                          <Link href={`/add-user?userid=${row.id}`}>{cell.value}</Link>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          );
        }}
      </DataTable>
    </div>
  );
};

class Users extends Component {
  render() {
    return (
      <Theme theme="g10">
        <Grid className="landing-page" fullWidth>
          <Column lg={16} md={8} sm={4} className="landing-page__r2">
            <TableUsers />
          </Column>
        </Grid>
      </Theme>
    );
  }
}

export default Users;