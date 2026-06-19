import { writeFileSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';

const BASE_URL = 'http://localhost:3000';
const TEST_FILE_PATH = 'test-image.txt';

async function testUploadAndDelete() {
    console.log('Starting verification...');

    // 1. Create a dummy test file
    writeFileSync(TEST_FILE_PATH, 'dummy content');
    const fileParams = new FormData();
    // We need to read the file as a Blob/File. In Node env without 'file-from-path' helpers, 
    // we can mock it or use a simple fetch with formData if supported.
    // Node's built-in fetch might support Blob.
    const fileBlob = new Blob(['dummy content'], { type: 'text/plain' });
    fileParams.append('file', fileBlob, 'test-image.txt');

    try {
        // 2. Upload
        console.log('Testing UPLOAD...');
        const uploadRes = await fetch(`${BASE_URL}/api/upload`, {
            method: 'POST',
            body: fileParams,
        });

        if (!uploadRes.ok) {
            throw new Error(`Upload failed with status: ${uploadRes.status}`);
        }

        const uploadData = await uploadRes.json();
        console.log('Upload response:', uploadData);

        const uploadedUrl = uploadData.url;
        if (!uploadedUrl) {
            throw new Error('No URL returned from upload');
        }

        // 3. Delete
        console.log('Testing DELETE...');
        const deleteRes = await fetch(`${BASE_URL}/api/upload`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: uploadedUrl }),
        });

        if (!deleteRes.ok) {
            throw new Error(`Delete failed with status: ${deleteRes.status}`);
        }

        const deleteData = await deleteRes.json();
        console.log('Delete response:', deleteData);

        console.log('✅ Verification SUCCESS: File uploaded and deleted.');

    } catch (error) {
        console.error('❌ Verification FAILED:', error.message);
        if (error.cause) console.error('Cause:', error.cause);
        console.log('\nNOTE: Ensure the Next.js server is running on port 3000 (npm run dev).');
    } finally {
        // Cleanup local dummy file
        if (existsSync(TEST_FILE_PATH)) {
            unlinkSync(TEST_FILE_PATH);
        }
    }
}

testUploadAndDelete();
