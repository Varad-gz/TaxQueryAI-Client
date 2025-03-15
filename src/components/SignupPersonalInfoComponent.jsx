'use client'

import React from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const SignupPersonalInfoComponent = ({ handleSubmit, prevStep }) => {
    return (
        <Formik
            initialValues={{ fullName: "" }}
            validationSchema={Yup.object({
                fullName: Yup.string().required("Full name is required"),
            })}
            onSubmit={(values) => handleSubmit(values)}
        >
            {({ isSubmitting }) => (
                <Form className="flex flex-col w-full space-y-2.5">
                    <Field type="text" name="fullName" placeholder="Enter your full name" className='bg-gray-50 px-2.5 py-5 rounded-lg border-[1px] border-gray-200' />
                    <ErrorMessage name="fullName" component="p" className="w-full text-center text-red-500 font-bold" />

                    <div className="mt-2.5 flex gap-4">
                        <button type="button" onClick={prevStep} className='w-fit rounded-2xl border-[2px] px-5 py-2.5 mt-2.5 font-bold hover:bg-black hover:text-white active:bg-black active:text-white outline-0 focus:bg-black focus:text-white transition ease-in-out delay-75 cursor-pointer'>
                            Back
                        </button>
                        <button type="submit" disabled={isSubmitting} className='w-fit rounded-2xl border-[2px] px-5 py-2.5 mt-2.5 font-bold hover:bg-black hover:text-white active:bg-black active:text-white outline-0 focus:bg-black focus:text-white transition ease-in-out delay-75 cursor-pointer'>
                            Submit
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default SignupPersonalInfoComponent;
