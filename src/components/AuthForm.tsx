"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useAuthStore } from "@/app/store/authStore";
import { authService } from "@/app/services/authService";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const loginSchema = z.object({
    username: z.string().min(3, "Username is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AuthForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {

    const router = useRouter();
    const { setToken, setUser } = useAuthStore();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        clearErrors,
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setLoading(true);
        setError(null);

        try {
            const result = await authService.login(data);
            setToken(result.accessToken);
            setUser({ username: data.username });
            router.push("/");
        } catch (error) {
            setError(error instanceof Error ? error.message : "An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const clearErrorMessage = (field?: keyof LoginFormData) => {
        setError(null);
        if (field) {
            clearErrors(field);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {error && <p className="text-red-500">{error}</p>}
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="username"
                                    {...register("username")}
                                    onChange={() => clearErrorMessage("username")}
                                    required
                                />
                                {errors.username && <p className="text-red-500">{errors.username.message as string}</p>}
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Password"
                                    {...register("password")}
                                    onChange={() => clearErrorMessage("password")}
                                    required
                                />
                                {errors.password && <p className="text-red-500">{errors.password.message as string}</p>}
                            </div>
                            <Button type="submit" className="w-full">
                                Login
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <a href="/register" className="underline underline-offset-4">
                                Sign up
                            </a>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
