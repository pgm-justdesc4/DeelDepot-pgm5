"use client";
import React from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { gql, GraphQLClient, request } from "graphql-request";
import { Product } from "@/types/Product";
import Slider from "react-slick";
import { useSession } from "next-auth/react";
import { Chatroom } from "@/types/chatroom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

const CHECK_CHATROOM = gql`
  query CheckChatroom($filters: ChatroomFiltersInput) {
    chatrooms(filters: $filters) {
      documentId
    }
  }
`;

const ProductDetail: React.FC = () => {
  const params = useParams();
  const { id: documentId } = params;
  const [product, setProduct] = React.useState<Product | null>(null);
  const { data: session } = useSession();

  React.useEffect(() => {
    const fetchProduct = async () => {
      if (!documentId) return;

      const endpoint = process.env.NEXT_PUBLIC_API_URL as string;
      const graphQLClient = new GraphQLClient(`${endpoint}/graphql`);

      const query = gql`
        query Product($documentId: ID!) {
          product(documentId: $documentId) {
            documentId
            title
            shortDescription
            description
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
        const data = await graphQLClient.request(query, { documentId });
        setProduct((data as { product: Product }).product);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [documentId]);

  const handleAskToRent = async () => {
    if (!session?.user?.strapiToken || !product) return;

    const headers = {
      Authorization: `Bearer ${session.user.strapiToken}`,
    };

    try {
      const userIds = [session.user.documentId, product.user.documentId];
      const existingChatrooms = await request<{
        chatrooms: Chatroom[];
      }>(
        `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
        CHECK_CHATROOM,
        {
          filters: {
            users_permissions_users: {
              documentId: {
                in: userIds,
              },
            },
          },
        },
        headers
      );

      if (existingChatrooms.chatrooms.length > 0) {
        window.location.href = `/chat/${existingChatrooms.chatrooms[0].documentId}`;
      } else {
        const response = await request<{
          createChatroom: Chatroom;
        }>(
          `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
          ADD_CHATROOM,
          {
            data: {
              users_permissions_users: userIds,
              title: `${product.title}`,
            },
          },
          headers
        );
        window.location.href = `/chat/${response.createChatroom.documentId}`;
      }
    } catch (error) {
      console.error("Error handling chatroom:", error);
    }
  };

  if (!product) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <></>,
    nextArrow: <></>,
  };

  return (
    <div className="product-detail p-6 max-w-7xl mx-auto">
      <a href="/products" className="text-blue-500 hover:underline">
        ← Products
      </a>
      <h1 className="text-4xl font-bold mb-6 text-center">{product.title}</h1>
      <p className="text-lg text-gray-700 mb-4 text-center">
        {product.shortDescription}
      </p>
      <div className="mb-6">
        <Slider {...settings}>
          {product.images.map((image, index) => (
            <div key={index} className="px-2">
              <Image
                className="w-full h-64 object-contain rounded-lg"
                src={`${process.env.NEXT_PUBLIC_API_URL}${image.url}`}
                alt={product.title}
                width={500}
                height={500}
              />
            </div>
          ))}
        </Slider>
      </div>
      <p className="text-gray-700 mb-6">{product.description}</p>
      <p className="text-gray-600 mb-2">
        Posted by:{" "}
        <span className="font-semibold">{product.user.username}</span>
      </p>
      <p
        className={`mb-4 ${
          product.available ? "text-green-500" : "text-red-500"
        }`}
      >
        {product.available ? "Available" : "Not available"}
      </p>
      {product.available && (
        <button
          className="mt-4 bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          onClick={handleAskToRent}
        >
          Contact
        </button>
      )}
    </div>
  );
};

export default ProductDetail;
