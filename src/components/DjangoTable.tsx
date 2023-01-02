import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import { alpha } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import * as React from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import { useTranslation } from "react-i18next";
import MoodBadIcon from "@mui/icons-material/MoodBad";
import SuspenseLoading from "./SuspenseLoading";
function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

interface HeadCell {
  key: string;
  disablePadding: boolean;
  label: string;
  numeric: boolean;
}

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: any) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
  headCells: HeadCell[];
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler =
    (property: any) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {props.headCells.map((headCell) => (
          <TableCell
            key={headCell.key}
            className="capitalize"
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.key ? order : false}>
            <TableSortLabel
              active={orderBy === headCell.key}
              direction={orderBy === headCell.key ? order : "asc"}
              onClick={createSortHandler(headCell.key)}>
              {headCell.label}
              {orderBy === headCell.key ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export interface EnhancedTableToolbarProps {
  numSelected: number;
  onAction?: (action: string) => void;
}

function EnhancedTableToolbar(
  props: EnhancedTableToolbarProps & {
    title?: string;
    customToolbar?: (props: EnhancedTableToolbarProps) => JSX.Element;
  }
) {
  if (props.customToolbar) {
    return props.customToolbar({ ...props });
  }

  const { numSelected } = props;
  const [t] = useTranslation();
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}>
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          className="capitalize"
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div">
          {props.title ? t(props.title) : ""}
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

export function EnhancedTable(props: TableDjangoProps) {
  const [order, setOrder] = React.useState<Order>("desc");
  const [orderBy, setOrderBy] = React.useState<any>("id");
  const [selected, setSelected] = props.selectedState;
  //const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(props.dense);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [t] = useTranslation();
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: any
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    props.onRequestSort && props.onRequestSort(isAsc ? "-" : "", property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = props.rows.map((n) => String(n.id));
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    props.onSetPage && props.onSetPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    props.onSetPageSize &&
      props.onSetPageSize(parseInt(event.target.value, 10));
    props.onSetPage && props.onSetPage(1);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty props.rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - props.rows.length) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2, minHeight: 300, boxShadow: "none" }}>
        {
          <EnhancedTableToolbar
            numSelected={selected.length}
            onAction={props.onAction}
            title={props.title}
            customToolbar={props.enhancedTableToolbar}
          />
        }
        <TableContainer
          sx={props.maxHeight ? { maxHeight: props.maxHeight } : {}}>
          <Table
            sx={{ minWidth: 750, borderCollapse: "inherit" }}
            size={dense ? "small" : "medium"}>
            <EnhancedTableHead
              headCells={props.headCells}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={props.rows.length}
            />
            <TableBody>
              {props.rows.map((row, index) => {
                const isItemSelected = isSelected(String(row.id));
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <TableRow
                    className="group"
                    hover
                    onClick={(event) => handleClick(event, String(row.id))}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        className={
                          isItemSelected ? "" : "invisible group-hover:visible"
                        }
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                      />
                    </TableCell>
                    {props.headCells.map((headRow, index) => {
                      if (index === 0) {
                        return (
                          <TableCell
                            key={row[headRow.key]}
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none">
                            {/* @ts-ignore */}
                            {row[headRow.key]}
                          </TableCell>
                        );
                      } else {
                        {
                          /* @ts-ignore */
                        }
                        return (
                          <TableCell key={headRow.key} align="right">
                            {row[headRow.key]}
                          </TableCell>
                        );
                      }
                    })}
                  </TableRow>
                );
              })}

              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}

              {props.rows.length == 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * 10,
                  }}>
                  <TableCell
                    align="center"
                    colSpan={props.headCells.length + 1}>
                    <SuspenseLoading className="opacity-80" color="primary" />
                    <div className="opacity-80 ">{t("empty")}</div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {props.pagination ? (
          <TablePagination
            labelRowsPerPage={t("rows-per-page")}
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={props.pagination.total_record}
            rowsPerPage={rowsPerPage}
            page={props.pagination.current_page - 1}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        ) : (
          <></>
        )}
      </Paper>
      {/* <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense} />}
                label="Dense padding"
            /> */}
    </Box>
  );
}

interface TableDjangoRow {
  id: number;
  [x: string]: any;
}

interface TableDjangoProps {
  title: string;
  headCells: HeadCell[];
  rows: TableDjangoRow[];
  pagination?: {
    current_page: number;
    next?: string;
    previous?: string;
    total_pages: number;
    total_record: number;
  };
  selectedState: [
    readonly string[],
    React.Dispatch<React.SetStateAction<readonly string[]>>
  ];
  dense?: boolean;
  onRequestSort?: (order: string, property: any) => void;
  onSetPage?: (targetPage: number) => void;
  onSetPageSize?: (size: number) => void;
  enhancedTableToolbar?: (props: EnhancedTableToolbarProps) => JSX.Element;
  onAction: (action: string) => void;
  maxHeight?: number | string;
}

export function TableDjango(props: TableDjangoProps) {
  return (
    <>
      <EnhancedTable {...props}></EnhancedTable>
    </>
  );
}
