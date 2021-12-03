import React from "react";
import Head from "next/head";
import Link from "next/link";
import useSWR from "swr";
import { useTable, useFilters } from "react-table";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import { Link as MUILink } from "@mui/material";

import { fetcher } from "../utils.js";

function TextFilter({ column: { filterValue, setFilter } }) {
  return (
    <TextField
      variant="standard"
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
      placeholder="filtre"
    />
  );
}

function UsersTable({ columns, data }) {
  const defaultColumn = React.useMemo(
    () => ({
      Filter: TextFilter,
    }),
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
        defaultColumn,
      },
      useFilters
    );

  return (
    <TableContainer component={Card}>
      <Table {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup, i) => (
            <TableRow key={i} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, j) => (
                <TableCell key={j} {...column.getHeaderProps()}>
                  <span className="font-bold">{column.render("Header")}</span>
                  <div>{column.canFilter ? column.render("Filter") : null}</div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <TableRow key={i} {...row.getRowProps()}>
                {row.cells.map((cell, j) => (
                  <TableCell key={j} {...cell.getCellProps()}>
                    {cell.render("Cell")}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default function Home() {
  const { data, error } = useSWR("/users", fetcher);

  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ row, value }) => (
          <Link href={`/users/${row.original.id}`} passHref>
            <MUILink>{value}</MUILink>
          </Link>
        ),
      },
      {
        Header: "Email",
        accessor: "email",
      },
    ],
    []
  );

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  return (
    <>
      <Head>
        <title>Test Iconosquare</title>
        <meta name="description" content="Test technique iconosquare" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-screen h-screen bg-pink-50 p-4 md:p-10">
        <h1 className="text-3xl font-bold mb-4 text-pink-600">
          Test technique Iconosquare
        </h1>
        <UsersTable columns={columns} data={data} />
      </main>
    </>
  );
}
