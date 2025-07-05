import React from "react";
import AuthForm from "@/components/AuthForm";
// auth被括号包裹，是个路由组，访问地址不带auth，访问地址：http://localhost:3000/sign-in
const SignInPage = () => <AuthForm type="Sign In" />;

export default SignInPage;
