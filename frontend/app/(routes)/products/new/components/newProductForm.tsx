"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { gql, request } from "graphql-request";

const CREATE_PRODUCT_MUTATION = gql`
  mutation Mutation($data: ProductInput!) {
    createProduct(data: $data) {
      documentId
      title
      shortDescription
      description
      available
      images {
        documentId
      }
      user {
        documentId
      }
    }
  }
`;

const NewProductForm: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    description: "",
    available: "yes",
  });
  const [images, setImages] = useState<FileList | null>(null);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(e.target.files);
    }
  };

  const uploadImages = async () => {
    if (!images) return [];

    const imageFormData = new FormData();
    Array.from(images).forEach((image) => imageFormData.append("files", image));

    try {
      const imageResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session?.user.strapiToken}`,
          },
          body: imageFormData,
        }
      );
      const imageResponseData = await imageResponse.json();
      if (!Array.isArray(imageResponseData)) {
        throw new Error("Image upload response is not an array");
      }
      return imageResponseData;
    } catch (error) {
      console.error("Error uploading images:", error);
      return [];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      alert("You must be logged in to add a product");
      return;
    }

    const uploadedImages = await uploadImages();

    const input = {
      ...formData,
      available: formData.available === "yes",
      images: uploadedImages.map((img) => img.id),
      user: session.user.documentId,
    };

    try {
      await request(
        `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
        CREATE_PRODUCT_MUTATION,
        { data: input },
        {
          Authorization: `Bearer ${session.user.strapiToken}`,
        }
      );
      router.push(`/dashboard`);
    } catch (error) {
      console.error("Error creating product:", error);
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
          htmlFor="images"
          className="block text-sm font-medium text-gray-700"
        >
          Upload Images
        </label>
        <input
          type="file"
          id="images"
          name="images"
          multiple
          onChange={handleImageChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
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
        Add product
      </button>
    </form>
  );
};

export default NewProductForm;
