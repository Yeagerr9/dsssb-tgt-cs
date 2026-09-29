// Expose the syllabus dataset to the cloud-backed portal without changing the
// existing data.js source format.
try {
  window.DATA = {
    dsssbTech,
    dsssbPaper1,
    bpscSubject,
    bpscPrelims,
    bpscMainPaper1,
    bpscMainGS,
    maps,
    traps
  };
} catch (e) {
  console.error('Syllabus data bridge failed', e);
}
