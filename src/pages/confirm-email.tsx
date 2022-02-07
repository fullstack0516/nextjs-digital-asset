import { useEffect } from 'react';
import { useRouter } from 'next/router'
import { confirmBackupEmail } from '../utils/client/user-actions';

export default function ConfirmEmail() {
    const router = useRouter()
    useEffect(() => {
        const confirmCode = async () => {
            const { code } = router.query ?? {}
            if (code) {
                const confirmed = await confirmBackupEmail(code as string);
                if (confirmed) {
                    router.push('/profile')
                }
            }
            else {
                router.push('/')
            }
        }
        confirmCode()
    }, [])
    return (
        <h1>
            Processing for confirming your email addresss...
        </h1>
    );
}
