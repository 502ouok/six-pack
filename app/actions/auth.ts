'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  SignupSchema,
  LoginSchema,
  type SignupFormState,
  type LoginFormState,
} from '@/app/lib/definitions'

export async function signupAction(
  state: SignupFormState,
  formData: FormData
): Promise<SignupFormState> {
  const raw = {
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
    nickname: formData.get('nickname'),
    role: formData.get('role'),
  }

  const validated = SignupSchema.safeParse(raw)
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const { email, password, nickname, role } = validated.data
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nickname, role },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    return { errors: { form: [error.message] } }
  }

  redirect(role === '보호자' ? '/guardian' : '/dashboard')
}

export async function loginAction(
  state: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const raw = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const validated = LoginSchema.safeParse(raw)
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const { email, password } = validated.data
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { errors: { form: ['이메일 또는 비밀번호가 올바르지 않아요.'] } }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()

  redirect(profile?.role === '보호자' ? '/guardian' : '/dashboard')
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
