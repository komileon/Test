
import Forms from '../components/Forms'
import MessageBox from '../components/MessageBox'

const Test = () => {
    return (
        <div className='bg-black w-full min-h-screen text-white flex flex-col gap-6'>
            <MessageBox>
                <Forms />
            </MessageBox>
        </div>
    )
}

export default Test
