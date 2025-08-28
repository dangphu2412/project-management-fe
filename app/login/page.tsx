'use client'
import { Button } from "@/shared/design-system/components/ui/button";
import { Input } from "@/shared/design-system/components/ui/input";
import {Label} from "@/shared/design-system/components/ui/label";
import {useForm} from "react-hook-form";
import {apiClient} from "@/shared/api-client";

type LoginResponse = {
    accessToken: string;
}

function LoginPage() {
    const { register, handleSubmit } = useForm();

    return <form className={'w-[522px] flex flex-col gap-2'} onSubmit={handleSubmit(async (data) => {
        const {accessToken, refreshToken} = await apiClient.request({
            method: 'POST',
            body: data,
            url: '/auth/login'
        })

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    })}>
        <div>
            <Label>
                Username
            </Label>
            <Input type={'text'} {...register('username')} />
        </div>

        <div>
            <Label>
                Password
            </Label>
            <Input type={'password'} {...register('password')} />
        </div>

        <Button>
            Login
        </Button>
    </form>
}

export default LoginPage;
