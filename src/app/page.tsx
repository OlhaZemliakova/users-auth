"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  const { user, fetchUser, token, logout } = useAuthStore();
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!token) {
      console.log("No token found, redirecting to login");
      router.replace("/login");
      return;
    }

    const checkAuth = async () => {
      try {
        await fetchUser();
      } catch (error) {
        console.error("Error fetching user:", error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [token, fetchUser, logout, router]);


  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>Redirecting to login...</p>;
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold">
          Welcome to Home, {user?.username}!
        </h1>
        <Button onClick={logout} className="bg-red-500 text-white px-4 py-2 mt-4 rounded">
          Logout
        </Button>
      </main>
    </div>
  );
}
