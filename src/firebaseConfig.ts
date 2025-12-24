import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBOUOBZRgXGaw0WguZpCukqcCajwaO3ZVs",
  authDomain: "teacherayaa.firebaseapp.com",
  projectId: "teacherayaa",
  storageBucket: "teacherayaa.appspot.com",
  messagingSenderId: "544775775264",
  appId: "1:544775775264:web:254c5ccf16e37e81b38845"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
