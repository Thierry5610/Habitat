import { createContext, useContext, useEffect, useState } from "react"
import listings from "./listingData"
import useDataBase from "./InitializeDB"
import AsyncStorage from "@react-native-async-storage/async-storage"

const userContext = createContext()
const {db,addUserProfile,seeUserProfiles} = useDataBase()

export default function UserContextProvider({children}){
    useEffect(()=>{
        (async()=>{
            userProfile = await AsyncStorage.getItem('UserProfile')
            Profiles = await seeUserProfiles()
            userProfileData = JSON.parse(userProfile)
            Profiles.forEach(element => {
                if(element.id===userProfileData?.id){
                    console.log("from hook",element)
                    userData==''&&setUserData(element)
                }
            });
        })()
    })
    useEffect(() => {
        if (userData) {
          addUserProfile(userData.id, userData);
        }
      });

    const [userData,setUserData] = useState('')

    const InitUser = (data) => {
        setUserData(data)
    }
    const changeName = (newName) => {
        setUserData((prevState)=>({...prevState,name:newName}))
        addUserProfile(userData.id,userData)
    }
    const changeEmail = (newEmail) => {
        setUserData((prevState)=>({...prevState,email:newEmail}))
        addUserProfile(userData.id,userData)
    }
    const changePhone = (newPhone) => {
        setUserData((prevState)=>({...prevState,telephone:newPhone}))
        addUserProfile(userData.id,userData)
    }
    const changeProfilePicture = (newPicture)=> {
        setUserData((prevState)=>({...prevState,profilePicture:newPicture}))
    }
    const addLike = (property) => {
        setUserData((prevState)=>({...prevState,liked:[...prevState.liked,property.id]}))
        addUserProfile(userData.id,userData)
    }
    const removeLike = (property) => {
        setUserData((prevState)=>({...prevState,liked:prevState.liked.filter((id)=>(id!==property.id))}))
        addUserProfile(userData.id,userData)
    }
    const addProperty = (property) => {
        setUserData((prevState)=>({...prevState,property:[...prevState.property,property.id]}))
        addUserProfile(userData.id,userData)
    }
    const removeProperty = (property) => {
        setUserData((prevState)=>({...prevState,property:prevState.property.filter((id)=>(id!==property.id))}))
        addUserProfile(userData.id,userData)
    }
    const isLiked = (property) => {
        if(userData?.liked.includes(property.id)){
            return true
        }else {
            return false
        }
    }
    return(
        <>
            <userContext.Provider value={{listings,userData,setUserData,InitUser,removeProperty,changeName,changeEmail,changePhone,changeProfilePicture,addLike,removeLike,addProperty,isLiked}}>
                {children}
            </userContext.Provider>
        </>
    )
}

export function useUser(){return useContext(userContext)}