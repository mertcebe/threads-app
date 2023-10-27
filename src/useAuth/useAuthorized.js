import { onAuthStateChanged } from 'firebase/auth'
import React, { useState } from 'react'
import { auth } from '../firebase/firebaseConfig'

const useAuthorized = () => {
    let [isAuthorized, setIsAuthorized] = useState();
    let [loading, setLoading] = useState(true);
    onAuthStateChanged(auth, (user) => {
        if (user) {
            setIsAuthorized(true);
        }
        else {
            setIsAuthorized(false);
        }
        setLoading(false)
    });
    return { isAuthorized, loading }
}

export default useAuthorized