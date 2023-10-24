import { onAuthStateChanged } from 'firebase/auth'
import React, { useState } from 'react'
import { auth } from '../firebase/firebaseConfig'

const useAuthorized = async () => {
    let [isAuthorized, setIsAuthorized] = useState(false);
    let [loading, setLoading] = useState(true);
    await onAuthStateChanged(auth, (user) => {
        if (user) {
            isAuthorized = true;
        }
        else {
            isAuthorized = false
        }
        setLoading(false)
    });
    return {isAuthorized, loading}
}

export default useAuthorized