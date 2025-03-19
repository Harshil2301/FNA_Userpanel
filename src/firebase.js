import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';

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

// Function to fetch videos from Firestore with optional category filtering
export const fetchVideos = async (limitCount = 6, category = null) => {
  try {
    const videosRef = collection(db, 'videos');
    let q;
    
    if (category) {
      // If a category is provided, filter by it
      // Assuming videos have a 'categories' array field or 'category' string field
      // Adjust this based on your actual data structure
      q = query(
        videosRef,
        where('categories', 'array-contains', category),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
    } else {
      // If no category, just get the most recent videos
      q = query(
        videosRef,
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
    }
    
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

// Enhanced function to get thumbnails for videos
export const getThumbnailUrl = (videoHash, item) => {
  if (!videoHash) {
    // Return thumbnail based on news category or a default placeholder
    const defaultImages = {
      'climate': 'https://images.unsplash.com/photo-1578263053613-e5d528532238',
      'israel': 'https://images.unsplash.com/photo-1529335764835-380e9a5fb06b',
      'news': 'https://images.unsplash.com/photo-1495020689067-958852a7765e',
      'technology': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
      'default': 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167'
    };
    
    // Check if item exists and has a category/tag that we can use
    if (item && item.tag) {
      const lowerTag = item.tag.toLowerCase();
      if (lowerTag.includes('climate')) return defaultImages.climate;
      if (lowerTag.includes('israel')) return defaultImages.israel;
      if (lowerTag.includes('tech')) return defaultImages.technology;
    }
    
    // Otherwise return default news image
    return defaultImages.default;
  }
  
  // If we have a videoHash, use the actual video URL from IPFS as the thumbnail
  return getVideoUrl(videoHash);
};

// Function to save video to local storage
export const saveVideo = (video) => {
  try {
    // Get current saved videos
    const savedVideos = getSavedVideos();
    
    // Check if video is already saved
    if (!savedVideos.some(v => v.id === video.id)) {
      // Add video to saved videos
      savedVideos.push(video);
      
      // Save back to local storage
      localStorage.setItem('savedVideos', JSON.stringify(savedVideos));
      return true;
    }
    return false; // Video was already saved
  } catch (error) {
    console.error('Error saving video:', error);
    return false;
  }
};

// Function to remove video from saved videos
export const unsaveVideo = (videoId) => {
  try {
    // Get current saved videos
    const savedVideos = getSavedVideos();
    
    // Filter out the video to remove
    const updatedSavedVideos = savedVideos.filter(v => v.id !== videoId);
    
    // Save back to local storage
    localStorage.setItem('savedVideos', JSON.stringify(updatedSavedVideos));
    return true;
  } catch (error) {
    console.error('Error removing saved video:', error);
    return false;
  }
};

// Function to get all saved videos
export const getSavedVideos = () => {
  try {
    const savedVideos = localStorage.getItem('savedVideos');
    return savedVideos ? JSON.parse(savedVideos) : [];
  } catch (error) {
    console.error('Error getting saved videos:', error);
    return [];
  }
};

// Function to check if a video is saved
export const isVideoSaved = (videoId) => {
  try {
    const savedVideos = getSavedVideos();
    return savedVideos.some(v => v.id === videoId);
  } catch (error) {
    console.error('Error checking if video is saved:', error);
    return false;
  }
};

export { db };
export default app; 