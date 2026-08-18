import React, { cloneElement, useState } from 'react'
import type { Errors } from '../types/errors.type'
import Spinner from './Spinner'

const MessageBox = ({ children }: { children: React.ReactElement }) => {

    const [error, setError] = useState<Errors | null>(null)
    const [isLoad, setIsLoad] = useState(false)


    function onMessageError(error: Errors) {
        setError(error)
        console.log("error")
    }

    const element = cloneElement(
        children,
        {
            onMessageError: onMessageError
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any
    )

    function handleRetry() {
        setIsLoad(true)
        setTimeout(() => {
            setError(null)
        }, 2000);
        console.log('Retry')
    }


    return (
        <>
            {
                error ? (<div className='border border-red-400 p-1 m-auto flex flex-col items-center gap-6 w-1/5'>
                    <p className='text-red-400'>{error.description}</p>
                    <button type='button' className='button-style bg-red-400' onClick={handleRetry}>
                        {
                            isLoad ? < Spinner /> : 'Retry'
                        }
                    </button>
                </div>) : element
            }
        </>
    )
}

export default MessageBox
