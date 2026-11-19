// Generate realistic sample datasets for testing the AI Agent Data Pipeline
const fs = require('fs');
const path = require('path');

const regions = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', 'Bình Dương'];
const categories = ['Giải pháp AI & Cloud', 'Phần mềm ERP/CRM', 'Thiết bị IoT Doanh nghiệp', 'Dịch vụ Tư vấn Chuyển đổi số', 'Bảo mật & An ninh mạng'];
const segments = ['Doanh nghiệp Lớn (Enterprise)', 'Doanh nghiệp SME', 'Khách hàng B2B', 'Khối Chính phủ & Giáo dục'];
const salesReps = ['Nguyễn Văn An', 'Trần Thị Mai', 'Lê Hoàng Nam', 'Phạm Quỳnh Nga', 'Đỗ Quốc Bảo'];

const rows = [];
const startDate = new Date(2024, 0, 1);

// Generate 120 days of time-series sales
for (let i = 0; i < 120; i++) {
  const curDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
  
  // Mixed date formatting to test standardization
  let dateStr;
  if (i % 4 === 0) {
    const d = String(curDate.getDate()).padStart(2, '0');
    const m = String(curDate.getMonth() + 1).padStart(2, '0');
    const y = curDate.getFullYear();
    dateStr = `${d}/${m}/${y}`; // DD/MM/YYYY
  } else if (i % 4 === 1) {
    const d = String(curDate.getDate()).padStart(2, '0');
    const m = String(curDate.getMonth() + 1).padStart(2, '0');
    const y = curDate.getFullYear();
    dateStr = `${m}-${d}-${y}`; // MM-DD-YYYY
  } else {
    dateStr = curDate.toISOString().split('T')[0]; // YYYY-MM-DD
  }

  const orderId = `ORD-2024-${String(1000 + i).padStart(5, '0')}`;
  const region = regions[Math.floor(Math.random() * regions.length)];
  let category = categories[Math.floor(Math.random() * categories.length)];
  let segment = segments[Math.floor(Math.random() * segments.length)];
  const rep = salesReps[Math.floor(Math.random() * salesReps.length)];

  // Add random spaces to test string trimming
  if (i % 7 === 0) segment = `  ${segment}  `;
  if (i % 9 === 0) category = `${category} `;

  // Seasonal upward trend in quantity and revenue
  const baseQty = Math.floor(5 + (i * 0.25) + (Math.sin(i / 10) * 8) + (Math.random() * 10));
  let quantity = Math.max(1, baseQty);
  
  let unitPriceVal = 2500000 + Math.floor(Math.random() * 5000000);
  
  // Test currency formatting with symbols
  let unitPriceStr = `${unitPriceVal}`;
  if (i % 5 === 0) unitPriceStr = `${unitPriceVal.toLocaleString('vi-VN')} VND`;
  else if (i % 5 === 1) unitPriceStr = `$${(unitPriceVal / 25000).toFixed(0)}`;
  else if (i % 5 === 2) unitPriceStr = `${unitPriceVal.toLocaleString('en-US')}`;

  let revenue = quantity * unitPriceVal;
  let profitMargin = 0.22 + (Math.random() * 0.15);
  let profit = Math.round(revenue * profitMargin);
  let satisfaction = (3.8 + Math.random() * 1.2).toFixed(1);

  // Intentional Missing Values (null, empty, NA)
  let qtyField = String(quantity);
  let satField = String(satisfaction);
  let profitField = String(profit);

  if (i === 12 || i === 45 || i === 88) {
    qtyField = ''; // empty string missing value
  }
  if (i === 23 || i === 71) {
    satField = 'N/A'; // N/A text missing value
  }
  if (i === 34 || i === 99) {
    profitField = 'NULL'; // NULL text missing value
  }

  // Intentional Outliers
  if (i === 55) {
    // Extreme high revenue anomaly
    revenue = 985000000;
  }
  if (i === 77) {
    // Extreme outlier
    revenue = 890000000;
  }

  rows.push({
    orderId,
    dateStr,
    segment,
    region,
    category,
    rep,
    unitPriceStr,
    qtyField,
    revenue,
    profitField,
    satField
  });
}

// Add 4 intentional duplicate rows
rows.push({ ...rows[10] });
rows.push({ ...rows[10] });
rows.push({ ...rows[25] });
rows.push({ ...rows[60] });

// Generate CSV Header & Body
const csvHeader = [
  'Mã Đơn Hàng',
  'Ngày Giao Dịch',
  'Phân Khúc Khách Hàng',
  'Khu Vực Thị Trường',
  'Nhóm Sản Phẩm / Dịch Vụ',
  'Chuyên Viên Phụ Trách',
  'Đơn Giá (VND)',
  'Số Lượng Bán',
  'Doanh Thu Thực Tế (VND)',
  'Lợi Nhuận Gộp (VND)',
  'Điểm Đánh Giá CSAT'
];

let csvContent = '\uFEFF' + csvHeader.join(',') + '\n';

rows.forEach(r => {
  const line = [
    `"${r.orderId}"`,
    `"${r.dateStr}"`,
    `"${r.segment}"`,
    `"${r.region}"`,
    `"${r.category}"`,
    `"${r.rep}"`,
    `"${r.unitPriceStr}"`,
    `"${r.qtyField}"`,
    r.revenue,
    `"${r.profitField}"`,
    `"${r.satField}"`
  ].join(',');
  csvContent += line + '\n';
});

const csvPath = path.join(__dirname, 'sample_sales_data.csv');
fs.writeFileSync(csvPath, csvContent, 'utf8');
console.log(`✅ Đã tạo tệp dữ liệu mẫu: ${csvPath} (${rows.length} dòng dữ liệu)`);
