"use client";
import React from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { gql, GraphQLClient } from "graphql-request";
import { Product } from "@/types/Product";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProductDetail: React.FC = () => {
  const params = useParams();
  const { id: documentId } = params;
  const [product, setProduct] = React.useState<Product | null>(null);

  React.useEffect(() => {
    const fetchProduct = async () => {
      if (!documentId) return;

      const endpoint = process.env.NEXT_PUBLIC_API_URL as string;
      const graphQLClient = new GraphQLClient(`${endpoint}/graphql`);

      const query = gql`
        query Product($documentId: ID!) {
          product(documentId: $documentId) {
            documentId
            slug
            title
            shortDescription
            description
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
        const data = await graphQLClient.request(query, { documentId });
        setProduct((data as { product: Product }).product);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [documentId]);

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
        <button className="mt-4 bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300">
          Ask to rent
        </button>
      )}
    </div>
  );
};

export default ProductDetail;
