/**
 * Utility for downloading files in Adobe environment
 * @class FileDownloader
 */
function FileDownloader() {
  // Default download folder
  this.defaultDownloadPath = "~/Downloads/es-download-file";
  this.downloadFolder = null;
}

/**
 * Initializes the download folder
 * @param {string} customPath - Custom path for downloads (optional)
 * @returns {Folder} The download folder
 * @throws {Error} If unable to create folder
 */
FileDownloader.prototype.initializeDownloadFolder = function (customPath) {
  var folderPath = customPath || this.defaultDownloadPath;
  var folder = new Folder(folderPath);

  if (!folder.exists) {
    var created = folder.create();
    if (!created) {
      throw new Error("Unable to create folder: " + folderPath);
    }
  }

  if (!folder.exists) {
    throw new Error(
      "Folder doesn't exist and couldn't be created: " + folderPath
    );
  }

  this.downloadFolder = folder;
  return folder;
};

/**
 * Downloads a file
 * @param {string} url - URL of the file to download
 * @param {string} fileName - File name
 * @returns {File} Downloaded file
 */
FileDownloader.prototype.downloadFile = function (url, fileName) {
  if (!url || !fileName) {
    throw new Error("URL and fileName are required");
  }

  if (!this.downloadFolder) {
    this.initializeDownloadFolder();
  }

  // Get full system path
  var downloadPath = system
    .callSystem('cmd.exe /c "echo ' + this.downloadFolder.fsName + '"')
    .replace(/^\s+|\s+$/g, "");

  // Build curl command
  var command =
    'curl -o "' + downloadPath + "\\" + fileName + '" "' + url + '"';

  try {
    system.callSystem(command);
    var downloadedFile = new File(downloadPath + "/" + fileName);

    if (!downloadedFile.exists) {
      throw new Error("File was not downloaded correctly");
    }

    return downloadedFile;
  } catch (e) {
    alert("Error downloading file: " + e.toString());
    return null;
  }
};
