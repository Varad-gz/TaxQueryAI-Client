'use client'

import { useFormik } from "formik";
import * as Yup from "yup";

const SignupForm = () => {
    // Formik setup
    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            username: "",
            password: "",
            retypePassword: "",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Name is required"),
            email: Yup.string()
                .email("Invalid email address")
                .required("Email is required"),
            username: Yup.string()
                .min(3, "Username must be at least 3 characters")
                .required("Username is required"),
            password: Yup.string()
                .min(6, "Password must be at least 6 characters")
                .required("Password is required"),
            retypePassword: Yup.string()
                .oneOf([Yup.ref("password"), null], "Passwords must match")
                .required("Please retype your password"),
        }),
        onSubmit: (values) => {
            // Handle form submission
            console.log("Form submitted:", values);
            alert("Registration successful!");
        },
    });

    return (
        <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
            <h1>Registration Form</h1>
            <form onSubmit={formik.handleSubmit}>
                {/* Name Field */}
                <div style={{ marginBottom: "15px" }}>
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                    />
                    {formik.touched.name && formik.errors.name ? (
                        <div style={{ color: "red" }}>{formik.errors.name}</div>
                    ) : null}
                </div>

                {/* Email Field */}
                <div style={{ marginBottom: "15px" }}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                    />
                    {formik.touched.email && formik.errors.email ? (
                        <div style={{ color: "red" }}>{formik.errors.email}</div>
                    ) : null}
                </div>

                {/* Username Field */}
                <div style={{ marginBottom: "15px" }}>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.username}
                    />
                    {formik.touched.username && formik.errors.username ? (
                        <div style={{ color: "red" }}>{formik.errors.username}</div>
                    ) : null}
                </div>

                {/* Password Field */}
                <div style={{ marginBottom: "15px" }}>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                    />
                    {formik.touched.password && formik.errors.password ? (
                        <div style={{ color: "red" }}>{formik.errors.password}</div>
                    ) : null}
                </div>

                {/* Retype Password Field */}
                <div style={{ marginBottom: "15px" }}>
                    <label htmlFor="retypePassword">Retype Password</label>
                    <input
                        type="password"
                        id="retypePassword"
                        name="retypePassword"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.retypePassword}
                    />
                    {formik.touched.retypePassword && formik.errors.retypePassword ? (
                        <div style={{ color: "red" }}>{formik.errors.retypePassword}</div>
                    ) : null}
                </div>

                {/* Submit Button */}
                <button type="submit" style={{ padding: "10px 20px", cursor: "pointer" }}>
                    Register
                </button>
            </form>
        </div>
    );
};

export default SignupForm;