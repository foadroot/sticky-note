# Planned Cloudinary asset storage

Cloudinary is planned for note images and other assets, but it is not configured or implemented for the MVP. No credentials, URLs, or placeholder configuration are committed here.

When configuration is supplied, the likely environment variables are `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`. The application should authorize an upload for the current user, upload directly or through a server endpoint, then persist metadata rather than binary data in PostgreSQL.

A future `Asset` model should reference its owner and optional note, provider, Cloudinary public ID, secure URL, resource type, dimensions, and timestamps. Deleting an asset should coordinate the database record and Cloudinary public ID; soft-deleting a note should not silently destroy its assets. Access control, signed upload presets, and signed delivery URLs should be selected once product requirements are known.
