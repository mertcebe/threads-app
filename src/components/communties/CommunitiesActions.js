import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore"
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

export const setAdminToFirebase = async (user, community) => {
    await setDoc(doc(database, `users/${user.uid}/involvedCommunities/${community.id}`), {
        ...user,
        ...community,
        role: 'admin',
        date: new Date().getTime()
    })
        .then(() => {
            setDoc(doc(database, `communities/${community.id}/admins/${user.uid}`), {
                ...user
            })
        })
}

export const getCommunity = async (id) => {
    return new Promise((resolve) => {
        getDoc(doc(database, `communities/${id}`))
            .then((snapshot) => {
                resolve({
                    ...snapshot.data(),
                    id: snapshot.id
                })
            })
    })
}