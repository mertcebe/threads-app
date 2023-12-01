import { addDoc, collection } from "firebase/firestore"
import database from "../../firebase/firebaseConfig"

export const setCommunitiesToFirebase = async (communities) => {
    addDoc(collection(database, `communities`), communities);
}