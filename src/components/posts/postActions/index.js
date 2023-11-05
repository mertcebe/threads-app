import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";
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