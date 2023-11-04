import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export const setImagesToStorage = (files, uploadRef) => {
    return new Promise(async (resolve) => {
        const storage = getStorage();

        let allFiles = [];
        await files.map(async (file) => {
            const metadata = {
                contentType: `${file.file.type}`
            };
            const storageRef = ref(storage, `${uploadRef}/` + file.file.name);
            const uploadTask = await uploadBytesResumable(storageRef, file.file, metadata)
                .then((snapshot) => {
                    getDownloadURL(snapshot.ref).then((downloadURL) => {
                        allFiles.push({
                            name: file.file.name,
                            src: downloadURL
                        });
                        if(allFiles.length === files.length){
                            resolve(allFiles);
                        }
                    });
                })
        })
    })
}