// @include "download-file.jsx"

try {
  var downloader = new FileDownloader();

  // Example 1: Basic image download
  var imageFile = downloader.downloadFile(
    "https://example.com/image.jpg",
    "example1.jpg"
  );

  if (imageFile && imageFile.exists) {
    alert("Image downloaded successfully: " + imageFile.path);
  }

  // Example 2: Download with custom folder
  downloader.initializeDownloadFolder("~/Documents/custom-downloads");
  
  var pdfFile = downloader.downloadFile(
    "https://example.com/document.pdf",
    "example2.pdf"
  );

  if (pdfFile && pdfFile.exists) {
    alert("PDF downloaded successfully: " + pdfFile.path);
  }

  // Example 3: Download without file type validation
  var customFile = downloader.downloadFile(
    "https://example.com/custom.xyz",
    "custom_file.xyz",
    { validateFileType: false }
  );

  if (customFile && customFile.exists) {
    alert("Custom file downloaded successfully: " + customFile.path);
  }

  // Example 4: Download with file name sanitization
  var fileWithSpaces = downloader.downloadFile(
    "https://example.com/filewithspaces.txt",
    "file with spaces.txt",
    { sanitizeFileName: true }
  );

  if (fileWithSpaces && fileWithSpaces.exists) {
    alert("Sanitized file downloaded successfully: " + fileWithSpaces.path);
  }
} catch (e) {
  alert("Error: " + e.toString());
}
