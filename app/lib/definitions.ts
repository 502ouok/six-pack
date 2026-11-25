import { z } from 'zod'

export const SignupSchema = z
  .object({
    email: z.string().email({ message: '올바른 이메일을 입력해 주세요.' }).trim(),
    password: z
      .string()
      .min(8, { message: '비밀번호는 8자 이상이어야 해요.' })
      .regex(/[a-zA-Z]/, { message: '영문자를 포함해야 해요.' })
      .regex(/[0-9]/, { message: '숫자를 포함해야 해요.' }),
    confirmPassword: z.string(),
    nickname: z
      .string()
      .min(2, { message: '닉네임은 2자 이상이어야 해요.' })
      .max(20, { message: '닉네임은 20자 이하여야 해요.' })
      .trim(),
    role: z.enum(['아동', '보호자'], {
      message: '역할을 선택해 주세요.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않아요.',
    path: ['confirmPassword'],
  })

export const LoginSchema = z.object({
  email: z.string().email({ message: '올바른 이메일을 입력해 주세요.' }).trim(),
  password: z.string().min(1, { message: '비밀번호를 입력해 주세요.' }),
})

export type SignupFormState =
  | {
      errors?: {
        email?: string[]
        password?: string[]
        confirmPassword?: string[]
        nickname?: string[]
        role?: string[]
        form?: string[]
      }
      message?: string
    }
  | undefined

export type LoginFormState =
  | {
      errors?: {
        email?: string[]
        password?: string[]
        form?: string[]
      }
      message?: string
    }
  | undefined
