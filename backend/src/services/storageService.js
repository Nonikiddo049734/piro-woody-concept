/**
 * Cloud & Local Image Storage Architecture
 * Structure prepared so Cloudinary, AWS S3, or Supabase Storage can be plugged in seamlessly.
 */
class StorageService {
  constructor() {
    this.provider = process.env.STORAGE_PROVIDER || 'local';
    this.cloudinaryConfigured = Boolean(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    );
  }

  /**
   * Resolves public image URL (local relative path or remote cloud URL).
   */
  resolveImageUrl(pathOrUrl) {
    if (!pathOrUrl) return null;
    if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
      return pathOrUrl;
    }
    // Return standard frontend asset path
    return pathOrUrl;
  }

  /**
   * Future cloud upload handler.
   */
  async uploadImage(fileBuffer, fileName, folder = 'piro-woody') {
    if (this.cloudinaryConfigured) {
      console.log(`[StorageService] Uploading ${fileName} to Cloudinary folder ${folder}`);
      // Cloudinary SDK execution here
      return { url: `https://res.cloudinary.com/demo/image/upload/${folder}/${fileName}` };
    }

    // Default development fallback
    console.log(`[StorageService: Local] Image staged for local asset storage: ${fileName}`);
    return { url: `assets/images/${fileName}` };
  }
}

module.exports = new StorageService();
