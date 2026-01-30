'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateUserName } from "@/lib/actions/user.actions";
import { UserNameSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export  function ProfileForm (){
    const router = useRouter()
    const {data: session, update } = useSession()
    const form = useForm<z.infer<typeof UserNameSchema>>({
        resolver: zodResolver(UserNameSchema),
        defaultValues:{
            name: session?.user?.name!
        }
    })

    const {handleSubmit,register, formState:{isSubmitting, errors}} = form

    async function onSubmit(values: z.infer<typeof UserNameSchema>){
        const res = await updateUserName(values)
        if(!res.success){
            toast.error(res.message)
        }

        const {data, message}= res
        const newSession ={
            ...session,
            user:{
                ...session?.user,
                name:data.name
            }
        }

        await update(newSession)
        toast.success(message)

        router.push('/account/manage')
    }

    return(
        <form className='  flex flex-col gap-5'
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="flex flex-col gap-5">
        <label htmlFor="name" className="font-bold">
          New name
        </label>
        <Input id="name" placeholder="Name" {...register("name", { required: "Name is required" })} className="input-field" />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="button col-span-2 w-full" >
        {isSubmitting ? "Submitting..." : "Save Changes"}
      </Button>
        </form>
    )

}