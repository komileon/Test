import React, { useState } from 'react'
import Spinner from './Spinner'
import type { Errors } from '../types/errors.type'

type ErrorsProps = {
    onMessageError?: (error: Errors | null) => void
}

const Forms = ({ onMessageError }: ErrorsProps) => {

    const [isLoading, setIsLoading] = useState(false)


    async function login() {
        await new Promise((resolve, reject) => {
            setTimeout(reject, 2000)
        })

    }

    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()
        try {
            setIsLoading(true)
            await login()
        } catch (error) {
            console.log("Network Error: ", error);
            onMessageError?.(
                {
                    type: "network",
                    description: "Impossible de contacter le serveur",
                    retry: true
                }
            )
        } finally {
            setIsLoading(false)
        }
    }



    return (
        <form onSubmit={handleSubmit} className='m-auto flex flex-col items-center gap-6 w-1/5'>
            <h3>Login</h3>
            <div className='flex flex-col gap-4 w-full'>
                <input type="email" placeholder='Email' className='input-style' />
                <input type="password" placeholder='Password' className='input-style' />
            </div>
            <LoginButton isLoad={isLoading} />
        </form>
    )
}

export default Forms


const LoginButton = ({ isLoad }: { isLoad: boolean }) => {


    return (
        <button className='button-style bg-blue-500' disabled={isLoad}>
            {
                isLoad ? < Spinner /> : 'Login'
            }
        </button>
    )
}

