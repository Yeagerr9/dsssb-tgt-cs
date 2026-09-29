// Expose the existing syllabus database to the cloud-backed portal.
// data.js defines the DATA object used by the original portal.
try {
  window.DATA = DATA;
} catch (e) {
  console.error('Syllabus data bridge failed: DATA was not found.', e);
}
