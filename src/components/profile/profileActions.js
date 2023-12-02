import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore"
import database, { auth } from "../../firebase/firebaseConfig"

export const getUser = (uid) => {
    return new Promise((resolve) => {
        getDoc(doc(database, `users/${uid}`))
            .then((snapshot) => {
                resolve(snapshot.data());
            })
    })
}

export const getUserPosts = (uid) => {
    return new Promise((resolve) => {
        getUser(uid)
            .then((snapshotForUser) => {
                getDocs(query(collection(database, `users/${uid}/posts`), orderBy('dateAdded', 'desc')))
                    .then((snapshot) => {
                        let posts = [];
                        snapshot.forEach((post) => {
                            posts.push({
                                ...post.data(),
                                id: post.id,
                                owner: snapshotForUser
                            });
                        })
                        resolve(posts);
                    })
            })

    })
}

export const getUserReplies = (uid) => {
    return new Promise((resolve) => {
        getDocs(query(collection(database, `users/${uid}/replies`), orderBy('dateSended', 'desc')))
            .then((snapshot) => {
                let comments = [];
                snapshot.forEach((comment) => {
                    comments.push({
                        ...comment.data(),
                        id: comment.id
                    });
                })
                resolve(comments);
            })
    })
}

export const getUserInvitations = (uid) => {
    return new Promise((resolve) => {
        getDocs(query(collection(database, `users/${uid}/communitiesInvite`), orderBy('dateSended', 'desc')))
            .then((snapshot) => {
                let invitations = [];
                snapshot.forEach((invitation) => {
                    invitations.push({
                        ...invitation.data(),
                        id: invitation.id
                    });
                })
                resolve(invitations);
            })
    })
}