import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    updateProfile
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { 
    collection, 
    addDoc, 
    query, 
    where, 
    getDocs, 
    deleteDoc, 
    doc 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { auth, db } from './firebase-config.js';

const loginPage = document.getElementById('loginPage');
const signupPage = document.getElementById('signupPage');
const dashboardPage = document.getElementById('dashboardPage');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const logoutBtn = document.getElementById('logoutBtn');
const showSignup = document.getElementById('showSignup');
const showLogin = document.getElementById('showLogin');
const loginError = document.getElementById('loginError');
const signupError = document.getElementById('signupError');
const dashboardError = document.getElementById('dashboardError');
const dataForm = document.getElementById('dataForm');
const dataList = document.getElementById('dataList');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const userInitial = document.getElementById('userInitial');
const loadingSpinner = document.getElementById('loadingSpinner');

function showPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    page.classList.add('active');
}

function showError(errorElement, message) {
    errorElement.textContent = message;
    errorElement.classList.add('show');
    setTimeout(() => {
        errorElement.classList.remove('show');
    }, 5000);
}

function showLoading() {
    loadingSpinner.classList.remove('hidden');
}

function hideLoading() {
    loadingSpinner.classList.add('hidden');
}

function updateUserInfo(user) {
    userName.textContent = user.displayName || 'User';
    userEmail.textContent = user.email;
    const initial = (user.displayName || user.email || 'U').charAt(0).toUpperCase();
    userInitial.textContent = initial;
}

async function loadUserData(userId) {
    try {
        const q = query(collection(db, 'userData'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        
        dataList.innerHTML = '';
        
        if (querySnapshot.empty) {
            dataList.innerHTML = '<li style="color: #666; font-style: italic;">No data saved yet</li>';
            return;
        }
        
        querySnapshot.forEach((docSnapshot) => {
            const data = docSnapshot.data();
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${data.content}</span>
                <button onclick="deleteData('${docSnapshot.id}')">Delete</button>
            `;
            dataList.appendChild(li);
        });
    } catch (error) {
        console.error('Error loading data:', error);
        showError(dashboardError, 'Error loading data: ' + error.message);
    }
}

window.deleteData = async function(docId) {
    try {
        await deleteDoc(doc(db, 'userData', docId));
        const currentUser = auth.currentUser;
        if (currentUser) {
            loadUserData(currentUser.uid);
        }
    } catch (error) {
        console.error('Error deleting data:', error);
        showError(dashboardError, 'Error deleting data: ' + error.message);
    }
};

showSignup.addEventListener('click', (e) => {
    e.preventDefault();
    showPage(signupPage);
    signupError.classList.remove('show');
});

showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    showPage(loginPage);
    loginError.classList.remove('show');
});

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    showLoading();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        await updateProfile(user, {
            displayName: name
        });
        
        await addDoc(collection(db, 'userData'), {
            userId: user.uid,
            content: 'Welcome! Your first data entry.',
            timestamp: new Date()
        });
        
        signupForm.reset();
        hideLoading();
    } catch (error) {
        hideLoading();
        let errorMessage = 'An error occurred';
        
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = 'This email is already registered';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Invalid email address';
                break;
            case 'auth/weak-password':
                errorMessage = 'Password should be at least 6 characters';
                break;
            default:
                errorMessage = error.message;
        }
        
        showError(signupError, errorMessage);
    }
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    showLoading();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        await signInWithEmailAndPassword(auth, email, password);
        loginForm.reset();
        hideLoading();
    } catch (error) {
        hideLoading();
        let errorMessage = 'An error occurred';
        
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage = 'No account found with this email';
                break;
            case 'auth/wrong-password':
                errorMessage = 'Incorrect password';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Invalid email address';
                break;
            case 'auth/user-disabled':
                errorMessage = 'This account has been disabled';
                break;
            default:
                errorMessage = error.message;
        }
        
        showError(loginError, errorMessage);
    }
});

logoutBtn.addEventListener('click', async () => {
    try {
        await signOut(auth);
    } catch (error) {
        showError(dashboardError, 'Error signing out: ' + error.message);
    }
});

dataForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const currentUser = auth.currentUser;
    if (!currentUser) {
        showError(dashboardError, 'You must be logged in to save data');
        return;
    }
    
    const dataInput = document.getElementById('dataInput');
    const content = dataInput.value.trim();
    
    if (!content) {
        showError(dashboardError, 'Please enter some data');
        return;
    }
    
    try {
        await addDoc(collection(db, 'userData'), {
            userId: currentUser.uid,
            content: content,
            timestamp: new Date()
        });
        
        dataInput.value = '';
        loadUserData(currentUser.uid);
    } catch (error) {
        console.error('Error saving data:', error);
        showError(dashboardError, 'Error saving data: ' + error.message);
    }
});

onAuthStateChanged(auth, (user) => {
    if (user) {
        updateUserInfo(user);
        loadUserData(user.uid);
        showPage(dashboardPage);
    } else {
        showPage(loginPage);
        dataList.innerHTML = '';
    }
});

