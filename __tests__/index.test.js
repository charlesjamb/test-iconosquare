/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";

import Home from "../pages/index";

const server = setupServer(
  rest.get("https://jsonplaceholder.typicode.com/users", (req, res, ctx) => {
    return res(ctx.json([{ name: "John Doe" }]));
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

  await waitFor(() => screen.getByText(/failed to load/i));

  expect(screen.getByText(/failed to load/i)).toBeTruthy();
});

test("loads and displays first user name", async () => {
  render(<Home />);

  await waitFor(() => screen.getByRole("heading"));

  expect(screen.getByRole("heading")).toHaveTextContent("Hello World");
  expect(screen.getByText(/John Doe/i)).toBeTruthy();
});
