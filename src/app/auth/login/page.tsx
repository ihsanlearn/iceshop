'use client';

import { useRouter } from 'next/navigation';
import React, { FormEvent, useState } from 'react';

type formValues = {
  email: string;
  password: string;
};

export default function Login() {
  const [formValues, setFormValues] = useState<formValues>({
    email: '',
    password: '',
  });

  const router = useRouter()

  const [errors, setErrors] = useState<Partial<formValues>>({});

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validate()) {
      const { email, password } = formValues;

      const response = await fetch('/api/auth/login', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (response.ok) {
        router.push('/')
      } else {
        const err = await response.json()
        const updatedErrors: Partial<formValues> = {...errors}
        console.log(err.message)
        if (err.message == 'email isn\'t exist') {
          updatedErrors.email = err.message
          updatedErrors.password = ''
        } else if (err.message == 'password isn\'t match') {
          updatedErrors.email = ''  
          updatedErrors.password = err.message
        }
        setErrors(updatedErrors)
      }
    }
  }

  const validate = (): boolean => {
    const newErrors: Partial<formValues> = {};

    if (!formValues.email.trim()) {
      newErrors.email = 'username is required.';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formValues.email)) {
      newErrors.email = 'invalid format for email';
    }

    if (!formValues.password.trim()) {
      newErrors.password = 'password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} noValidate className="w-96 p-3 m-auto flex flex-col gap-4">
        <div className="flex flex-col">
          <label htmlFor="email">Email</label>
          <input type="text" name="email" id="name" value={formValues.email} onChange={handleChange} placeholder="enter your email" className="text-gray-700 px-2 py-1 rounded" />
          {errors.email && <small className="text-red-600">{errors.email}</small>}
        </div>
        <div className="flex flex-col">
          <label htmlFor="password">Password</label>
          <input type="text" name="password" id="password" value={formValues.password} onChange={handleChange} placeholder="enter your password" className="text-gray-700 px-2 py-1 rounded" />
          {errors.password && <small className="text-red-600">{errors.password}</small>}
        </div>

        <button className="bg-blue-500 rounded p-2 hover:bg-blue-800" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}
