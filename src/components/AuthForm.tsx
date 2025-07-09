"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createAccount, signInUser } from "@/lib/actions/user.actions";
import OTPModal from "@/components/OTPModal";

type FormType = "Sign In" | "Sign Up";

const AuthForm = ({ type }: { type: FormType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [accountId, setAccountId] = useState<string>("");

  // 动态创建表单验证 schema
  const formSchema = z.object({
    fullName:
      type === "Sign Up"
        ? z.string().min(2, { message: "至少输入两个字符" })
        : z.string().optional(),
    email: z.string().email({
      message: "请输入有效的电子邮件地址",
    }),
  });
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const user =
        type === "Sign Up"
          ? await createAccount({
              fullName: values.fullName || "",
              email: values.email,
            })
          : await signInUser({ email: values.email });
      if (user?.error) {
        setErrorMessage(
          type === "Sign In"
            ? "User does not exist, please register an account first"
            : "Registration failed, please try again",
        );
        return;
      }
      if (user.accountId) {
        setAccountId(user.accountId);
      } else {
        setErrorMessage(
          type === "Sign In"
            ? "Login failed, please check the email address."
            : "Registration failed, please try again.",
        );
        return;
      }
    } catch (error) {
      setErrorMessage("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
          <h1 className="form-title">
            {type === "Sign In" ? "Sign In" : "Sign Up"}
          </h1>
          {type === "Sign Up" && (
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <div className="shad-form-item">
                    <FormLabel className="shad-form-label">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Eenter your full name"
                        className=""
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="shad-form-message" />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Eenter your email"
                      className=""
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="form-submit-button rounded-full"
            disabled={isLoading}
          >
            {type === "Sign In" ? "登陆" : "注册"}
            {isLoading && (
              <Image
                src="../assets/icons/loader.svg"
                alt="loading"
                width={24}
                height={24}
                className=""
              />
            )}
          </Button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <div className="body-2 flex justify-center">
            <p className="text-light-100">
              {type === "Sign In"
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>
            <Link
              href={type === "Sign In" ? "/sign-up" : "/sign-in"}
              className="ml-1 font-medium text-brand"
            >
              {type === "Sign In" ? "Sign Up" : "Sign In"}
            </Link>
          </div>
        </form>
      </Form>
      {accountId && (
        <OTPModal email={form.getValues("email")} accountId={accountId} />
      )}
    </>
  );
};
export default AuthForm;
