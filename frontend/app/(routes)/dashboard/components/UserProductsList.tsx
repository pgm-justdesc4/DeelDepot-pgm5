"use client";
import React from "react";
import Image from "next/image";
import { gql, GraphQLClient } from "graphql-request";
import { Product } from "@/types/Product";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const UserProductsList: React.FC = () => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const { data: session } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    const fetchProducts = async () => {
      if (!session?.user) return;

      const endpoint = process.env.NEXT_PUBLIC_API_URL as string;
      const graphQLClient = new GraphQLClient(`${endpoint}/graphql`);

      const query = gql`
        query UserProducts($userId: ID!) {
          products(filters: { user: { documentId: { eq: $userId } } }) {
            documentId
            slug
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
        const data = await graphQLClient.request(query, {
          userId: session.user.documentId,
        });
        setProducts((data as { products: Product[] }).products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [session]);

  if (products.length === 0) {
    return (
      <div className="text-center text-gray-500">
        <p>You have no products yet.</p>
        <button
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          onClick={() => router.push("/new-product")}
        >
          New Product
        </button>
      </div>
    );
  }

  return (
    <div className="products-overview grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {products.map((product) => (
        <div
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
          <p
            className={`mt-2 ${
              product.available ? "text-green-500" : "text-red-500"
            }`}
          >
            {product.available ? "Available" : "Not available"}
          </p>
          <div className="mt-4 flex space-x-2">
            <Link
              href={`/products/edit/${product.documentId}`}
              className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 focus:outline-none focus:ring focus:ring-yellow-300"
            >
              Edit
            </Link>
            <Link
              href={`/products/delete/${product.documentId}`}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
            >
              Delete
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserProductsList;
