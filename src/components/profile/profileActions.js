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
    const user = {
        displayName: auth.currentUser.displayName,
        email: auth.currentUser.email,
        uid: auth.currentUser.uid,
        photoURL: auth.currentUser.photoURL
    };
    return new Promise((resolve) => {
        getDocs(query(collection(database, `users/${uid}/posts`), orderBy('dateAdded', 'desc')))
            .then((snapshot) => {
                let posts = [];
                snapshot.forEach((post) => {
                    posts.push({
                        ...post.data(),
                        id: post.id,
                        owner: user
                    });
                })
                resolve(posts);
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