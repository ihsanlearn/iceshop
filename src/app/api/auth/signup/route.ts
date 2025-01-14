import connectDB from '@/libs/db';
import User from '../../../../models/User';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email, password, name } = await req.json();

  await connectDB();

  const isEmailExist = await User.findOne({ email });
  const isNameExist = await User.findOne({ name });
  if (isEmailExist) {
    return NextResponse.json({ message: 'email already exist' }, { status: 400 });
  } else if (isNameExist) {
    return NextResponse.json({ message: 'username already exist' }, { status: 400 });
  }

  const user = new User({name, email, password})
  await user.save()
  return NextResponse.json({message: `success`}, {status: 200})
}
