import { collection, getDocs, addDoc, query, limit } from 'firebase/firestore';
import { db } from './firebase';

const CATEGORIES = [
  { title: 'Faith & Spiritual Growth', slug: 'faith-and-growth', description: 'Discuss Bible studies, personal testimonies, and spiritual questions.', order: 1 },
  { title: 'Pathfinder Club', slug: 'pathfinder-club', description: 'Everything about honors, drills, camporees, and Pathfinder activities.', order: 2 },
  { title: 'Youth Activities', slug: 'youth-activities', description: 'Social events, sports, community service, and youth society news.', order: 3 },
  { title: 'Health & Wellness', slug: 'health-wellness', description: 'Adventist health message, lifestyle tips, and mental health support.', order: 4 },
  { title: 'General Lounge', slug: 'general-lounge', description: 'A place for general chat and getting to know each other.', order: 5 }
];

export async function seedForumCategories() {
  const q = query(collection(db, 'forumCategories'), limit(1));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    console.log("Seeding forum categories...");
    for (const cat of CATEGORIES) {
      await addDoc(collection(db, 'forumCategories'), cat);
    }
  }
}
