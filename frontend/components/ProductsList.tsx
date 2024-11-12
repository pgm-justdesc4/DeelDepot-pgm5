"use client";
import React from "react";
import Image from "next/image";
import { gql, GraphQLClient, request } from "graphql-request";
import { Product } from "../types/Product";
import { useSession } from "next-auth/react";
import { Chatroom } from "@/types/chatroom";

interface ProductsListProps {
  limit?: number;
  filter: string;
  searchQuery: string;
}

const ADD_CHATROOM = gql`
  mutation CreateChatroom($data: ChatroomInput!) {
    createChatroom(data: $data) {
      documentId
      title
      users_permissions_users {
        username
        documentId
      }
    }
  }
`;

const ProductsList: React.FC<ProductsListProps> = ({
  limit,
  filter,
  searchQuery,
}) => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const { data: session } = useSession();

  React.useEffect(() => {
    const fetchProducts = async () => {
      const endpoint = process.env.NEXT_PUBLIC_API_URL as string;
      const graphQLClient = new GraphQLClient(`${endpoint}/graphql`);

      const query = gql`
        query Products {
          products {
            documentId
            title
            shortDescription
            images {
              url
            }
            user {
              username
              documentId
            }
            available
          }
        }
      `;

      try {
        const data = await graphQLClient.request(query);
        setProducts((data as { products: Product[] }).products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleAskToRent = async (product: Product) => {
    if (!session?.user?.strapiToken) return;

    const headers = {
      Authorization: `Bearer ${session.user.strapiToken}`,
    };

    try {
      const response = await request<{
        createChatroom: Chatroom;
      }>(
        `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
        ADD_CHATROOM,
        {
          data: {
            users_permissions_users: [
              session.user.documentId,
              product.user.documentId,
            ],
            title: `${product.title}`,
          },
        },
        headers
      );
      window.location.href = `/chat/${response.createChatroom.documentId}`;
    } catch (error) {
      console.error("Error creating chatroom:", error);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      (filter === "all" || product.available) &&
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredProducts.length === 0) {
    return <div className="text-center text-gray-500">No products found</div>;
  }

  const displayedProducts = limit
    ? filteredProducts.slice(0, limit)
    : filteredProducts;

  return (
    <div className="products-overview max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {displayedProducts.map((product) => (
        <a
          href={`/products/${product.documentId}`}
          key={product.documentId}
          className="product-preview bg-white shadow-md rounded-lg p-4"
        >
          <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
          <hr />
          <p className="text-gray-700 mb-4 mt-2">{product.shortDescription}</p>
          <Image
            className="w-full h-48 object-cover mb-4 rounded"
            src={`${process.env.NEXT_PUBLIC_API_URL}${product.images[0].url}`}
            alt={product.title}
            width={500}
            height={500}
          />
          <p className="text-gray-600">Posted by: {product.user.username}</p>
          <p
            className={`mt-2 ${
              product.available ? "text-green-500" : "text-red-500"
            }`}
          >
            {product.available ? "Available" : "Not available"}
          </p>
          {product.available && (
            <button
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
              onClick={(e) => {
                e.preventDefault();
                handleAskToRent(product);
              }}
            >
              Ask to Rent
            </button>
          )}
        </a>
      ))}
    </div>
  );
};

export default ProductsList;
