# LAB_11_WEB_DEV

# Firebase Authentication App

A modern web application with Firebase Authentication and Firestore data storage. Users can sign up, log in, and store personal data securely.


## Setup Instructions

### 1. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Enable **Authentication**:
   - Go to Authentication → Sign-in method
   - Enable "Email/Password" provider
4. Enable **Firestore Database**:
   - Go to Firestore Database
   - Click "Create database"
   - Start in **test mode** (for development) or set up security rules
   - Choose a location for your database

### 2. Get Firebase Configuration

1. In Firebase Console, go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click the web icon (`</>`) to add a web app
4. Register your app with a nickname
5. Copy the Firebase configuration object

### 3. Configure the App

1. Open `firebase-config.js`
2. Replace the placeholder values with your Firebase configuration:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### 4. Firestore Security Rules (Optional but Recommended)

In Firebase Console → Firestore Database → Rules, update the rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /userData/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

This ensures users can only read/write their own data.

## Local Development

### Option 1: Using HTTP Server

```bash
npm install -g http-server
http-server -p 8080
```

Then open `http://localhost:8080` in your browser.

### Option 2: Using Python

```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

### Option 3: Using Node.js

```bash
npm install
npm start
```

## Deployment

### Deploy to Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init hosting
   ```
   - Select your Firebase project
   - Set public directory to `.` (current directory)
   - Configure as single-page app: **Yes**
   - Don't overwrite index.html: **No**

4. Deploy:
   ```bash
   firebase deploy --only hosting
   ```

5. Your app will be live at: `https://YOUR_PROJECT_ID.web.app`

### Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow the prompts to complete deployment

**Or** use the Vercel dashboard:
- Go to [vercel.com](https://vercel.com)
- Import your Git repository
- Vercel will automatically detect the configuration

### Deploy to Netlify

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Deploy:
   ```bash
   netlify deploy --prod
   ```

**Or** use the Netlify dashboard:
- Go to [netlify.com](https://netlify.com)
- Drag and drop your project folder
- Or connect your Git repository

## Project Structure

```
.
├── index.html          # Main HTML file
├── styles.css          # Styling
├── app.js              # Application logic
├── firebase-config.js  # Firebase configuration
├── firebase.json       # Firebase Hosting config
├── .vercel.json        # Vercel config
├── netlify.toml        # Netlify config
├── package.json        # Node.js dependencies
└── README.md           # This file
```

## Usage

1. **Sign Up**: Create a new account with email and password
2. **Sign In**: Login with your credentials
3. **Dashboard**: View your profile and saved data
4. **Add Data**: Enter data in the form and save it
5. **Delete Data**: Remove items from your data list
6. **Logout**: Sign out from your account

## Technologies Used

- HTML5
- CSS3 (with animations and gradients)
- JavaScript (ES6+)
- Firebase Authentication
- Firebase Firestore

## Security Notes

- Never commit your Firebase configuration with real credentials to public repositories
- Use environment variables for production deployments
- Set up proper Firestore security rules before going to production
- Consider enabling additional Firebase security features

## Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
- Make sure you've configured `firebase-config.js` with your actual Firebase credentials

### "Firebase: Error (auth/operation-not-allowed)"
- Enable Email/Password authentication in Firebase Console

### "Permission denied" errors
- Check your Firestore security rules
- Ensure the user is authenticated

### CORS errors
- Make sure your domain is added to Firebase authorized domains (if needed)

