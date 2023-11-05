import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, setDoc } from "firebase/firestore";
import database from "../../../firebase/firebaseConfig";

export const getAllPosts = () => {
    return new Promise((resolve) => {
        getDocs(query(collection(database, `allPosts`), orderBy('dateAdded', 'desc')))
            .then((snapshot) => {
                let posts = [];
                snapshot.forEach((item) => {
                    posts.push({
                        ...item.data(),
                        id: item.id
                    });
                })
                resolve(posts);
            })
    })
}

export const getSinglePost = (id) => {
    return new Promise((resolve) => {
        getDoc(doc(database, `allPosts/${id}`))
            .then((snapshot) => {
                resolve({
                    ...snapshot.data(),
                    id: snapshot.id
                });
            })
    })
}

export const getCommentsFrom = (id) => {
    return new Promise((resolve) => {
        getDocs(query(collection(database, `allPosts/${id}/comments`), orderBy('dateSended', 'desc')))
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

export const sendCommentTo = (postId, uid, comment) => {
    addDoc(collection(database, `users/${uid}/posts/${postId}/comments`), comment)
    .then((snapshot) => {
        setDoc(doc(database, `allPosts/${postId}/comments/${snapshot.id}`), comment);
    })
}