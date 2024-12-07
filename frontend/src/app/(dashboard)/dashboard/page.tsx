'use client'
import { useUser } from '@clerk/nextjs';

const Page = () => {
    const { user } = useUser();
    return (
        <div>
            {user ? (
                <>
                    <p>User ID: {user.id}</p>
                    <p>Email: {user.primaryEmailAddress?.emailAddress}</p>
                    <p>Name: {user.firstName}</p>
                </>
            ) : (
                <p>Loading user...</p>
            )}
        </div>
    );
};

export default Page;
