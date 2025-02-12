"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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


const registerSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        clearErrors,
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        setLoading(true);
        setError(null);

        try {
            await authService.register(data);
            router.push("/");
        } catch (error) {
            setError(error instanceof Error ? error.message : "An error occurred.");
        } finally {
            setLoading(false);
        }


    };

    const clearErrorMessage = (field?: keyof RegisterFormData) => {
        setError(null);
        if (field) {
            clearErrors(field);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Register</CardTitle>
                    <CardDescription>
                        Enter your data below to create new account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-1">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="Username"
                                    required
                                    {...register("username")}
                                    onChange={() => clearErrorMessage("username")}
                                />
                                <p className="text-red-500">{errors.username?.message}</p>
                            </div>
                            <div className="grid gap-1">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    type="text"
                                    {...register("name")}
                                    placeholder="Name"
                                    id="name"
                                    onChange={() => clearErrorMessage("name")}
                                    required
                                />
                                <p className="text-red-500">{errors.name?.message}</p>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    {...register("password")}
                                    type="password"
                                    placeholder="Password"
                                    id="password"
                                    onChange={() => clearErrorMessage("password")}
                                    required
                                />
                                <p className="text-red-500">{errors.password?.message}</p>
                                {error && <p className="text-red-500">{error}</p>}
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Registering..." : "Register"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
