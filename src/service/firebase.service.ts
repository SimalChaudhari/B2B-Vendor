// // firebase.service.ts
// import { Injectable } from '@nestjs/common';
// import * as admin from 'firebase-admin';
// import * as dotenv from 'dotenv';

// dotenv.config();

// @Injectable()
// export class FirebaseService {
//     constructor() {
//         const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string); // Load from environment variable
//         admin.initializeApp({
//             credential: admin.credential.cert(serviceAccount),
//             storageBucket: process.env.BUCKET_STORAGE, // Replace with your storage bucket name
//         });
//     }


//     async uploadFile(file: Express.Multer.File): Promise<string> {
//         const bucket = admin.storage().bucket();
//         const blob = bucket.file(file.originalname);
//         const blobStream = blob.createWriteStream({
//             resumable: false,
//             contentType: file.mimetype,
//         });

//         return new Promise((resolve, reject) => {
//             blobStream.on('error', (err) => reject(err));
//             blobStream.on('finish', () => {
//                 const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
//                 resolve(publicUrl);
//             });
//             blobStream.end(file.buffer);
//         });
//     }
// }
