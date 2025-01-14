"use client"

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

type FormValues = {
  name: string;
  email: string;
  password: string;
  passwordValidation: string;
};

export default function SignUp() {
  const router = useRouter()

  let [formValues, setFormValues] = useState<FormValues>({
    name: "",
    email: "",
    password: "",
    passwordValidation: ""
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (validate()) {
      const {name, email, password} = formValues

      setSuccessMessage("Form submitted successfully!");
    
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log(data)
      } else {
        const err = await response.json()
        console.log(err)
      }
    }
  }

  const [errors, setErrors] = useState<Partial<FormValues>>({});
  const [successMessage, setSuccessMessage] = useState<string>("");

  const validate = (): boolean => {
    const newErrors: Partial<FormValues> = {};

    if (!formValues.name.trim()) {
      newErrors.name = "username is required";
    }

    if (!formValues.email.trim()) {
      newErrors.email = "email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formValues.email)) {
      newErrors.email = "email is invalid";
    }

    if (!formValues.password.trim()) {
      newErrors.password = "password is required";
    } else if (formValues.password.length < 8) {
      newErrors.password = "password must be at least 8 characters";
    }

    if ((!formValues.passwordValidation.trim())) {
      newErrors.passwordValidation = "password is required"
    } else if (formValues.password.length < 8) {
      newErrors.passwordValidation = "password must be at least 8 characters";
    } else if (formValues.passwordValidation != formValues.password) {
      newErrors.passwordValidation = "password is not match"
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const [showPassword, setShowPassword] = useState(false)
  const togglePassword = () => {
    setShowPassword(prevState => !prevState)
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} noValidate className="w-96 p-3 m-auto flex flex-col gap-4">
        <div className='flex flex-col'>
          <label htmlFor="name">Username</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formValues.name}
            onChange={handleChange}
            placeholder="enter your username"
            className='text-gray-700 px-2 py-1 rounded'
          />
          {errors.name && <small className='text-red-600'>{errors.name}</small>}
        </div>

        <div className='flex flex-col'>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            placeholder="enter your email"
            className='text-gray-700 px-2 py-1 rounded'
          />
          {errors.email && <small className='text-red-600'>{errors.email}</small>}
          </div>

        <div className='flex flex-col'>
          <label htmlFor="password">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formValues.password}
            onChange={handleChange}
            placeholder="enter your password"
            className='text-gray-700 px-2 py-1 rounded'

          />
          {errors.password && <small className='text-red-600'>{errors.password}</small>}
          </div>

        <div className='flex flex-col'>
          <label htmlFor="passwordValidation">Enter Password Again</label>
          <input
            type={showPassword ? "text" : "password"}
            id="passwordValidation"
            name="passwordValidation"
            value={formValues.passwordValidation}
            onChange={handleChange}
            placeholder="Enter your password"
            className='text-gray-700 px-2 py-1 rounded'

          />
          {errors.passwordValidation && <small className='text-red-600'>{errors.passwordValidation}</small>}
        </div>

        <button className='bg-blue-500 rounded p-2 hover:bg-blue-800' type="submit">Submit</button>

        {successMessage && <p className='text-green-500'>{successMessage}</p>}
      </form>
    </div>
  )
}