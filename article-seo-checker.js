<script>

function countWords(content) {

  return content.trim().split(/\s+/).length;

}

function countKeywordOccurrences(content, keyword) {

  var regex = new RegExp("\\b" + keyword + "\\b", "gi");

  var match = content.match(regex);

  return match ? match.length : 0;

}

function analyzeKeywordInFirst100(content, keyword) {

  var first = content.split(" ").slice(0, 100).join(" ");

  return countKeywordOccurrences(first, keyword);

}

function executeSEOCheck() {

  var content = articleInput.value;

  var title = titleInput.value.trim();

  var keyword = keywordInput.value.trim().toLowerCase();

  var meta = metaDescriptionInput.value.trim();

  if (!content || !title || !keyword || !meta) {

    alert("Mohon isi semua field sebelum menekan tombol Eksekusi.");

    return;

  }

  var wordCount = countWords(content);

  var keyCount = countKeywordOccurrences(content, keyword);

  var density = ((keyCount / wordCount) * 100).toFixed(2);

  wordCountEl.textContent = wordCount;

  keywordCountEl.textContent = keyCount;

  keywordPercentageEl.textContent = density + "%";

  wordCountMessage.textContent = getWordCountMessage(wordCount);

  var in100 = analyzeKeywordInFirst100(content, keyword);

  keywordInFirst100Result.textContent = in100 > 0 ? `Ada (${in100})` : "Tidak ada";

  keywordInTitleAndMeta.textContent =

    title.toLowerCase().includes(keyword) && meta.toLowerCase().includes(keyword)

      ? "Ya"

      : "Tidak";

  suggestionsContainer.innerHTML = generateSuggestions(in100);

  if (density > 5) keywordPercentageEl.textContent += " Terlalu tinggi";

  else keywordPercentageEl.textContent += " Bagus";

  resultContainer.style.display = "block";

}

function getWordCountMessage(n) {

  if (n < 700) return "Artikel terlalu pendek.";

  if (n < 1400) return "Baik, sudah cukup panjang.";

  return "Excellent! Sangat SEO friendly.";

}

function generateSuggestions(firstHit) {

  let txt = "<h3>Saran SEO:</h3><ul>";

  txt += "<li>Gunakan internal link ke artikel terkait</li>";

  txt += "<li>Optimalkan penggunaan H2 dan H3</li>";

  txt += "<li>Gunakan gambar dengan ALT berisi keyword</li>";

  txt += "<li>Perpendek paragraf panjang</li>";

  if (firstHit === 0)

    txt += "<li><b>Tambahkan keyword di 100 kata pertama</b></li>";

  txt += "</ul>";

  return txt;

}

function countMetaDescriptionCharacters() {

  var max = 150;

  var remain = max - metaDescriptionInput.value.length;

  characterCount.textContent = "Sisa karakter: " + remain;

  characterCount.style.color = remain < 0 ? "red" : "black";

}

metaDescriptionInput.addEventListener("input", countMetaDescriptionCharacters);

countMetaDescriptionCharacters();

const wordCountEl = document.getElementById("wordCount");

const keywordCountEl = document.getElementById("keywordCount");

const keywordPercentageEl = document.getElementById("keywordPercentage");

const keywordInFirst100Result = document.getElementById("keywordInFirst100Result");

const keywordInTitleAndMeta = document.getElementById("keywordInTitleAndMeta");

const wordCountMessage = document.getElementById("wordCountMessage");

</script>
