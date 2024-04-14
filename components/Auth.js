import { Alert } from 'react-native';
import {
    createUserWithEmailAndPassword,
    deleteUser,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    verifyBeforeUpdateEmail,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider
} from 'firebase/auth';
import { collection, deleteDoc, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, RECIPES_REF, USERS_REF } from '../firebase/Config';

export const register = async (email, password, nickname) => {
    await createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        setDoc(doc(db, USERS_REF, userCredential.user.uid), {
            nickname: nickname,
            email: userCredential.user.email
        });
        console.log('User registered successfully!');
    })
    .catch((error) => {
        console.log('Registration failed: ', error.message);
        Alert.alert('Registration failed', error.message);
    })
}

export const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password)
    .then(() => {
        console.log('User logged in successfully!');
    })
    .catch((error) => {
        console.log('Login failed: ', error.message);
        Alert.alert('Login failed', error.message);
    })
}

export const logout = async () => {
    await signOut(auth)
    .then(() => {
        console.log('User logged out successfully!');
    })
    .catch((error) => {
        console.log('Logout failed: ', error.message);
        Alert.alert('Logout failed', error.message);
    })
}

export const changeEmail = async (email, db, USERS_REF) => {
    await verifyBeforeUpdateEmail(auth.currentUser, email)
    .then(async () => {
        console.log('Email updated successfully!');
        Alert.alert('Success! Please verify your new email address!');
        const colRef = collection(db, USERS_REF);
        await updateDoc(doc(colRef, auth.currentUser.uid), {
            email: email
        })
    })
    .catch((error) => {
        if (error.message.includes('auth/requires-recent-login')) {
            throw error;
        }
        console.log('Email update failed: ', error.message);
    })
}

export const reauthenticate = async (password) => {
    const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
    await reauthenticateWithCredential(auth.currentUser, credential)
    .then(() => {
        console.log('Reauthentication successful!');
    })
    .catch((error) => {
        console.log('Reauthentication failed: ', error.message);
        Alert.alert('Reauthentication failed', error.message);
    })
}

export const changePassword = async (password) => {
    await updatePassword(auth.currentUser, password)
    .then(() => {
        console.log('Password updated successfully!');
        Alert.alert('Password updated successfully!');
    })
    .catch((error) => {
        if (error.message.includes('auth/requires-recent-login')) {
            throw error;
        }
        console.log('Password update failed: ', error.message);
        Alert.alert('Password update failed', error.message);
    })
}

export const resetPassword = async (email) => {
    auth.languageCode = 'en';
    await sendPasswordResetEmail(auth, email)
    .then(() => {
        console.log('Password reset email sent successfully!');
        Alert.alert('Password reset email sent successfully!');
    })
    .catch((error) => {
        console.log('Password reset email failed: ', error.message);
        Alert.alert('Password reset email failed', error.message);
    })
}

export const removeUser = async () => {
    deleteFavoriteRecipes();
    // deletePlannedRecipes();
    // deleteShoppingList();
    deleteUserDocument();
    deleteUser(auth.currentUser)
    .then(() => {
        console.log('User removed successfully!');
    })
    .catch((error) => {
        console.log('User removal failed: ', error.message);
        Alert.alert('User removal failed', error.message);
    })
}

const deleteFavoriteRecipes = async () => {
    const subColRef = collection(db, USERS_REF, auth.currentUser.uid, RECIPES_REF);
    onSnapshot(subColRef, (querySnapshot) => {
        querySnapshot.docs.map((doc) => {
            removeRecipe(doc.id);
        })
    })
}

const removeRecipe = async (id) => {
    try {
        const subColRef = collection(db, USERS_REF, auth.currentUser.uid, RECIPES_REF);
        await deleteDoc(doc(subColRef, id));
    }
    catch (error) {
        console.log(error.message);
    }
}

const deleteUserDocument = async () => {
    await deleteDoc(doc(db, USERS_REF, auth.currentUser.uid))
    .then(() => {
        console.log('User document deleted successfully!');
    })
    .catch((error) => {
        console.log('User document deletion failed: ', error.message);
        Alert.alert('User document deletion failed', error.message);
    })
}
    