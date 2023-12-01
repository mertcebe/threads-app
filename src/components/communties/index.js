import React, { useEffect, useState } from 'react'
import { MyInput } from '../profile/EditPage'
import { collection, getDocs, query } from 'firebase/firestore';
import database, { auth } from '../../firebase/firebaseConfig';

const CommuntiesPage = () => {
    let [communities, setCommunities] = useState();
    let [searchText, setSearchText] = useState('');
    const getAllCommunities = () => {
        return new Promise((resolve) => {
            getDocs(query(collection(database, `communities`)))
                .then((snapshot) => {
                    let users = [];
                    snapshot.forEach((user) => {
                        users.push({
                            ...user.data()
                        })
                    });
                    resolve(users);
                })
        })
    }
    useEffect(() => {
        getAllCommunities()
            .then((snapshot) => {
                setCommunities(snapshot);
            })
    }, []);

    if (!communities) {
        return (
            <div style={{ width: "calc(100% - 534.28px)", padding: "40px 30px" }}>
                loading...
            </div>
        )
    }
    return (
        <div style={{ width: "calc(100% - 534.28px)", padding: "40px 30px" }}>
            <h4 style={{ color: "#fff" }}><b>Communities</b></h4>

            <MyInput type='search' style={{ padding: "10px", borderRadius: "10px" }} onChange={(e) => {
                setSearchText(e.target.value);
            }} placeholder='Search communities' />
            <hr style={{ color: "rebeccapurple" }} />
            
            <div>

            </div>
        </div>
    )
}

export default CommuntiesPage