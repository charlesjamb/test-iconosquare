/**
 * @jest-environment jsdom
 */

import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import {
  render,
  screen,
  waitFor,
  within,
  fireEvent,
} from "@testing-library/react";

import Home from "../pages/index";

const server = setupServer(
  rest.get("https://jsonplaceholder.typicode.com/users", (req, res, ctx) => {
    return res(
      ctx.json([
        {
          id: 1,
          name: "Nausicaa",
          email: "naunau@mail.com",
        },
        {
          id: 2,
          name: "Totoro",
          email: "toto@mail.com",
        },
      ])
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Has to be before the good case test because of cache probably ??
test("handles server error", async () => {
  server.use(
    rest.get("https://jsonplaceholder.typicode.com/users", (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );

  render(<Home />);

  await waitFor(() => screen.getByText(/Une erreur s'est produite .../i));

  expect(
    screen.getByText(/Une erreur s'est produite .../i)
  ).toBeInTheDocument();
});

test("loads and displays a table with the users", async () => {
  render(<Home />);

  await waitFor(() => screen.getByRole("heading"));

  expect(screen.getByRole("heading")).toHaveTextContent(
    "Test technique Iconosquare"
  );
  expect(screen.getByRole("cell", { name: /Nausicaa/i })).toBeInTheDocument();
  expect(
    screen.getByRole("cell", { name: /naunau@mail.com/i })
  ).toBeInTheDocument();

  expect(screen.getByRole("cell", { name: /Totoro/i })).toBeInTheDocument();
  expect(
    screen.getByRole("cell", { name: /toto@mail.com/i })
  ).toBeInTheDocument();
});

test("filters on email", async () => {
  render(<Home />);
  await waitFor(() => screen.getByRole("heading"));

  const columnheader = screen.getByRole("columnheader", {
    name: /email/i,
  });

  const input = within(columnheader).getByRole("textbox");
  fireEvent.change(input, { target: { value: "nau" } });

  expect(screen.getByRole("cell", { name: /Nausicaa/i })).toBeInTheDocument();
  expect(
    screen.getByRole("cell", { name: /naunau@mail.com/i })
  ).toBeInTheDocument();

  const totoro = screen.queryByText(/Totoro/i);
  expect(totoro).not.toBeInTheDocument();
});

test("filters on name", async () => {
  render(<Home />);
  await waitFor(() => screen.getByRole("heading"));

  const columnheader = screen.getByRole("columnheader", {
    name: /Name/i,
  });

  const input = within(columnheader).getByRole("textbox");
  fireEvent.change(input, { target: { value: "nau" } });

  expect(screen.getByRole("cell", { name: /Nausicaa/i })).toBeInTheDocument();
  expect(
    screen.getByRole("cell", { name: /naunau@mail.com/i })
  ).toBeInTheDocument();

  const totoro = screen.queryByText(/Totoro/i);
  expect(totoro).not.toBeInTheDocument();
});
