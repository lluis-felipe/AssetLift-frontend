import React, { useState, useEffect, Component } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Grid,
  Column,
  DataTable,
  Table,
  TableContainer,
  TableToolbar,
  TableBatchActions,
  TableBatchAction,
  TableToolbarContent,
  TableToolbarSearch,
  TableToolbarMenu,
  TableToolbarAction,
  TableSelectAll,
  TableSelectRow,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  DataTableSkeleton,
  Theme
} from '@carbon/react';
import { InfoSection, InfoCard } from '../../components/Info';
import { Globe, Application, PersonFavorite, Add, TrashCan, Save, Download } from '@carbon/react/icons';
import axios from 'axios';


const TableUsers = () => {
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

  const batchActionClick = (selectedRows) => {
    console.log('Selected Rows:', selectedRows);
  };

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
                <TableBatchActions {...batchActionProps}>
                  <TableBatchAction
                    tabIndex={batchActionProps.shouldShowBatchActions ? 0 : -1}
                    renderIcon={TrashCan}
                    onClick={batchActionClick(selectedRows)}>
                    Delete
                  </TableBatchAction>
                  <TableBatchAction
                    tabIndex={batchActionProps.shouldShowBatchActions ? 0 : -1}
                    renderIcon={Save}
                    onClick={batchActionClick(selectedRows)}>
                    Save
                  </TableBatchAction>
                  <TableBatchAction
                    tabIndex={batchActionProps.shouldShowBatchActions ? 0 : -1}
                    renderIcon={Download}
                    onClick={batchActionClick(selectedRows)}>
                    Download
                  </TableBatchAction>
                </TableBatchActions>
                <TableToolbarContent
                  aria-hidden={batchActionProps.shouldShowBatchActions}>
                  <TableToolbarSearch
                    tabIndex={batchActionProps.shouldShowBatchActions ? -1 : 0}
                    onChange={onInputChange}
                  />
                  <TableToolbarMenu
                    tabIndex={batchActionProps.shouldShowBatchActions ? -1 : 0}>
                    <TableToolbarAction onClick={() => alert('Alert 1')}>
                      Action 1
                    </TableToolbarAction>
                    <TableToolbarAction onClick={() => alert('Alert 2')}>
                      Action 2
                    </TableToolbarAction>
                    <TableToolbarAction onClick={() => alert('Alert 3')}>
                      Action 3
                    </TableToolbarAction>
                  </TableToolbarMenu>
                  <Button
                    tabIndex={batchActionProps.shouldShowBatchActions ? -1 : 0}
                    // onClick={action('Add new row')}
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
                        <TableCell key={cell.id}>{cell.value}</TableCell>
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

const headers = [
  {
    key: 'id',
    header: 'Id',
  },
  {
    key: 'username',
    header: 'Username',
  },
  {
    key: 'password',
    header: 'Password',
  },
];

class Users extends Component {


  render() {

    return (
      <Theme theme="g10">
        <Grid className="landing-page" fullWidth>
          <Column lg={16} md={8} sm={4}>
            
          </Column>
          <Column lg={16} md={8} sm={4} className="landing-page__r2">
            <TableUsers />
          </Column>
        </Grid>
      </Theme>
    );
  }
};

export default Users;
