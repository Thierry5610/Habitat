import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc,collection,getDocs, deleteDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes,getDownloadURL, deleteObject,listAll} from "firebase/storage";

const useDataBase = () => {
    const firebaseConfig = {
        apiKey: "AIzaSyDkoChW0nCHrRDZRgDxV19qrsNAC1oi0_c",
        authDomain: "habitat-4c8a3.firebaseapp.com",
        databaseURL: "https://habitat-4c8a3-default-rtdb.firebaseio.com",
        projectId: "habitat-4c8a3",
        storageBucket: "habitat-4c8a3.appspot.com",
        messagingSenderId: "240119283486",
        appId: "1:240119283486:web:c00e1c430cb0e53b68530f",
        measurementId: "G-8X2HX7SEJL"
      };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const storage = getStorage();

    const addUser = (id,userObj) => {
        setDoc(doc(db, 'users', id), userObj);
    };

    const addProfileImage = async (id, imageURI) => {
        const response = await fetch(imageURI);
        const blob = await response.blob();
        const storageRef = ref(storage, `${id}/profilePicture.jpg`);
        // const metadata = {
        //     contentType: "image/png", 
        //   };
        
        return uploadBytes(storageRef, blob)
          .then((snapshot) => {
            return getDownloadURL(snapshot.ref);
          })
          .catch((error) => {
            console.error("Error uploading image:", error);
            throw error; // Rethrow the error to handle it in the component.
          });
      };

      const addPropertyImage = async (id, imageURI,index) => {
        const response = await fetch(imageURI);
        const blob = await response.blob();
        const storageRef = ref(storage, `${id}/PropertyImage${index}.jpg`);
        // const metadata = {
        //     contentType: "image/png", 
        //   };
        
        return uploadBytes(storageRef, blob)
          .then((snapshot) => {
            return getDownloadURL(snapshot.ref);
          })
          .catch((error) => {
            console.error("Error uploading image:", error);
            throw error; // Rethrow the error to handle it in the component.
          });
      };

    const addUserProfile = (id,UserProfileObj) => {
        setDoc(doc(db,'userProfiles',id),UserProfileObj)
    }      
    
    const addPropertyDB = (id,PropertyObj) => {
        setDoc(doc(db,'property',id),PropertyObj)
    }
    const removePropertyDB = async (id) => {
        try {
          // Delete the document from Firestore
          await deleteDoc(doc(db, 'property', id));
          console.log('Deleted document from Firestore successfully');
      
          // Delete the directory from Firebase Storage
          const directoryRef = ref(storage, id);
          await deleteDirectory(directoryRef);
          console.log('Deleted directory and its contents from Firebase Storage successfully');
        } catch (error) {
          console.error('Error deleting property:', error);
        }
      };
      
      const deleteDirectory = async (directoryRef) => {
        try {
          // List all items (files) in the directory
          const items = await listAll(directoryRef);
      
          // Delete each item (file) in the directory
          const deletePromises = items.items.map((item) => deleteObject(item));
      
          // Wait for all items (files) to be deleted
          await Promise.all(deletePromises);
      
          // Check if there are subdirectories (prefixes) in the directory
          if (items.prefixes.length > 0) {
            // Recursively delete subdirectories and their contents
            const deleteSubdirectoryPromises = items.prefixes.map((prefix) =>
              deleteDirectory(prefix)
            );
            await Promise.all(deleteSubdirectoryPromises);
          }
        } catch (error) {
          console.error('Error deleting directory:', error);
        }
      };
    const seeProperty = async () => {
        try {
            const querySnapshot = await getDocs(collection(db,'property'));
            const property = querySnapshot.docs.map((element)=> {
                return element.data();
            })
            return property;
        } catch  (error) {
            console.error('Error fetching property:',error)
            return [];
        }
    }

    const seeUser = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'users'));
            const users = querySnapshot.docs.map((element) => {
                //console.log(`userId: ${element.id} =>`, element.data());
                return element.data();
            });
            return users;
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    };

    const seeUserProfiles = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'userProfiles'));
            const users = querySnapshot.docs.map((element) => {
                //console.log(`userId: ${element.id} =>`, element.data());
                return element.data();
            });
            return users;
        } catch (error) {
            console.error('Error fetching userProfiles:', error);
            return [];
        }
    };
    

    return { db,addUser, seeUser,addUserProfile,removePropertyDB,seeUserProfiles,addProfileImage,addPropertyImage,addPropertyDB,seeProperty }; // Return the db and addUser function
};

export default useDataBase;
