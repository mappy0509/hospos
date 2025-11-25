// assets/js/firebase-config.js

// 指定されたバージョンのSDKをインポート
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

// HOSPOSの設定情報
const firebaseConfig = {
  apiKey: "AIzaSyA2-gjf1hEyAnuE4oZSBSY9Oi6UZH5liTU",
  authDomain: "hospos-d05d2.firebaseapp.com",
  projectId: "hospos-d05d2",
  storageBucket: "hospos-d05d2.firebasestorage.app",
  messagingSenderId: "213700083112",
  appId: "1:213700083112:web:b76c124eb48cbc0e75319d"
};

// Firebase初期化
const app = initializeApp(firebaseConfig);

// 他のファイルで使えるようにエクスポート
export const db = getFirestore(app);
export const auth = getAuth(app);

console.log("HOSPOS: Firebase Connected");