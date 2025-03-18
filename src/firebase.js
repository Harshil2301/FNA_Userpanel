import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC30OywaJlkOJVyx9WYtU1XvWnxBhcw5Og",
  authDomain: "fnaai-1c002.firebaseapp.com",
  projectId: "fnaai-1c002",
  storageBucket: "fnaai-1c002.appspot.com",
  messagingSenderId: "1076450820888",
  appId: "1:1076450820888:web:ba426401d4f1a0d3f0546d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to fetch videos from Firestore
export const fetchVideos = async (limitCount = 6) => {
  try {
    const videosRef = collection(db, 'videos');
    const q = query(videosRef, orderBy('timestamp', 'desc'), limit(limitCount));
    const videoSnapshot = await getDocs(q);
    
    return videoSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
};

// Function to convert IPFS hash to accessible URL
export const getVideoUrl = (videoHash) => {
  if (!videoHash) return null;
  
  const ipfsGateway = 'https://brown-passive-cattle-71.mypinata.cloud/ipfs/';
  return `${ipfsGateway}${videoHash.split('/').pop()}`;
};

export { db };
export default app; 