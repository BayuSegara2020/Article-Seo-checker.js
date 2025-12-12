// article-seo-checker.js
(function () {
  "use strict";

  // helper: escape string untuk regex
  function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function countWords(content) {
    if (!content) return 0;
    // hapus multiple whitespace & newline then split
    return content.trim().replace(/\s+/g, " ").split(" ").filter(Boolean).length;
  }

  function countKeywordOccurrences(content, keyword) {
    if (!keyword) return 0;
    var re = new RegExp("\\b" + escapeRegex(keyword) + "\\b", "gi");
    var m = content.match(re);
    return m ? m.length : 0;
  }

  function analyzeKeywordInFirst100(content, keyword) {
    if (!content) return 0;
    var words = content.trim().replace(/\s+/g, " ").split(" ").filter(Boolean);
    var first = words.slice(0, 100).join(" ");
    return countKeywordOccurrences(first, keyword);
  }

  function getWordCountMessage(n) {
    if (n < 700) return "Artikel terlalu pendek.";
    if (n < 1400) return "Baik, sudah cukup panjang.";
    return "Excellent! Sangat SEO friendly.";
  }

  function generateSuggestions(firstHit) {
    var txt = "<h3>Saran SEO:</h3><ul>";
    txt += "<li>Gunakan internal link ke artikel terkait</li>";
    txt += "<li>Optimalkan penggunaan H2 dan H3</li>";
    txt += "<li>Gunakan gambar dengan ALT berisi keyword</li>";
    txt += "<li>Perpendek paragraf panjang</li>";
    if (firstHit === 0) txt += "<li><b>Tambahkan keyword di 100 kata pertama</b></li>";
    txt += "</ul>";
    return txt;
  }

  // main function (exposed)
  function executeSEOCheck() {
    var articleInput = document.getElementById("articleInput");
    var titleInput = document.getElementById("titleInput");
    var keywordInput = document.getElementById("keywordInput");
    var metaDescriptionInput = document.getElementById("metaDescriptionInput");

    // output elements
    var wordCountEl = document.getElementById("wordCount");
    var keywordCountEl = document.getElementById("keywordCount");
    var keywordPercentageEl = document.getElementById("keywordPercentage");
    var keywordInFirst100Result = document.getElementById("keywordInFirst100Result");
    var keywordInTitleAndMeta = document.getElementById("keywordInTitleAndMeta");
    var wordCountMessage = document.getElementById("wordCountMessage");
    var suggestionsContainer = document.getElementById("suggestionsContainer");
    var resultContainer = document.getElementById("resultContainer");

    if (!articleInput || !titleInput || !keywordInput || !metaDescriptionInput) {
      alert("Element form tidak ditemukan. Pastikan HTML hanya memiliki satu SEO Checker dan id sesuai.");
      return;
    }

    var content = articleInput.value || "";
    var title = (titleInput.value || "").trim();
    var keyword = (keywordInput.value || "").trim().toLowerCase();
    var meta = (metaDescriptionInput.value || "").trim();

    if (!content || !title || !keyword || !meta) {
      alert("Mohon isi semua field sebelum menekan tombol Eksekusi.");
      return;
    }

    var wordCount = countWords(content);
    var keyCount = countKeywordOccurrences(content, keyword);
    var density = wordCount === 0 ? 0 : ((keyCount / wordCount) * 100);
    var densityStr = density.toFixed(2) + "%";

    if (density > 5) densityStr += " Terlalu tinggi";
    else densityStr += " Bagus";

    // write results (safely check elements exist)
    if (wordCountEl) wordCountEl.textContent = wordCount;
    if (keywordCountEl) keywordCountEl.textContent = keyCount;
    if (keywordPercentageEl) keywordPercentageEl.textContent = densityStr;
    if (wordCountMessage) wordCountMessage.textContent = getWordCountMessage(wordCount);

    var in100 = analyzeKeywordInFirst100(content, keyword);
    if (keywordInFirst100Result) keywordInFirst100Result.textContent = in100 > 0 ? "Ada (" + in100 + ")" : "Tidak ada";

    if (keywordInTitleAndMeta)
      keywordInTitleAndMeta.textContent = title.toLowerCase().includes(keyword) || meta.toLowerCase().includes(keyword) ? "Ya" : "Tidak";

    if (suggestionsContainer) suggestionsContainer.innerHTML = generateSuggestions(in100);
    if (resultContainer) resultContainer.style.display = "block";
  }

  // meta char counter
  function bindMetaCounter() {
    var metaEl = document.getElementById("metaDescriptionInput");
    var charCountEl = document.getElementById("characterCount");
    if (!metaEl || !charCountEl) return;
    function update() {
      var max = 150;
      var remain = max - metaEl.value.length;
      charCountEl.textContent = "Sisa karakter: " + remain;
      charCountEl.style.color = remain < 0 ? "red" : "black";
    }
    metaEl.addEventListener("input", update);
    update();
  }

  // safe init after DOM ready
  document.addEventListener("DOMContentLoaded", function () {
    // bind button if exists (preferred)
    var btn = document.querySelector(".seoBtn");
    if (btn) {
      // remove inline onclick to avoid double-bind (if present)
      btn.removeAttribute("onclick");
      btn.addEventListener("click", executeSEOCheck);
    }
    // expose for backwards compatibility
    window.executeSEOCheck = executeSEOCheck;

    bindMetaCounter();
  });

  // also expose helper to check if script loaded
  window.ArticleSeoChecker = {
    version: "1.0",
    execute: executeSEOCheck
  };
})();
      
