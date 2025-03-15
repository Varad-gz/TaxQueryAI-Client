'use client'

import React from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const SignupPasswordComponent = ({ nextStep, prevStep }) => {
    return (
        <Formik
            initialValues={{ password: "", confirmPassword: "" }}
            validationSchema={Yup.object({
                password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
                confirmPassword: Yup.string()
                    .oneOf([Yup.ref("password"), null], "Passwords must match")
                    .required("Confirm password is required"),
            })}
            onSubmit={(values) => nextStep(values)}
        >
            {({ isSubmitting }) => (
                <Form className="flex flex-col w-full space-y-2.5">
                    <Field type="password" name="password" placeholder="Enter password" className='bg-gray-50 px-2.5 py-5 rounded-lg border-[1px] border-gray-200' />
                    <ErrorMessage name="password" component="p" className="w-full text-center text-red-500 font-bold" />

                    <Field type="password" name="confirmPassword" placeholder="Retype password" className='bg-gray-50 px-2.5 py-5 rounded-lg border-[1px] border-gray-200' />
                    <ErrorMessage name="confirmPassword" component="p" className="w-full text-center text-red-500 font-bold" />

                    <div className="mt-2.5 flex gap-4">
                        <button type="button" onClick={prevStep} className='w-fit rounded-2xl border-[2px] px-5 py-2.5 mt-2.5 font-bold hover:bg-black hover:text-white focus:bg-black focus:text-white transition ease-in-out delay-75 cursor-pointer'>
                            Back
                        </button>
                        <button type="submit" disabled={isSubmitting} className='w-fit rounded-2xl border-[2px] px-5 py-2.5 mt-2.5 font-bold hover:bg-black hover:text-white focus:bg-black focus:text-white transition ease-in-out delay-75 cursor-pointer'>
                            Next
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default SignupPasswordComponent;
