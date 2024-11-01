"use client";
import React from "react";
import { gql, GraphQLClient } from "graphql-request";
import { useSession } from "next-auth/react";
import { Product } from "../types/Product";

const ProductsOverview: React.FC = () => {
  const { data: session } = useSession();
  const [products, setProducts] = React.useState<Product[]>([]);

  React.useEffect(() => {
    const fetchProducts = async () => {
      const endpoint = process.env.NEXT_PUBLIC_API_URL as string;
      const graphQLClient = new GraphQLClient(`${endpoint}/graphql`);

      const query = gql`
        query Products {
          products {
            title
            shortDescription
            images {
              url
            }
            user {
              username
            }
            available
          }
        }
      `;

      try {
        const data = await graphQLClient.request(query);
        console.log(data);
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    if (session) {
      fetchProducts();
    }
  }, [session]);

  if (products.length === 0) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="products-overview grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {products.map((product) => (
        <div
          key={product.title}
          className="product-preview bg-white shadow-md rounded-lg p-4"
        >
          <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
          <p className="text-gray-700 mb-4">{product.shortDescription}</p>
          {product.images.length > 0 && (
            <img
              className="w-full h-48 object-cover mb-4 rounded"
              src={`${process.env.NEXT_PUBLIC_API_URL}/${product.images[0].url}`}
              alt={product.title}
            />
          )}
          <p className="text-gray-600">Posted by: {product.user.username}</p>
          <p
            className={`mt-2 ${
              product.available ? "text-green-500" : "text-red-500"
            }`}
          >
            {product.available ? "Available" : "Not Available"}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ProductsOverview;
