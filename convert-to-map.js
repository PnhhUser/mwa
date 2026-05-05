const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.join(__dirname, 'src/assets/data_old');
const OUTPUT_DIR = path.join(__dirname, 'src/assets/data');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function runConvertEven() {
  console.log('⏳ Bắt đầu gộp dữ liệu thô và loại bỏ mỡ thừa...');
  const files = fs.readdirSync(SOURCE_DIR).filter((f) => f.endsWith('.json'));

  const flatDictionary = {};

  files.forEach((file) => {
    const rawData = fs.readFileSync(path.join(SOURCE_DIR, file), 'utf8');
    const records = JSON.parse(rawData);

    records.forEach((item) => {
      const reading = item.reading;
      const kanji = item.expression;

      if (!reading) return;

      if (!flatDictionary[reading]) {
        flatDictionary[reading] = [];
      }
      if (!flatDictionary[reading].includes(kanji)) {
        flatDictionary[reading].push(kanji);
      }
    });
  });

  const allEntries = Object.entries(flatDictionary);
  const totalEntries = allEntries.length;

  const CHUNK_SIZE = 15000;
  const totalFiles = Math.ceil(totalEntries / CHUNK_SIZE);

  console.log(`📦 Tổng số từ sau khi dọn sạch: ${totalEntries} từ.`);
  console.log(
    `🗂️ Tiến hành chia đều thành ${totalFiles} file JSON (Mỗi file ~${CHUNK_SIZE} từ)...`,
  );

  for (let i = 0; i < totalFiles; i++) {
    const startIdx = i * CHUNK_SIZE;
    const endIdx = startIdx + CHUNK_SIZE;

    const chunkEntries = allEntries.slice(startIdx, endIdx);

    const chunkMap = Object.fromEntries(chunkEntries);

    fs.writeFileSync(
      path.join(OUTPUT_DIR, `dict_chunk_${i}.json`),
      JSON.stringify(chunkMap),
      'utf8',
    );

    console.log(`✓ Xuất file thành công: dict_chunk_${i}.json (${chunkEntries.length} từ)`);
  }

  const configContent = { totalChunks: totalFiles };
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'dict_config.json'),
    JSON.stringify(configContent),
    'utf8',
  );

  console.log('🎉 XONG! Các file .json đã được chia đều tăm tắp, an toàn tuyệt đối cho bộ build.');
}

runConvertEven();
