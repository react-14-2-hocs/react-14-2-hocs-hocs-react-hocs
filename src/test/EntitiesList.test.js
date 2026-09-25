import fs from "fs";
import path from "path";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EntitiesList from "../components/EntitiesList";

describe("EntitiesList", () => {
  it("renders correctly with data", async () => {
    const fetchMethod = () => Promise.resolve([{ id: 101, name: "John" }]);

    render(
      <EntitiesList
        fetchMethod={fetchMethod}
        propsToDisplay={{ name: "Name" }}
      />
    );

    const button = await screen.findByRole("button", { name: "👀" });
    expect(button).toBeInTheDocument();
    expect(button.parentElement).toHaveTextContent("Name: John");
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("renders loading without data", () => {
    const fetchMethod = () => new Promise(() => {});

    render(
      <EntitiesList
        fetchMethod={fetchMethod}
        propsToDisplay={{ name: "Name" }}
      />
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "👀" })).not.toBeInTheDocument();
  });

  it("calls onEntityDetailsClick with the entity id", async () => {
    const user = userEvent.setup();
    const fetchMethod = () => Promise.resolve([{ id: 101, name: "John" }]);
    const onEntityDetailsClick = jest.fn();

    render(
      <EntitiesList
        fetchMethod={fetchMethod}
        onEntityDetailsClick={onEntityDetailsClick}
        propsToDisplay={{ name: "Name" }}
      />
    );

    await user.click(await screen.findByRole("button", { name: "👀" }));

    expect(onEntityDetailsClick).toHaveBeenCalledWith(101);
  });

  it("uses withLoading", () => {
    const source = fs.readFileSync(
      path.join(__dirname, "../components/EntitiesList.js"),
      "utf8"
    );

    expect(source).toEqual(expect.stringMatching(/from\s+['"]\.\/withLoading['"]/));
    expect(source).toEqual(expect.stringMatching(/withLoading\s*\(/));
  });
});
