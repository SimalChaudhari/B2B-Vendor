// src/firebase/firebase.config.ts

import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

// Define your service account credentials
const serviceAccount: Omit<ServiceAccount, 'type'> = {
  projectId: "b2b-vendor-76300", // Correct property name
  privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCK0sBD1buwDtMB\n8yJ0VV0SJIAr6hQdN2KcvrHLWEZ2/yMsjBXMtIa3am71szmyWXWIM/iw4xD9YOJu\nr0ICnpTn178H9EGh3s94l5WU76ibvO3Z7FBKQXfQQuvpg9Bu4m56UMXzhMKZSG7z\nWx+RbNkWmgvSQ0qsG8vh2M3pjx3NyOYdBLnh0EhKrPTvbRrJwHZAQ+oZTbdxnfQD\ntWbrPC8L5iEhoa/u67QxTdbeyVldaRXWD7x3oKA7eJRpHmmnLT3laoOPpGAh7vaX\niTZwLOwm7y87N0ezkF3fzAcuPjMIkkwAXTDoA4tRIgw6vmYhp9IPLtH71+YGhwT0\nPppNQklBAgMBAAECggEAK8i4tyxsG+UxDAZhMYvS5Ov6ON+FJInZYlKKxPW8k794\nmo48OeoeKy84e+nhIq0wcprhrviO3Tt3by17hlP55v2W1K1nHeSmTwSQOv8zkJsP\n8ZGk6Sao4ViaC3Z1gOONsKpVJK8UqT+9Lqfo1vcbqRNA8zoiDRJfRYYZu7ZV0hc5\n8HcfEMuZ3zro36vXrp6M9XZR1Fxrm8OziH+SB5QWTb2udGClGCyEeORZgDYti184\n/5aZghEg1Ys41hM/gXBNefuhkRoKY19tvpcVJK3E0l2KTcz0g9FFW/55iUWi5qcz\nJZJH3BSPStssLHRrlbi9A1ipeLf9TYWiqQBRnUCT+QKBgQDDCGEjAvZZAqlUGZGz\nTVjxD4PwnDvYthuWLI+u5tPYva3mWSKMHFZwHxi/fVMnUvtwEFLAVzDryXX7C7xs\nLgFOINMUooBbmRGSebZu6LSQfb59aUj27J9hL4Qz5ux6u7uJsOr7GgBpSd+a34bC\nM8vkqXARrV1l0lF5/CL36R7vLwKBgQC2OCvOdLPnd+j5aAq5LB8MQx0R2p+uCC56\nhZcV4c1Z+UIPm6Yif+erGQJOvDLsMcD+o0mw14FH0dhpJVn+mrAmCTD27i+XeozG\nZ4d7NxRd8CcATNmN4Cj6WDMl4+05nyx9vKPn/0AM9MZ0iBGeGzvtcii1PfBOvnCk\nbNAgjRSyjwKBgFK7xkEM66XcrCoB4r3WDOnNtCGolPacYd11r8n5H1rtM8zoePBI\nwR41AtGQf2rKF+F0+zWehyEux/6j/t1BMsqKwCAbwymYKE0jlpE75AT7Yohe1lXx\nELcwaft+dUinRKnnQ/cbE5uWe+V99vOA93hbrC/DhEBCVM/Tdp4F5Vp/AoGBAIGA\nCiH/7ptiLMCToItZP/eG+vHlXfZg+ic5KdbzUu3Op5RQGhIKtKp0a59pQQd7lJ1j\njsuPXOGd0R9o3DyF0wo1Hgdf35LYFZQrn62Bx4e7VPxxoWujE3xXkoIrKjz5UrVJ\ni3MlhG+wxhmrWlnzIPPvXd7w1gggcA1rB78ahMshAoGAR4nVcihEk02hpOhpaXFX\neT5prqtiRF9zYQWaXFXdi8UcykV1IF9mSa2szQip8rfwUvB1NYjk8Gg2K0JuFA0r\nP37WxaxItHoZakt7V7GMbeK7rh7uyKUZz9RW4E9wI9HaspL7Eksni8wMFIk0eA4e\ntmGDcKcuONqSWfAQ9ueJ2L4=\n-----END PRIVATE KEY-----\n",
  clientEmail: "firebase-adminsdk-xqew3@b2b-vendor-76300.iam.gserviceaccount.com", // Correct property name
 };

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount), // Pass the service account
  storageBucket: 'b2b-vendor-76300.appspot.com', // Adjust to your Firebase storage bucket
});

// Export the storage bucket
export const bucket = admin.storage().bucket();
