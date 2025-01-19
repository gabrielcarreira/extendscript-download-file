/**
 * Utility for downloading files in Adobe environment
 * @class FileDownloader
 */
function FileDownloader() {
  // Default download folder
  this.defaultDownloadPath = "~/Downloads/es-file-downloader";
  this.downloadFolder = null;

  // Supported file extensions for validation (optional)
  this.supportedExtensions = {
    // Images
    jpg: true,
    jpeg: true,
    png: true,
    gif: true,
    bmp: true,
    tiff: true,
    webp: true,
    // Video
    mp4: true,
    mov: true,
    avi: true,
    wmv: true,
    flv: true,
    webm: true,
    // Audio
    mp3: true,
    wav: true,
    aac: true,
    ogg: true,
    // Documents
    pdf: true,
    doc: true,
    docx: true,
    xls: true,
    xlsx: true,
    txt: true,
    csv: true,
    // Adobe specific
    psd: true,
    ai: true,
    aep: true,
    prproj: true,
    aet: true,
  };
}

/**
 * Gets file extension from filename
 * @private
 */
FileDownloader.prototype._getExtension = function (fileName) {
  var ext = "";
  var foundDot = false;

  for (var i = fileName.length - 1; i >= 0; i--) {
    if (fileName[i] == ".") {
      foundDot = true;
      break;
    }
    ext = fileName[i] + ext;
  }

  if (foundDot) {
    var result = "";
    for (var j = 0; j < ext.length; j++) {
      var c = ext[j];
      if (c >= "A" && c <= "Z") {
        c = String.fromCharCode(c.charCodeAt(0) + 32);
      }
      result = result + c;
    }
    return result;
  }
  return "";
};

/**
 * Validates if the file extension is supported
 * @param {string} fileName - Name of the file to validate
 * @returns {boolean} True if extension is supported
 */
FileDownloader.prototype.isValidFileType = function (fileName) {
  if (!fileName) return false;

  var ext = this._getExtension(fileName);
  if (!ext) return false;

  return this.supportedExtensions[ext] === true;
};

/**
 * Sanitizes the file name to prevent security issues
 * @param {string} fileName - Original file name
 * @returns {string} Sanitized file name
 */
FileDownloader.prototype.sanitizeFileName = function (fileName) {
  var result = "";

  for (var i = 0; i < fileName.length; i++) {
    var c = fileName[i];
    var isValid = false;

    // Check numbers
    if (c >= "0" && c <= "9") {
      isValid = true;
    }
    // Check lowercase letters
    if (c >= "a" && c <= "z") {
      isValid = true;
    }
    // Check uppercase letters
    if (c >= "A" && c <= "Z") {
      isValid = true;
    }
    // Check special chars
    if (c == "-" || c == "_" || c == ".") {
      isValid = true;
    }

    if (isValid) {
      result = result + c;
    }
    if (!isValid) {
      result = result + "_";
    }
  }

  return result;
};

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
 * @param {Object} options - Additional options
 * @param {boolean} options.validateFileType - Whether to validate file type (default: true)
 * @param {boolean} options.sanitizeFileName - Whether to sanitize file name (default: true)
 * @returns {File} Downloaded file
 */
FileDownloader.prototype.downloadFile = function (url, fileName, options) {
  if (!url || !fileName) {
    throw new Error("URL and fileName are required");
  }

  // Default options
  options = options || {};
  options.validateFileType = options.validateFileType !== false;
  options.sanitizeFileName = options.sanitizeFileName !== false;

  // Validate file type if enabled
  if (options.validateFileType && !this.isValidFileType(fileName)) {
    throw new Error("Unsupported file type: " + fileName);
  }

  // Sanitize file name if enabled
  if (options.sanitizeFileName) {
    fileName = this.sanitizeFileName(fileName);
  }

  if (!this.downloadFolder) {
    this.initializeDownloadFolder();
  }

  // Get full system path
  var downloadPath = system
    .callSystem('cmd.exe /c "echo ' + this.downloadFolder.fsName + '"')
    .replace(/^\s+|\s+$/g, "");

  // Build curl command with additional options for better reliability
  var command =
    'curl -L -o "' +
    downloadPath +
    "\\" +
    fileName +
    '" "' +
    url +
    '"' +
    " --retry 3 --retry-delay 2 --connect-timeout 30";

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
