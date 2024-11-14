import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "../app/page";

jest.mock("@/components/ProductsList", () => {
  const MockedProductsList = () => <div role="list">Mocked ProductsList</div>;
  MockedProductsList.displayName = "MockedProductsList";
  return MockedProductsList;
});

describe("Home Component", () => {
  test("renders welcome message", () => {
    render(<Home />);
    const welcomeMessage = screen.getByText(/Welcome to DeelDepot!/i);
    expect(welcomeMessage).toBeInTheDocument();
  });

  test("renders description", () => {
    render(<Home />);
    const description = screen.getByText(
      /We are a peer-to-peer platform for the people, by the people./i
    );
    expect(description).toBeInTheDocument();
  });

  test("renders ProductsList component", () => {
    render(<Home />);
    const productsList = screen.getByRole("list");
    expect(productsList).toBeInTheDocument();
  });

  test("renders view all products link", () => {
    render(<Home />);
    const viewAllLink = screen.getByRole("link", { name: /View all/i });
    expect(viewAllLink).toBeInTheDocument();
    expect(viewAllLink).toHaveAttribute("href", "/products");
  });
});
