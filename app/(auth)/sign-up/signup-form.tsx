'use client'
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { registerUser, signInWithCredentials } from "@/lib/actions/user.actions"
import { APP_NAME } from "@/lib/constants"
import { UserSignUpSchema } from "@/lib/validator"
import { IUserSignUp } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import Link from "next/link"
import { redirect, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export default function SignUpForm(){
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

    const signUpDefaultValues = process.env.NODE_ENV === "development" 
    ? {
        name: 'john doe',
        email: 'john@me.com',
        password: '123456',
        confirmPassword: '123456'
    } 
    : {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    }

    const form = useForm<IUserSignUp>({
        resolver: zodResolver(UserSignUpSchema),
        defaultValues: signUpDefaultValues
    })

    const { handleSubmit} = form

    const onSubmit = async (data: IUserSignUp) =>{
        try {
            const res = await registerUser(data)
            if(!res.success){
                 toast('Error',{
        
                description: `${res.error}`,
                // variant: 'destructive',
      })
        return
            }
            await signInWithCredentials({
              email: data.email,
              password: data.password
            })
            redirect(callbackUrl)
        } catch (error) {
            if(isRedirectError(error)){
              throw error
            }
            toast('Error',{
              description:'Invalid email or password'
            })
        }
    }


    return (
         <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
          <FieldSet>
            {/* <FieldLegend>Payment Method</FieldLegend>
            <FieldDescription>
              All transactions are secure and encrypted
            </FieldDescription> */}
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                  Name
                </FieldLabel>
                <Input
                  id="checkout-7j9-card-name-43j"
                  placeholder="Enter your name"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                  Email
                </FieldLabel>
                <Input
                  id="checkout-7j9-card-name-43j"
                  placeholder="Enter your Email"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                  Password
                </FieldLabel>
                <Input
                  id="checkout-7j9-card-name-43j"
                  placeholder="Enter your password"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                  Confirm Password
                </FieldLabel>
                <Input
                  id="checkout-7j9-card-name-43j"
                  placeholder="Confirm password"
                  required
                />
              </Field>
                </FieldGroup>
              <Button>Submit</Button>
                </FieldSet>
              </FieldGroup>
                   <div className='text-sm'>
            By creating an account, you agree to {APP_NAME}&apos;s{' '}
            <Link href='/page/conditions-of-use'>Conditions of Use</Link> and{' '}
            <Link href='/page/privacy-policy'> Privacy Notice. </Link>
          </div>
          <Separator className='mb-4' />
          <div className='text-sm'>
            Already have an account?{' '}
            <Link className='link' href={`/sign-in?callbackUrl=${callbackUrl}`}>
              Sign In
            </Link>
          </div>
    </form>
    )
}