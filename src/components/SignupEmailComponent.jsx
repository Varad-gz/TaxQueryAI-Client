'use client'

import React from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from 'react-toastify';

const SignupEmailComponent = ({ nextStep }) => {

    const checkEmail = async (values) => {
        try {
            const response = await fetch("/api/profile/email-exists", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: values.email }),
            });

            const data = await response.json();

            if (data.exists) {
                toast.error("Email already exists. Please use a different email.");
            } else {
                nextStep(values);
            }
        } catch (error) {
            toast.error("Error checking email");
        }
    };

    return (
        <Formik
            initialValues={{ email: "" }}
            validationSchema={Yup.object({
                email: Yup.string().email("Invalid email format").required("Email is required"),
            })}
            onSubmit={checkEmail}
        >
            {({ isSubmitting }) => (
                <Form className="flex flex-col w-full space-y-2.5">
                    <Field type="email" name="email" placeholder="Enter your email" className='bg-gray-50 px-2.5 py-5 rounded-lg border-[1px] border-gray-200' />
                    <ErrorMessage name="email" component="p" className="w-full text-center text-red-500 font-bold" />
                    <button type="submit" disabled={isSubmitting} className='w-fit rounded-2xl border-[2px] px-5 py-2.5 mt-2.5 font-bold hover:bg-black hover:text-white focus:bg-black focus:text-white transition ease-in-out delay-75 cursor-pointer'>
                        Next
                    </button>
                </Form>
            )}
        </Formik>
    );
};


export default SignupEmailComponent
