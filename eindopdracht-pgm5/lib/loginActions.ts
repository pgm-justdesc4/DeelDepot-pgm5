"use client";
import { signIn } from "next-auth/react";

export async function authenticate(_currentState: unknown, formData: FormData) {
  try {
    const formDataObj: { [key: string]: string } = {};
    formData.forEach((value, key) => {
      formDataObj[key] = value.toString();
    });
    await signIn("credentials", { ...formDataObj, callbackUrl: "/" });
  } catch (error) {
    if (error) {
      return "Something went wrong.";
    }
  }
}

export async function authenticateThirdParty(method: "github" | "google") {
  console.log("Authenticating with", method);
  try {
    await signIn(method, { callbackUrl: "/" });
  } catch (error) {
    if (error) {
      console.error("Error:", error);
      return "Something went wrong.";
    }
  }
}
