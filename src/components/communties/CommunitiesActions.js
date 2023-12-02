import { addDoc, collection } from "firebase/firestore"
import database from "../../firebase/firebaseConfig"

export const setCommunitiesToFirebase = async (communities) => {
    return new Promise((resolve) => {
        addDoc(collection(database, `communities`), communities)
            .then((snapshot) => {
                resolve({
                    ...communities,
                    id: snapshot.id
                })
            })
    })
}