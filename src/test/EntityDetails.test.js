import fs from "fs";
import path from "path";
import { render, screen } from "@testing-library/react";
import EntityDetails from "../components/EntityDetails";

describe("EntityDetails", () => {
  it("renders correctly with data", async () => {
    const fetchMethod = () =>
      Promise.resolve({ id: 101, name: "John", email: "john@gmail.com" });

    render(
      <EntityDetails
        fetchMethod={fetchMethod}
        propsToDisplay={{ name: "Name" }}
      />
    );

    const heading = await screen.findByRole("heading", { name: "John Details:" });
    expect(heading).toBeInTheDocument();
    expect(heading.parentElement).toHaveTextContent("Name: John");
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("renders loading without data", () => {
    const fetchMethod = () => new Promise(() => {});

    render(
      <EntityDetails
        fetchMethod={fetchMethod}
        propsToDisplay={{ name: "Name" }}
      />
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /Details:/ })
    ).not.toBeInTheDocument();
  });

  it("reloads when params change", async () => {
    let resolveNext;
    const fetchMethod = jest.fn((params) => {
      if (params === 102) {
        return new Promise((resolve) => {
          resolveNext = resolve;
        });
      }
      return Promise.resolve({ id: 101, name: "John", email: "john@gmail.com" });
    });

    const { rerender } = render(
      <EntityDetails
        fetchMethod={fetchMethod}
        params={101}
        propsToDisplay={{ name: "Name" }}
      />
    );

    expect(
      await screen.findByRole("heading", { name: "John Details:" })
    ).toBeInTheDocument();

    rerender(
      <EntityDetails
        fetchMethod={fetchMethod}
        params={102}
        propsToDisplay={{ name: "Name" }}
      />
    );

    expect(await screen.findByText("Loading...")).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "John Details:" })
    ).not.toBeInTheDocument();

    resolveNext({ id: 102, name: "Jane", email: "jane@gmail.com" });

    expect(
      await screen.findByRole("heading", { name: "Jane Details:" })
    ).toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("uses withLoading", () => {
    const source = fs.readFileSync(
      path.join(__dirname, "../components/EntityDetails.js"),
      "utf8"
    );

    expect(source).toEqual(expect.stringMatching(/from\s+['"]\.\/withLoading['"]/));
    expect(source).toEqual(expect.stringMatching(/withLoading\s*\(/));
  });
});
