import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, setDoc, updateDoc, where } from "firebase/firestore";
import database, { auth } from "../../../firebase/firebaseConfig";

export const getAllPosts = () => {
    return new Promise((resolve) => {
        let posts = [];
        getDocs(query(collection(database, `allPosts`), orderBy('dateAdded', 'desc')))
            .then((snapshot) => {
                snapshot.forEach(async (item) => {
                    console.log(item.data().forWhichCommunity?.allMembers?.includes(`${auth.currentUser.uid}`))
                    if (item.data().forWhichCommunity?.allMembers?.includes(`${auth.currentUser.uid}`) || item.data().forWhichCommunity === 'all') {
                        posts.push({
                            ...item.data(),
                            id: item.id
                        });
                    }
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
        getDocs(query(collection(database, `allPosts/${id}/comments`), orderBy('dateSended', 'asc')))
            .then((snapshot) => {
                let comments = [];
                snapshot.forEach((comment) => {
                    comments.push({
                        ...comment.data(),
                        id: comment.id,
                        postId: id
                    });
                })
                resolve(comments);
            })
    })
}

export const getCommentsInFrom = (postId, commentId) => {
    return new Promise((resolve) => {
        getDocs(query(collection(database, `allPosts/${postId}/comments/${commentId}/commentsIn`), orderBy('dateSended', 'asc')))
            .then((snapshot) => {
                let comments = [];
                snapshot.forEach((comment) => {
                    comments.push({
                        ...comment.data(),
                        id: comment.id,
                        postId: postId
                    });
                })
                resolve(comments);
            })
    })
}

export const sendCommentsInTo = (postId, commentId, commentTo, commentData) => {
    return new Promise((resolve) => {
        addDoc((collection(database, `allPosts/${postId}/comments/${commentId}/commentsIn`)), {
            ...commentData
        })
            .then((snapshot) => {
                setDoc((doc(database, `users/${commentTo}/posts/${postId}/comments/${commentId}/commentsIn/${snapshot.id}`)), {
                    ...commentData
                })
                setDoc((doc(database, `users/${auth.currentUser.uid}/replies/${snapshot.id}`)), {
                    ...commentData,
                    type: 'commentIn',
                    commentTo: { commentTo, commentId },
                    postId: postId
                })
                addDoc(collection(database, `users/${auth.currentUser.uid}/newMoves`), { type: 'reply' });
            })
    })
}

export const sendCommentTo = async (postId, uid, comment) => {
    await addDoc(collection(database, `users/${uid}/posts/${postId}/comments`), { ...comment, ownerUid: uid })
        .then((snapshot) => {
            setDoc(doc(database, `allPosts/${postId}/comments/${snapshot.id}`), { ...comment, ownerUid: uid });
            setDoc(doc(database, `users/${auth.currentUser.uid}/replies/${snapshot.id}`), { ...comment, ownerUid: uid, type: 'comment', postId: postId });
            addDoc(collection(database, `users/${auth.currentUser.uid}/newMoves`), { type: 'reply' });
        })
}

export const deleteCommentOf = async (postId, ownerUid, commentId) => {
    await deleteDoc(doc(database, `users/${ownerUid}/posts/${postId}/comments/${commentId}`))
        .then(() => {
            deleteDoc(doc(database, `allPosts/${postId}/comments/${commentId}`));
            deleteDoc(doc(database, `users/${auth.currentUser.uid}/replies/${commentId}`));
        })
}

export const deleteCommentInOf = async (postId, ownerUid, commentId, id) => {
    await deleteDoc(doc(database, `users/${ownerUid}/posts/${postId}/comments/${commentId}/commentsIn/${id}`))
        .then(() => {
            deleteDoc(doc(database, `allPosts/${postId}/comments/${commentId}/commentsIn/${id}`));
            deleteDoc((doc(database, `users/${auth.currentUser.uid}/replies/${id}`)));
        })
}

export const getNewPosts = async () => {
    return new Promise((resolve) => {
        getDocs(query(collection(database, `users/${auth.currentUser.uid}/newMoves`), where('type', '==', 'post')))
            .then((snapshot) => {
                let moves = [];
                snapshot.forEach((move) => {
                    moves.push({
                        ...move.data(),
                        id: move.id
                    });
                })
                resolve(moves);
            })
    })
}

export const getNewReplies = async () => {
    return new Promise((resolve) => {
        getDocs(query(collection(database, `users/${auth.currentUser.uid}/newMoves`), where('type', '==', 'reply')))
            .then((snapshot) => {
                let moves = [];
                snapshot.forEach((move) => {
                    moves.push({
                        ...move.data(),
                        id: move.id
                    });
                })
                resolve(moves);
            })
    })
}

export const getNewInvitations = async () => {
    return new Promise((resolve) => {
        getDocs(query(collection(database, `users/${auth.currentUser.uid}/newMoves`), where('type', '==', 'invitations')))
            .then((snapshot) => {
                let moves = [];
                snapshot.forEach((move) => {
                    moves.push({
                        ...move.data(),
                        id: move.id
                    });
                })
                resolve(moves);
            })
    })
}

export const setLike = async (postId, value) => {
    await updateDoc(doc(database, `allPosts/${postId}`), {
        isLike: value
    });
    await getDoc(doc(database, `allPosts/${postId}`))
        .then((snapshot) => {
            updateDoc(doc(database, `users/${snapshot.data().owner.uid}/posts/${postId}`), {
                isLike: value
            });
            if (snapshot.data().forWhichCommunity !== 'all') {
                updateDoc(doc(database, `communities/${snapshot.data().forWhichCommunity.id}/threads/${postId}`), {
                    isLike: value
                });
                updateDoc(doc(database, `users/${snapshot.data().owner.uid}/threadsForCommunities/${postId}`), {
                    isLike: value
                });
            }
        })
}