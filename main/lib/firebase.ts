import { initializeApp } from "firebase/app";
import {
    getFirestore,
    query,
    collection,
    where,
    getDocs,
    Timestamp,
} from "firebase/firestore/lite";
import isDev from "electron-is-dev";
import { getLang, getLastMessageSeenTimestamp } from "../model/user-preference";
import { mainLogger } from "../utils/logger";

// TODO: add to "config.json"
// Reminder: this is safe in client code
const firebaseConfig = {
    apiKey: "AIzaSyAHPaxWMqp77YuyvMXZ3ASrhmGzVlfgV0Y",
    authDomain: "moubah-75c64.firebaseapp.com",
    projectId: "moubah-75c64",
    storageBucket: "moubah-75c64.appspot.com",
    messagingSenderId: "939112720888",
    appId: "1:939112720888:web:35b0c0cf64c3e4345ace0d",
    measurementId: "G-Q562BC7TWE",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const messageRef = collection(db, "message");

export async function getNewMessages() {
    let timestamp = getLastMessageSeenTimestamp();
    if (!timestamp) timestamp = Date.now();

    const q = query(
        messageRef,
        where("timestamp", ">", Timestamp.fromDate(new Date(timestamp)))
    );
    const querySnapshot = await getDocs(q);

    const lang = getLang();
    return querySnapshot.docs.map((message) => {
        const data = message.data();
        if (data.onlyDev && !isDev) return;
        try {
            return {
                timestamp: data.timestamp.toMillis(),
                type: data.type || "info",
                text: data.text[lang],
                link: data.link,
            };
        } catch (error) {
            mainLogger.error(error);
            return;
        }
    });
}
