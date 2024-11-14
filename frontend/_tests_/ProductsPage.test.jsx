import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProductsPage from "@/app/(routes)/products/page";

jest.mock("@/components/ProductsList", () => {
  const MockedProductsList = () => <div role="list">Mocked ProductsList</div>;
  MockedProductsList.displayName = "MockedProductsList";
  return MockedProductsList;
});

jest.mock("@/components/FilterProducts", () => {
  const MockedFilterProducts = () => (
    <div role="filter">Mocked FilterProducts</div>
  );
  MockedFilterProducts.displayName = "MockedFilterProducts";
  return MockedFilterProducts;
});

jest.mock("@/components/SearchProducts", () => {
  const MockedSearchProducts = () => (
    <div role="search">Mocked SearchProducts</div>
  );
  MockedSearchProducts.displayName = "MockedSearchProducts";
  return MockedSearchProducts;
});

describe("ProductsPage Component", () => {
  test("renders page title", () => {
    render(<ProductsPage />);
    const pageTitle = screen.getByRole("heading", {
      level: 1,
      name: /Products/i,
    });
    expect(pageTitle).toBeInTheDocument();
  });

  test("renders SearchProducts component", () => {
    render(<ProductsPage />);
    const searchComponent = screen.getByRole("search");
    expect(searchComponent).toBeInTheDocument();
  });

  test("renders FilterProducts component", () => {
    render(<ProductsPage />);
    const filterComponent = screen.getByRole("filter");
    expect(filterComponent).toBeInTheDocument();
  });

  test("renders ProductsList component", () => {
    render(<ProductsPage />);
    const productsList = screen.getByRole("list");
    expect(productsList).toBeInTheDocument();
  });
});
