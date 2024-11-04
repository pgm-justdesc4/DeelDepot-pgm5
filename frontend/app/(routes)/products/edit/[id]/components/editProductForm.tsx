"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { gql, request } from "graphql-request";

const GET_PRODUCT_QUERY = gql`
  query Query($documentId: ID!) {
    product(documentId: $documentId) {
      documentId
      title
      shortDescription
      description
      available
      images {
        documentId
      }
    }
  }
`;

const UPDATE_PRODUCT_MUTATION = gql`
  mutation UpdateProduct($documentId: ID!, $data: ProductInput!) {
    updateProduct(documentId: $documentId, data: $data) {
      documentId
      title
      shortDescription
      description
      available
      images {
        documentId
      }
    }
  }
`;

const EditProductForm: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    description: "",
    available: "yes",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await request(
          `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
          GET_PRODUCT_QUERY,
          { documentId: id }
        );
        const product = data.product;
        setFormData({
          title: product.title,
          shortDescription: product.shortDescription,
          description: product.description,
          available: product.available ? "yes" : "no",
        });
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      alert("You must be logged in to edit a product");
      return;
    }

    const input = {
      ...formData,
      available: formData.available === "yes",
      user: session.user.documentId,
    };

    try {
      await request(
        `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
        UPDATE_PRODUCT_MUTATION,
        { documentId: id, data: input },
        {
          Authorization: `Bearer ${session.user.strapiToken}`,
        }
      );
      router.push(`/dashboard`);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md"
    >
      <div className="mb-4">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="shortDescription"
          className="block text-sm font-medium text-gray-700"
        >
          Short Description
        </label>
        <input
          type="text"
          id="shortDescription"
          name="shortDescription"
          value={formData.shortDescription}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="available"
          className="block text-sm font-medium text-gray-700"
        >
          Available
        </label>
        <select
          id="available"
          name="available"
          value={formData.available}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Update product
      </button>
    </form>
  );
};

export default EditProductForm;
