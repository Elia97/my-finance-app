"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      router.push("/"); // Redirect alla home protetta
    } else {
      alert("Credenziali errate");
    }
  };

  return (
    <main className="flex items-center justify-center h-screen bg-background">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-8 bg-white rounded shadow"
      >
        <h1 className="text-xl font-bold mb-4">Accedi a FinTrack</h1>
        <input
          type="email"
          placeholder="Email"
          className="mb-4 w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="mb-4 w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded"
        >
          Accedi
        </button>
      </form>
    </main>
  );
}
