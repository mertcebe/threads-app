import React, { useEffect, useState } from 'react'
import { MyInput } from '../profile/EditPage'
import { collection, getDocs, query } from 'firebase/firestore';
import database, { auth } from '../../firebase/firebaseConfig';
import SearchUserContainer from './SearchUserContainer';

const SearchPage = () => {
    let [users, setUsers] = useState();
    let [searchText, setSearchText] = useState('');
    const getAllUsers = () => {
        return new Promise((resolve) => {
            getDocs(query(collection(database, `users`)))
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
        getAllUsers()
            .then((snapshot) => {
                setUsers(snapshot);
            })
    }, []);

    if (!users) {
        return (
            <div className='responsiveContanier' style={{ width: "calc(100% - 534.28px)", padding: "40px 30px" }}>
                loading...
            </div>
        )
    }
    return (
        <div className='responsiveContanier' style={{ width: "calc(100% - 534.28px)", padding: "40px 30px" }}>
            <h4 style={{ color: "#fff" }}><b>Search</b></h4>

            <MyInput type='search' style={{ padding: "10px", borderRadius: "10px" }} onChange={(e) => {
                setSearchText(e.target.value);
            }} placeholder='Search users' />
            <hr style={{ color: "rebeccapurple" }} />
            <div>
                {
                    users.map((user) => {
                        if (user.displayName.toLowerCase().includes(searchText.toLowerCase())) {
                            return (
                                <SearchUserContainer user={user} />
                            )
                        }
                    })
                }
            </div>
        </div>
    )
}

export default SearchPage