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
  TableBatchAction,
  TableBatchActions,
  Link,
  TableToolbarMenu,
  Theme,
  TableToolbarAction,
  Heading
} from '@carbon/react';
import { TrashCan, Download } from '@carbon/react/icons';
import axios from 'axios';

const headers = [
  { key: 'id', header: 'Id' },
  { key: 'status', header: 'Status' },
  { key: 'associatedasset', header: 'Associated Asset' },
  { key: 'createddate', header: 'Created Date' },
  { key: 'duedate', header: 'Due Date' },
  { key: 'worktype', header: 'Work Type' },
];

const TableWorkorder = () => {

  function deleteWorkorder(selectedRows) {
    const idsToDelete = selectedRows.map((row) => row.id);
    idsToDelete.forEach((id) => {
      axios.delete(`assetlift/workorder/${id}`)
        .then((response) => {
          console.log(`Deleted workorder with id: ${id}`);
          setRows((prevRows) =>
            prevRows.filter((row) => row.id !== id)
          );
        })
        .catch((error) => {
          console.error(`Error deleting workorder with id ${id}:`, error);
        });
    });
  }

  const [rows, setRows] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get('assetlift/workorder');
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
              // title="DataTable"
              // description="With batch actions. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas accumsan mauris sed congue egestas. Integer varius mauris vel arcu pulvinar bibendum non sit amet ligula. Nullam ut nisi eu tellus aliquet vestibulum vel sit amet odio."
              {...getTableContainerProps()}>
              <TableToolbar {...getToolbarProps()}>
                <TableBatchActions {...batchActionProps}>
                  <TableBatchAction
                    tabIndex={batchActionProps.shouldShowBatchActions ? 0 : -1}
                    renderIcon={TrashCan}
                    onClick={() => deleteWorkorder(selectedRows)}>
                    Delete
                  </TableBatchAction>

                  <TableBatchAction
                    tabIndex={batchActionProps.shouldShowBatchActions ? 0 : -1}
                    renderIcon={Download}
                  // onClick={batchActionClick(selectedRows)}
                  >
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
                    href="assetform"
                    tabIndex={batchActionProps.shouldShowBatchActions ? -1 : 0}
                    size="small"
                    kind="primary"
                  >
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
                          <Link href={`/workorderform?workorderid=${row.id}`}>{cell.value}</Link>
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
  );
};

class Workorder extends Component {
  render() {
    return (
      <Theme theme="g10">
        <Grid className="landing-page" fullWidth>
          <Column lg={16} md={8} sm={4} className="landing-page__r2">
            <Heading>Workorder</Heading>
            <TableWorkorder />
          </Column>
        </Grid>
      </Theme>
    );
  }
}

export default Workorder;