import { addDoc, collection, deleteDoc, doc, getDoc, setDoc } from "firebase/firestore"
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

// application actions
export const acceptApplicationFunc = async (id, uid) => {
    const date = new Date().getTime();
    getDoc(doc(database, `communities/${id}/communitiesApplications/${uid}`))
        .then((snapshot) => {
            if (snapshot.data().role === 'member') {
                setDoc(doc(database, `communities/${id}/members/${uid}`), {
                    ...snapshot.data().sendedUser,
                    role: 'member',
                    dateAccepted: date
                });
                setDoc(doc(database, `users/${uid}/involvedCommunities/${id}`), {
                    ...snapshot.data().community,
                    role: 'member',
                    date: date
                })
            }
            else {
                setDoc(doc(database, `communities/${id}/admins/${uid}`), {
                    ...snapshot.data().sendedUser,
                    role: 'admin',
                    dateAccepted: new Date().getTime()
                });
                setDoc(doc(database, `users/${uid}/involvedCommunities/${id}`), {
                    ...snapshot.data().community,
                    role: 'admin',
                    date: date
                })
            }
        })
        .then(() => {
            deleteApplicationFunc(id, uid);
        })
}

export const deleteApplicationFunc = async (id, uid) => {
    deleteDoc(doc(database, `communities/${id}/communitiesApplications/${uid}`))
}