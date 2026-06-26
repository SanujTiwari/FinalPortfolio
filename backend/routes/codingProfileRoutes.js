const express = require('express');
const router = express.Router();

// Simple in-memory cache (10 min TTL)
const cache = {};
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

function getCached(key) {
  const entry = cache[key];
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data;
  }
  return null;
}

function setCache(key, data) {
  cache[key] = { data, timestamp: Date.now() };
}

// ─── LEETCODE ───────────────────────────────────────────────
router.get('/leetcode/:username', async (req, res) => {
  const { username } = req.params;
  const cacheKey = `leetcode_${username}`;
  const noCache = req.query.nocache === 'true';

  if (!noCache) {
    const cached = getCached(cacheKey);
    if (cached) return res.json(cached);
  }

  try {
    // Use alfa-leetcode-api wrapper for reliable access
    const [solvedRes, profileRes] = await Promise.all([
      fetch(`https://alfa-leetcode-api.onrender.com/${username}/solved`, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
      }),
      fetch(`https://alfa-leetcode-api.onrender.com/${username}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
      }),
    ]);

    const solvedData = await solvedRes.json();
    const profileData = await profileRes.json();

    const result = {
      platform: 'leetcode',
      username: username,
      ranking: profileData.ranking || null,
      totalSolved: solvedData.solvedProblem || 0,
      easySolved: solvedData.easySolved || 0,
      mediumSolved: solvedData.mediumSolved || 0,
      hardSolved: solvedData.hardSolved || 0,
      totalEasy: solvedData.totalEasy || 869,
      totalMedium: solvedData.totalMedium || 1829,
      totalHard: solvedData.totalHard || 798,
      totalQuestions: solvedData.totalQuestions || (solvedData.totalEasy + solvedData.totalMedium + solvedData.totalHard) || 3496,
    };

    setCache(cacheKey, result);
    res.json(result);
  } catch (err) {
    console.error('LeetCode API error:', err.message);
    res.status(500).json({ error: 'Failed to fetch LeetCode data' });
  }
});

// ─── GEEKSFORGEEKS ──────────────────────────────────────────
router.get('/gfg/:username', async (req, res) => {
  const { username } = req.params;
  const cacheKey = `gfg_${username}`;

  const cached = getCached(cacheKey);
  if (cached) return res.json(cached);

  try {
    // Scrape the GFG profile page - data is embedded as JSON in script tags
    const response = await fetch(`https://www.geeksforgeeks.org/user/${username}/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      return res.status(404).json({ error: 'GFG user not found' });
    }

    const html = await response.text();

    // Extract data from embedded JSON (double-escaped in page source)
    const totalSolvedMatch = html.match(/total_problems_solved[\\\"':]+\s*(\d+)/);
    const scoreMatch = html.match(/[\\\"']score[\\\"':]+\s*(\d+)/);
    const instituteRankMatch = html.match(/institute_rank[\\\"':]+\s*(\d+)/);
    const streakMatch = html.match(/pod_solved_longest_streak[\\\"':]+\s*(\d+)/);

    const result = {
      platform: 'gfg',
      username: username,
      totalSolved: totalSolvedMatch ? parseInt(totalSolvedMatch[1]) : 0,
      score: scoreMatch ? parseInt(scoreMatch[1]) : 0,
      instituteRank: instituteRankMatch ? parseInt(instituteRankMatch[1]) : null,
      streak: streakMatch ? parseInt(streakMatch[1]) : 0,
    };

    setCache(cacheKey, result);
    res.json(result);
  } catch (err) {
    console.error('GFG API error:', err.message);
    res.status(500).json({ error: 'Failed to fetch GFG data' });
  }
});

// ─── CODECHEF ───────────────────────────────────────────────
router.get('/codechef/:username', async (req, res) => {
  const { username } = req.params;
  const cacheKey = `codechef_${username}`;

  const cached = getCached(cacheKey);
  if (cached) return res.json(cached);

  try {
    // CodeChef has an internal API for user data
    const response = await fetch(`https://www.codechef.com/users/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html',
      },
    });

    if (!response.ok) {
      return res.status(404).json({ error: 'CodeChef user not found' });
    }

    const html = await response.text();

    // Extract rating from the page
    const ratingMatch = html.match(/class="rating-number">(\d+)<\/span>/);
    const starsMatch = html.match(/class="rating-star[^"]*"[^>]*>/g);
    const solvedMatch = html.match(/Problems Solved<\/h3>\s*<span[^>]*>(\d+)/i) ||
                        html.match(/Fully Solved.*?<span[^>]*>(\d+)/is) ||
                        html.match(/Total Problems Solved:\s*(\d+)/i);

    const result = {
      platform: 'codechef',
      username: username,
      rating: ratingMatch ? parseInt(ratingMatch[1]) : null,
      stars: starsMatch ? starsMatch.length : null,
      totalSolved: solvedMatch ? parseInt(solvedMatch[1]) : null,
    };

    setCache(cacheKey, result);
    res.json(result);
  } catch (err) {
    console.error('CodeChef API error:', err.message);
    res.status(500).json({ error: 'Failed to fetch CodeChef data' });
  }
});

// ─── ALL PROFILES ───────────────────────────────────────────
router.get('/all', async (req, res) => {
  const usernames = {
    leetcode: 'sanujtiwari1',
    gfg: 'sanujva4bg',
    codechef: 'brisk_fame_71',
  };

  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const [leetcode, gfg, codechef] = await Promise.allSettled([
      fetch(`${baseUrl}/api/profiles/leetcode/${usernames.leetcode}`).then(r => r.json()),
      fetch(`${baseUrl}/api/profiles/gfg/${usernames.gfg}`).then(r => r.json()),
      fetch(`${baseUrl}/api/profiles/codechef/${usernames.codechef}`).then(r => r.json()),
    ]);

    res.json({
      leetcode: leetcode.status === 'fulfilled' ? leetcode.value : null,
      gfg: gfg.status === 'fulfilled' ? gfg.value : null,
      codechef: codechef.status === 'fulfilled' ? codechef.value : null,
    });
  } catch (err) {
    console.error('All profiles error:', err.message);
    res.status(500).json({ error: 'Failed to fetch profiles' });
  }
});

module.exports = router;
