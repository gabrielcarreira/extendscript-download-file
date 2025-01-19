// @include "download-file.jsx"

try {
  var downloader = new FileDownloader();

  // Example with default folder
  var file = downloader.downloadFile(
    "https://res.cloudinary.com/dvyhc5pp5/image/upload/v1727990308/note2.png",
    "example1.png"
  );

  if (file && file.exists) {
    alert("File downloaded successfully: " + file.path);
  }

  // Example with custom folder
  downloader.initializeDownloadFolder("~/Documents/custom-downloads");
  var file2 = downloader.downloadFile(
    "https://res.cloudinary.com/dvyhc5pp5/image/upload/v1727990308/note2.png",
    "example2.png"
  );

  if (file2 && file2.exists) {
    alert("Second file downloaded successfully: " + file2.path);
  }
} catch (e) {
  alert("Error: " + e.toString());
}
