import { doc, getDoc } from "firebase/firestore"
import database from "../../firebase/firebaseConfig"

export const getUser = (uid) => {
    return new Promise((resolve) => {
        getDoc(doc(database, `users/${uid}`))
            .then((snapshot) => {
                console.log(snapshot.data(), uid)
                resolve(snapshot.data());
            })
    })
}