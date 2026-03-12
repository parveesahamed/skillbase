/**
 * routes/resume.js
 * POST /api/resume/upload
 *   - Accepts a PDF file upload (field name: "resume")
 *   - Extracts text via pdf-parse
 *   - Identifies skills via skillExtractor.js
 *   - Returns { extractedSkills: string[] } — does NOT auto-save to profile,
 *     so the student can review before confirming.
 */
const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const auth = require('../middleware/auth');
const { extractSkills } = require('../utils/skillExtractor');

// ── Multer configuration ──────────────────────────────────────────────────────
// Store file in memory (no disk I/O) — we only need the buffer for pdf-parse.
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are accepted.'), false);
    }
  },
});

// ── POST /api/resume/upload ───────────────────────────────────────────────────
router.post('/upload', auth, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded. Please attach a PDF.' });
    }

    // Extract raw text from the PDF buffer
    const pdfData = await pdfParse(req.file.buffer);
    const rawText = pdfData.text;

    if (!rawText || rawText.trim().length === 0) {
      return res.status(422).json({ msg: 'Could not extract text from the uploaded PDF. Please try a different file.' });
    }

    // Match against skill taxonomy
    const extractedSkills = extractSkills(rawText);

    if (extractedSkills.length === 0) {
      return res.status(200).json({
        extractedSkills: [],
        message: 'No recognisable skills were found in your resume. You can add skills manually from your profile.',
      });
    }

    return res.status(200).json({
      extractedSkills,
      message: `${extractedSkills.length} skill${extractedSkills.length > 1 ? 's' : ''} detected from your resume.`,
    });
  } catch (err) {
    // Surface multer file-filter errors (e.g. wrong MIME type) as 400
    if (err.message === 'Only PDF files are accepted.') {
      return res.status(400).json({ msg: err.message });
    }
    // Multer size-limit error
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ msg: 'File is too large. Maximum allowed size is 5 MB.' });
    }
    console.error('Resume upload error:', err.message);
    res.status(500).json({ msg: 'Server error during resume processing.' });
  }
});

module.exports = router;
