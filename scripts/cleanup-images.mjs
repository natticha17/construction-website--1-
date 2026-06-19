import mongoose from 'mongoose';
import { readdir, unlink, stat } from 'fs/promises';
import { join } from 'path';

const MONGODB_URI = 'mongodb+srv://natticha:natticha01@cluster0.ngwnebl.mongodb.net/construction?appName=Cluster0';
const DOWNLOAD_DIR = join(process.cwd(), 'public/uploads');

// Ad-hoc Minimal Schemas to avoid TS compilation issues in a simple script
const HousePlanSchema = new mongoose.Schema({
    image: String,
    floorPlanImages: [String],
});

const ShowcaseProjectSchema = new mongoose.Schema({
    images: [String],
    subImages: [String],
});

const ProjectProgressSchema = new mongoose.Schema({
    milestones: [{
        images: [String],
        paymentSlip: String
    }]
});

async function getUsedImages() {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    // Bind models
    const HousePlan = mongoose.models.HousePlan || mongoose.model('HousePlan', HousePlanSchema);
    const ShowcaseProject = mongoose.models.ShowcaseProject || mongoose.model('ShowcaseProject', ShowcaseProjectSchema);
    const ProjectProgress = mongoose.models.ProjectProgress || mongoose.model('ProjectProgress', ProjectProgressSchema);

    const usedFiles = new Set();

    console.log('Fetching HousePlans...');
    const housePlans = await HousePlan.find({});
    housePlans.forEach(doc => {
        if (doc.image) extractFilename(doc.image, usedFiles);
        if (doc.floorPlanImages) doc.floorPlanImages.forEach(img => extractFilename(img, usedFiles));
    });

    console.log('Fetching ShowcaseProjects...');
    const showcases = await ShowcaseProject.find({});
    showcases.forEach(doc => {
        if (doc.images) doc.images.forEach(img => extractFilename(img, usedFiles));
        if (doc.subImages) doc.subImages.forEach(img => extractFilename(img, usedFiles));
    });

    console.log('Fetching ProjectProgress...');
    const progress = await ProjectProgress.find({});
    progress.forEach(doc => {
        if (doc.milestones) {
            doc.milestones.forEach(m => {
                if (m.images) m.images.forEach(img => extractFilename(img, usedFiles));
                if (m.paymentSlip) extractFilename(m.paymentSlip, usedFiles);
            });
        }
    });

    await mongoose.disconnect();
    return usedFiles;
}

function extractFilename(url, set) {
    if (!url) return;
    // Assumes url is like "/uploads/filename.jpg" or "http.../uploads/filename.jpg"
    // We only care about files in existing public/uploads, so we look for matching names.
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    if (filename) set.add(filename);
}

async function cleanup() {
    try {
        const usedFiles = await getUsedImages();
        console.log(`Found ${usedFiles.size} unique used images in database.`);

        const filesInDir = await readdir(DOWNLOAD_DIR);
        console.log(`Found ${filesInDir.length} files in ${DOWNLOAD_DIR}`);

        let deletedCount = 0;
        for (const file of filesInDir) {
            // Skip system files or hidden files if necessary, usually safe to check if it's in the set
            if (file.startsWith('.')) continue;

            if (!usedFiles.has(file)) {
                const filePath = join(DOWNLOAD_DIR, file);
                // Check if it's a file (not dir) before deleting
                const s = await stat(filePath);
                if (s.isFile()) {
                    await unlink(filePath);
                    console.log(`Deleted unused file: ${file}`);
                    deletedCount++;
                }
            }
        }

        console.log(`Cleanup complete. Deleted ${deletedCount} unused files.`);

    } catch (error) {
        console.error('Error during cleanup:', error);
    }
}

cleanup();
