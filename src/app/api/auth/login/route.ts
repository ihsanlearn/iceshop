import connectDB from '@/libs/db';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie'

export async function POST(req: Request) {
  const { email, password } = await req.json();

  await connectDB();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ message: "email isn't exist" }, { status: 400 });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return NextResponse.json({ message: "password isn't match" }, { status: 400 });
  }

  const token = jwt.sign({id: user._id}, process.env.JWT_SECRET!, {expiresIn: '1h'})

  const cookie = serialize('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 3600,
    path: '/'
  })

  try {
    const response = NextResponse.json({token});
    response.headers.append('Set-Cookie', cookie)

    return response
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    return NextResponse.json({message: errorMessage}, {status: 500})
  }
}
