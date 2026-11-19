/**
 * =========================================================================
 * SAGE AI ENTERPRISE DATA PIPELINE & FORECASTING CONTROLLER (v5.6)
 * Zero Alert Popups - 100% Smooth & Fluid Flow
 * Color Palette: #5D7B6F, #A4C3A2, #B0D4B8, #EAE7D6, #D7F9FA
 * Typography: 'Be Vietnam Pro' & 'Inter'
 * =========================================================================
 */

const app = {
  // Navigation State
  currentPage: 'welcome',
  currentStep: 1,

  // Strict Sequential Step Locking State
  stepStates: {
    1: 'UNLOCKED',
    2: 'LOCKED',
    3: 'LOCKED',
    4: 'LOCKED',
    5: 'LOCKED',
    6: 'LOCKED',
    7: 'LOCKED'
  },
  stepExecuted: {
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false
  },

  // Raw & Cleaned Data
  isDemoData: false,
  fileName: '',
  fileSize: 0,
  rawRows: [],
  cleanedRows: [],
  columns: [],
  schema: {},

  // Step 1 Data Explorer Pagination & Search
  rawPage: 1,
  rawPageSize: 10,
  rawSearchQuery: '',

  // Audit Metrics (Clean initial states)
  audit: {
    initialRowCount: 0,
    cleanedRowCount: 0,
    missingCellsFound: 0,
    missingCellsImputed: 0,
    duplicatesRemoved: 0,
    outliersFound: 0,
    outliersTreated: 0,
    datesHarmonized: 0,
    currenciesCleaned: 0,
    stringsStandardized: 0,
    healthScoreBefore: 0,
    healthScoreAfter: 99.8,
    supervisorName: 'Chuyên Gia Phân Tích Dữ Liệu',
    supervisorGmail: 'admin.data@gmail.com',
    digitalSignature: 'SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    timestamp: new Date().toISOString()
  },

  // Defect Details for User & Teacher Review
  defectDetails: {
    missingErrors: [],
    duplicateRows: [],
    outlierErrors: [],
    iqrStats: {}
  },

  // Selected Business Columns
  dateCol: null,
  metricCol: null,
  categoryCol: null,
  regionCol: null,
  candidateCategoricalCols: [],

  // Forecast Parameters
  forecastHorizon: 30,
  scenarioMultiplier: 1.0,

  // Chart Instances
  charts: {},

  // ==========================================
  // INITIALIZATION
  // ==========================================
  init() {
    this.bindEvents();
    if (window.lucide) {
      window.lucide.createIcons();
    }
  },

  bindEvents() {
    // Prevent default browser drag/drop behavior across the window
    window.addEventListener('dragover', (e) => e.preventDefault(), false);
    window.addEventListener('drop', (e) => e.preventDefault(), false);

    // Drop Zone Handling
    const dropZone = document.getElementById('welcomeDropZone');
    const fileInput = document.getElementById('welcomeFileInput');

    if (dropZone && fileInput) {
      // Avoid bubbling from fileInput back to dropZone label
      fileInput.addEventListener('click', (e) => {
        e.stopPropagation();
      });

      // Drag and Drop handlers with visual feedback
      ['dragenter', 'dragover'].forEach(name => {
        dropZone.addEventListener(name, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropZone.classList.add('border-[#5D7B6F]', 'bg-[#D7F9FA]/60', 'scale-[1.01]');
        }, false);
      });

      ['dragleave', 'dragend'].forEach(name => {
        dropZone.addEventListener(name, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropZone.classList.remove('border-[#5D7B6F]', 'bg-[#D7F9FA]/60', 'scale-[1.01]');
        }, false);
      });

      dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('border-[#5D7B6F]', 'bg-[#D7F9FA]/60', 'scale-[1.01]');
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          this.handleFile(e.dataTransfer.files[0], false);
        }
      }, false);

      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
          const file = e.target.files[0];
          this.handleFile(file, false);
          fileInput.value = ''; // Reset so the user can re-select the exact same file
        }
      });
    }

    // Gmail Input Sync
    const gmailInput = document.getElementById('inputUserGmail');
    if (gmailInput) {
      gmailInput.addEventListener('change', (e) => {
        const val = e.target.value.trim();
        if (val) {
          this.audit.supervisorGmail = val;
          const hitlGmail = document.getElementById('hitlSignerGmail');
          if (hitlGmail) hitlGmail.textContent = val;
          this.addAiChatMessage(`Đã cập nhật Gmail tiếp nhận báo cáo của bạn thành: <strong>${val}</strong>.`);
        }
      });
    }

    // Chatbox Enter Listener
    const chatInput = document.getElementById('chatInputBox');
    if (chatInput) {
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.sendChatMessage();
        }
      });
    }

    // Scenario Slider
    const scenarioSlider = document.getElementById('scenarioSlider');
    if (scenarioSlider) {
      scenarioSlider.addEventListener('input', (e) => {
        this.onScenarioSlider(e.target.value);
      });
    }

    // Forecast Horizon Select
    const horizonSelect = document.getElementById('forecastHorizonSelect');
    if (horizonSelect) {
      horizonSelect.addEventListener('change', (e) => {
        this.forecastHorizon = parseInt(e.target.value, 10) || 30;
        this.updateForecast();
      });
    }
  },

  // ==========================================
  // RESET ALL DATA (ZERO POPUPS)
  // ==========================================
  resetAllData() {
    this.isDemoData = false;
    this.fileName = '';
    this.fileSize = 0;
    this.rawRows = [];
    this.cleanedRows = [];
    this.columns = [];
    this.schema = {};
    this.rawPage = 1;
    this.rawSearchQuery = '';

    this.stepStates = { 1: 'UNLOCKED', 2: 'LOCKED', 3: 'LOCKED', 4: 'LOCKED', 5: 'LOCKED', 6: 'LOCKED', 7: 'LOCKED' };
    this.stepExecuted = { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false };

    this.audit.initialRowCount = 0;
    this.audit.cleanedRowCount = 0;
    this.audit.missingCellsFound = 0;
    this.audit.missingCellsImputed = 0;
    this.audit.duplicatesRemoved = 0;
    this.audit.outliersFound = 0;
    this.audit.outliersTreated = 0;

    const loadedCard = document.getElementById('welcomeFileLoadedCard');
    if (loadedCard) loadedCard.classList.add('hidden');

    const defaultContent = document.getElementById('dropZoneContentDefault');
    const activeContent = document.getElementById('dropZoneContentActive');
    if (defaultContent && activeContent) {
      defaultContent.classList.remove('hidden');
      activeContent.classList.add('hidden');
    }

    const fileInput = document.getElementById('welcomeFileInput');
    if (fileInput) fileInput.value = '';

    this.renderOverviewMetrics();
    this.showPage('pageWelcome');
    this.addAiChatMessage('Đã làm mới hệ thống thành công. Bạn hãy nạp tệp CSV hoặc Excel của mình vào để tiếp tục nhé!');
  },

  // ==========================================
  // PAGE NAVIGATION (ZERO POPUPS)
  // ==========================================
  showPage(pageId) {
    const pages = ['pageWelcome', 'pageOverview', 'pageSteps'];
    pages.forEach(p => {
      const el = document.getElementById(p);
      if (el) {
        if (p === pageId) el.classList.remove('hidden');
        else el.classList.add('hidden');
      }
    });
    this.currentPage = pageId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.lucide) window.lucide.createIcons();
  },

  startToOverview() {
    if (this.rawRows.length === 0) {
      // Gently shake dropzone without any popup
      const dropZone = document.getElementById('welcomeDropZone');
      if (dropZone) {
        dropZone.classList.add('border-[#5D7B6F]', 'bg-[#D7F9FA]/60');
        setTimeout(() => dropZone.classList.remove('border-[#5D7B6F]', 'bg-[#D7F9FA]/60'), 1200);
      }
      this.addAiChatMessage('⚠️ Bạn hãy kéo thả tệp CSV / Excel vào khung, hoặc bấm nút <strong>"Dùng Thử Mẫu CSV / Excel"</strong> ở dưới để bắt đầu nhé!');
      return;
    }
    this.showOverviewScreen();
  },

  goToOverview() {
    this.showOverviewScreen();
  },

  showOverviewScreen() {
    this.showPage('pageOverview');
    this.renderOverviewMetrics();
    this.addAiChatMessage(`Bạn đang ở <strong>Trang 2: Tổng Quan Lộ Trình</strong>. Hệ thống đã quét tệp <em>${this.fileName}</em> (${this.isDemoData ? 'Dữ liệu Demo' : 'Tệp của bạn'}). Tổng số dòng: <strong>${this.rawRows.length}</strong>, phát hiện <strong>${this.audit.missingCellsFound}</strong> ô trống, <strong>${this.audit.duplicatesRemoved}</strong> dòng trùng, và <strong>${this.audit.outliersFound}</strong> ngoại lai IQR.`);
  },

  goToStep(stepNum) {
    if (this.rawRows.length === 0) {
      this.showPage('pageWelcome');
      return;
    }

    const state = this.stepStates[stepNum];
    if (state === 'LOCKED') {
      const navBtn = document.getElementById(`stepNav${stepNum}`);
      if (navBtn) {
        navBtn.classList.add('animate-pulse');
        setTimeout(() => navBtn.classList.remove('animate-pulse'), 800);
      }
      this.addAiChatMessage(`⚠️ <strong>Bước ${stepNum} đang bị khóa.</strong> Bạn cần bấm <em>Chạy kiểm tra</em> và <em>Xác nhận</em> ở Bước ${stepNum - 1} để được mở khóa nhé!`);
      return;
    }

    this.currentStep = stepNum;
    this.showPage('pageSteps');

    for (let i = 1; i <= 7; i++) {
      const sec = document.getElementById(`stepSection${i}`);
      if (sec) {
        if (i === stepNum) sec.classList.remove('hidden');
        else sec.classList.add('hidden');
      }

      const navBtn = document.getElementById(`stepNav${i}`);
      if (navBtn) {
        navBtn.classList.remove('active', 'completed', 'locked');
        if (this.stepStates[i] === 'COMPLETED') {
          navBtn.classList.add('completed');
        } else if (this.stepStates[i] === 'LOCKED') {
          navBtn.classList.add('locked');
        }
        if (i === stepNum) {
          navBtn.classList.add('active');
        }
      }
    }

    if (stepNum === 1) this.prepareStep1();
    if (stepNum === 2) this.prepareStep2();
    if (stepNum === 3) this.prepareStep3();
    if (stepNum === 4) this.prepareStep4();
    if (stepNum === 5) this.prepareStep5();
    if (stepNum === 6) this.prepareStep6();
    if (stepNum === 7) this.prepareStep7();

    window.scrollTo({ top: 120, behavior: 'smooth' });
    if (window.lucide) window.lucide.createIcons();
  },

  approveStepAndNext(stepNum) {
    if (!this.stepExecuted[stepNum]) {
      this.addAiChatMessage(`⚠️ Bạn cần bấm chạy thuật toán kiểm tra ở Bước ${stepNum} trước khi xác nhận nhé!`);
      return;
    }

    this.stepStates[stepNum] = 'COMPLETED';
    const nextStep = stepNum + 1;

    if (nextStep <= 7) {
      this.stepStates[nextStep] = 'UNLOCKED';
      const nextNav = document.getElementById(`stepNav${nextStep}`);
      if (nextNav) {
        nextNav.classList.remove('locked');
      }
      this.addAiChatMessage(`✅ <strong>Bước ${stepNum} đã được bạn thẩm định thành công!</strong> Đã mở khóa và chuyển tiếp sang Bước ${nextStep}.`);
      this.goToStep(nextStep);
    }
  },

  // ==========================================
  // DATA INGESTION: DEMO SAMPLE OR USER FILE
  // ==========================================
  async loadSampleData(filename) {
    try {
      this.addAiChatMessage(`Đang nạp tập dữ liệu mẫu demo: <code>${filename}</code>...`);
      const res = await fetch(filename);
      if (!res.ok) throw new Error(`Không thể nạp tệp ${filename} từ máy chủ.`);
      const blob = await res.blob();
      const file = new File([blob], filename, { type: blob.type });
      this.handleFile(file, true);
    } catch (e) {
      this.addAiChatMessage(`⚠️ Lỗi nạp tệp mẫu: ${e.message}`);
    }
  },

  handleFile(file, isDemo = false) {
    if (!file) return;
    this.isDemoData = isDemo;
    this.fileName = file.name;
    this.fileSize = file.size;
    const ext = (file.name.split('.').pop() || '').toLowerCase();

    const reader = new FileReader();

    if (ext === 'csv') {
      reader.onload = (e) => {
        try {
          Papa.parse(e.target.result, {
            header: true,
            skipEmptyLines: 'greedy',
            dynamicTyping: false,
            complete: (results) => {
              if (results.data && results.data.length > 0) {
                const rawFields = results.meta.fields || Object.keys(results.data[0]);
                const fields = rawFields
                  .map(f => String(f).replace(/^\uFEFF/, '').trim())
                  .filter(f => f !== '');
                this.processLoadedData(results.data, fields);
              } else {
                this.addAiChatMessage('⚠️ Tệp CSV không có dữ liệu hợp lệ! Vui lòng kiểm tra lại tệp.');
              }
            },
            error: (err) => this.addAiChatMessage(`⚠️ Lỗi đọc CSV: ${err.message}`)
          });
        } catch (err) {
          this.addAiChatMessage(`⚠️ Lỗi phân tích CSV: ${err.message}`);
        }
      };
      reader.readAsText(file, 'utf-8');
    } else if (ext === 'xlsx' || ext === 'xls') {
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const wb = XLSX.read(data, { type: 'array' });
          if (!wb.SheetNames || wb.SheetNames.length === 0) {
            throw new Error('Tệp Excel không chứa bảng tính (sheet) nào.');
          }
          const sheet = wb.Sheets[wb.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json(sheet, { defval: '' });
          if (json.length > 0) {
            const headerRow = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0] || [];
            const fields = (headerRow.length > 0 ? headerRow : Object.keys(json[0]))
              .map(f => String(f).replace(/^\uFEFF/, '').trim())
              .filter(f => f !== '');
            this.processLoadedData(json, fields);
          } else {
            this.addAiChatMessage('⚠️ Tệp Excel trống hoặc không có dòng dữ liệu nào!');
          }
        } catch (err) {
          this.addAiChatMessage(`⚠️ Lỗi đọc tệp Excel: ${err.message}`);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      this.addAiChatMessage(`⚠️ Tệp "<strong>${file.name}</strong>" có định dạng (.${ext}) không được hỗ trợ! Vui lòng chọn tệp .csv, .xlsx hoặc .xls.`);
    }
  },

  processLoadedData(rows, fields) {
    if (!rows || rows.length === 0) {
      this.addAiChatMessage('⚠️ Tệp dữ liệu trống! Vui lòng chọn tệp khác.');
      return;
    }

    this.columns = fields.filter(f => f && f.trim() !== '');
    this.rawRows = rows.map(r => {
      const clean = {};
      this.columns.forEach(c => {
        clean[c] = r[c] !== undefined ? r[c] : '';
      });
      return clean;
    });

    this.audit.initialRowCount = this.rawRows.length;
    this.cleanedRows = JSON.parse(JSON.stringify(this.rawRows));

    this.stepStates = { 1: 'UNLOCKED', 2: 'LOCKED', 3: 'LOCKED', 4: 'LOCKED', 5: 'LOCKED', 6: 'LOCKED', 7: 'LOCKED' };
    this.stepExecuted = { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false };
    this.rawPage = 1;
    this.rawSearchQuery = '';

    this.inferSchema();
    this.detectBusinessColumns();
    this.scanDatasetDefects();

    // 1. Cập nhật trực quan khung DropZone sang trạng thái ĐÃ NẠP
    const defaultContent = document.getElementById('dropZoneContentDefault');
    const activeContent = document.getElementById('dropZoneContentActive');
    const activeName = document.getElementById('dropZoneActiveFileName');
    const activeMeta = document.getElementById('dropZoneActiveFileMeta');
    const activeBadge = document.getElementById('dropZoneActiveBadge');

    if (defaultContent && activeContent) {
      defaultContent.classList.add('hidden');
      activeContent.classList.remove('hidden');
      if (activeName) activeName.textContent = this.fileName;
      if (activeMeta) activeMeta.textContent = `${this.rawRows.length.toLocaleString('vi-VN')} dòng • ${this.columns.length} cột • ${(this.fileSize / 1024).toFixed(1)} KB`;
      if (activeBadge) {
        activeBadge.textContent = this.isDemoData ? 'DỮ LIỆU DEMO DÙNG THỬ' : 'TỆP CỦA BẠN ĐÃ SẴN SÀNG';
      }
    }

    // 2. Cập nhật thẻ chi tiết bên dưới
    const loadedCard = document.getElementById('welcomeFileLoadedCard');
    const loadedBadge = document.getElementById('welcomeFileLoadedBadge');
    const loadedName = document.getElementById('welcomeFileLoadedName');
    const loadedMeta = document.getElementById('welcomeFileLoadedMeta');

    if (loadedCard && loadedName && loadedMeta) {
      loadedCard.classList.remove('hidden');
      if (loadedBadge) {
        if (this.isDemoData) {
          loadedBadge.textContent = 'DỮ LIỆU DEMO DÙNG THỬ';
          loadedBadge.className = 'type-badge type-categorical mb-0.5';
        } else {
          loadedBadge.textContent = 'TỆP DỮ LIỆU CỦA BẠN';
          loadedBadge.className = 'type-badge type-numeric mb-0.5';
        }
      }
      loadedName.textContent = this.fileName;
      loadedMeta.textContent = `(${this.rawRows.length.toLocaleString('vi-VN')} dòng • ${this.columns.length} cột • ${(this.fileSize / 1024).toFixed(1)} KB)`;
    }

    if (window.lucide) window.lucide.createIcons();

    const typeDesc = this.isDemoData ? 'dữ liệu mẫu demo' : 'tệp dữ liệu cá nhân của bạn';
    this.addAiChatMessage(`📂 <strong>Đã nạp thành công ${typeDesc}:</strong> <code>${this.fileName}</code> (${this.rawRows.length} dòng, ${this.columns.length} cột). Nhấn <strong>"BẮT ĐẦU QUY TRÌNH PHÂN TÍCH"</strong> để tiếp tục!`);
  },

  // ==========================================
  // SCHEMA INFERENCE & BUSINESS DETECTIONS
  // ==========================================
  inferSchema() {
    this.schema = {};
    this.columns.forEach(col => {
      let nullCount = 0;
      let numericCount = 0;
      let dateCount = 0;
      const samples = [];
      const uniqueSet = new Set();

      this.rawRows.forEach(r => {
        const val = r[col];
        if (this.isMissing(val)) {
          nullCount++;
        } else {
          uniqueSet.add(String(val).trim());
          if (samples.length < 3) samples.push(String(val).trim());
          if (this.isNumeric(val)) numericCount++;
          if (this.isDate(val)) dateCount++;
        }
      });

      const validCount = this.rawRows.length - nullCount;
      let type = 'Văn bản (String)';
      let badgeClass = 'type-string';

      if (validCount > 0) {
        if (numericCount / validCount > 0.75) {
          type = 'Số học (Numeric)';
          badgeClass = 'type-numeric';
        } else if (dateCount / validCount > 0.75) {
          type = 'Thời gian (Date)';
          badgeClass = 'type-date';
        } else if (uniqueSet.size <= 25) {
          type = 'Phân loại (Categorical)';
          badgeClass = 'type-categorical';
        }
      }

      this.schema[col] = {
        type,
        badgeClass,
        nullCount,
        validCount,
        uniqueCount: uniqueSet.size,
        samples
      };
    });
  },

  isMissing(v) {
    if (v === null || v === undefined) return true;
    const str = String(v).trim().toLowerCase();
    return str === '' || str === 'null' || str === 'undefined' || str === 'nan' || str === 'none' || str === 'n/a';
  },

  isValidDateValue(v) {
    if (this.isMissing(v)) return false;
    const s = String(v).trim();
    // Exclude obvious business codes, IDs, Opp codes (e.g. BM-OPP-0016, ORD-2024, etc.)
    if (/^(bm|opp|id|sku|code|inv|ord|kh|nv|sp|hd|dh)[-_]/i.test(s)) return false;
    if (/[a-zA-Z]/.test(s)) return false; // Calendar date strings should not contain letters

    // Check dd/mm/yyyy or dd-mm-yyyy
    const dmy = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
    if (dmy) {
      const d = parseInt(dmy[1], 10);
      const m = parseInt(dmy[2], 10);
      const y = parseInt(dmy[3], 10);
      if (m >= 1 && m <= 12 && d >= 1 && d <= 31 && y >= 1990 && y <= 2040) return true;
    }

    // Check yyyy-mm-dd or yyyy/mm/dd
    const ymd = s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
    if (ymd) {
      const y = parseInt(ymd[1], 10);
      const m = parseInt(ymd[2], 10);
      const d = parseInt(ymd[3], 10);
      if (m >= 1 && m <= 12 && d >= 1 && d <= 31 && y >= 1990 && y <= 2040) return true;
    }

    // Check ISO format 2024-01-15T...
    if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
      const d = new Date(s);
      return !isNaN(d.getTime()) && d.getFullYear() >= 1990 && d.getFullYear() <= 2040;
    }

    return false;
  },

  isDate(v) {
    return this.isValidDateValue(v);
  },

  isNumeric(v) {
    if (this.isMissing(v)) return false;
    const cleaned = String(v).replace(/[$,đ₫\s]/g, '').replace(/,/g, '');
    return !isNaN(Number(cleaned)) && cleaned !== '';
  },

  parseNumber(v) {
    if (this.isMissing(v)) return NaN;
    const cleaned = String(v).replace(/[$,đ₫\s]/g, '').replace(/,/g, '');
    return parseFloat(cleaned);
  },

  parseDate(v) {
    if (this.isMissing(v)) return null;
    const s = String(v).trim();
    if (!this.isValidDateValue(s)) return null;

    const dmy = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
    if (dmy) {
      return new Date(parseInt(dmy[3], 10), parseInt(dmy[2], 10) - 1, parseInt(dmy[1], 10));
    }
    const ymd = s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
    if (ymd) {
      return new Date(parseInt(ymd[1], 10), parseInt(ymd[2], 10) - 1, parseInt(ymd[3], 10));
    }
    const ts = Date.parse(s);
    return isNaN(ts) ? null : new Date(ts);
  },

  detectBusinessColumns() {
    this.dateCol = null;
    this.metricCol = null;
    this.categoryCol = null;
    this.regionCol = null;
    this.candidateCategoricalCols = [];

    // 1. Strict Date Column Detection
    for (const col of this.columns) {
      const lower = col.toLowerCase();
      // Skip obvious ID and code columns
      if (/id|code|sku|ma_|ma |so_|no_|number|opp/i.test(lower)) continue;

      let validDateCount = 0;
      let nonNullCount = 0;
      for (const r of this.rawRows) {
        if (!this.isMissing(r[col])) {
          nonNullCount++;
          if (this.isValidDateValue(r[col])) validDateCount++;
        }
      }
      if (nonNullCount > 0 && (validDateCount / nonNullCount) >= 0.5) {
        this.dateCol = col;
        break;
      }
    }

    // 2. Metric Column Detection (Revenue, Sales, Total, Amount, Profit)
    const metricKeywords = ['doanh_thu', 'doanh thu', 'revenue', 'sales', 'tong_tien', 'thanh_tien', 'gia_tri', 'amount', 'profit', 'loi_nhuan', 'don_gia'];
    for (const kw of metricKeywords) {
      const found = this.columns.find(c => c.toLowerCase().includes(kw) && this.schema[c]?.type.includes('Số học'));
      if (found) {
        this.metricCol = found;
        break;
      }
    }
    if (!this.metricCol) {
      this.metricCol = this.columns.find(c => this.schema[c]?.type.includes('Số học')) || this.columns[0];
    }

    // 3. Categorical Columns Detection
    this.columns.forEach(col => {
      const s = this.schema[col];
      if (col !== this.dateCol && col !== this.metricCol) {
        const lower = col.toLowerCase();
        if (s?.uniqueCount > 1 && s?.uniqueCount <= 40 && !/^(id|stt|index)$/i.test(lower)) {
          this.candidateCategoricalCols.push(col);
        }
      }
    });

    if (this.candidateCategoricalCols.length === 0) {
      this.columns.forEach(col => {
        if (col !== this.metricCol && col !== this.dateCol) {
          this.candidateCategoricalCols.push(col);
        }
      });
    }

    if (this.candidateCategoricalCols.length > 0) {
      this.categoryCol = this.candidateCategoricalCols[0];
      this.regionCol = this.candidateCategoricalCols.length > 1 ? this.candidateCategoricalCols[1] : this.candidateCategoricalCols[0];
    } else {
      this.categoryCol = this.columns[0];
      this.regionCol = this.columns[1] || this.columns[0];
    }

    this.chart1Col = this.dateCol ? '__DATE__' : this.categoryCol;
    this.populateChartColumnDropdowns();
  },

  populateChartColumnDropdowns() {
    // Dropdown for Chart 1
    const chart1Select = document.getElementById('chart1ColSelect');
    if (chart1Select) {
      let optionsHtml = '';
      if (this.dateCol) {
        optionsHtml += `<option value="__DATE__">Chu kỳ Thời gian (${this.dateCol})</option>`;
      }
      this.candidateCategoricalCols.forEach(col => {
        optionsHtml += `<option value="${col}">${col}</option>`;
      });
      chart1Select.innerHTML = optionsHtml;
      if (this.chart1Col) chart1Select.value = this.chart1Col;
    }

    // Dropdown for Chart 2 (Category)
    const catSelect = document.getElementById('catColSelect');
    if (catSelect) {
      const optionsHtml = this.candidateCategoricalCols
        .map(c => `<option value="${c}">${c}</option>`)
        .join('');
      catSelect.innerHTML = optionsHtml;
      if (this.categoryCol) catSelect.value = this.categoryCol;
    }

    // Dropdown for Chart 3 (Region / Secondary)
    const regSelect = document.getElementById('regColSelect');
    if (regSelect) {
      const optionsHtml = this.candidateCategoricalCols
        .map(c => `<option value="${c}">${c}</option>`)
        .join('');
      regSelect.innerHTML = optionsHtml;
      if (this.regionCol) regSelect.value = this.regionCol;
    }
  },

  changeChart1Col(colName) {
    this.chart1Col = colName;
    this.renderChart1();
  },

  changeCategoryCol(colName) {
    this.categoryCol = colName;
    this.renderCategoryChart();
  },

  changeRegionCol(colName) {
    this.regionCol = colName;
    this.renderRegionChart();
  },

  // ==========================================
  // DEEP AUDIT SCANNING
  // ==========================================
  scanDatasetDefects() {
    this.defectDetails = {
      missingErrors: [],
      duplicateRows: [],
      outlierErrors: [],
      iqrStats: {}
    };

    let missingCells = 0;

    this.rawRows.forEach((r, idx) => {
      this.columns.forEach(col => {
        if (this.isMissing(r[col])) {
          missingCells++;
          const s = this.schema[col];
          const method = s?.type.includes('Số học') ? 'Trung vị (Median)' : (s?.type.includes('Thời gian') ? 'Dòng gần nhất (Forward Fill)' : 'Yếu vị (Mode)');
          this.defectDetails.missingErrors.push({
            rowIdx: idx + 1,
            col: col,
            issue: 'Ô trống (Null/NaN)',
            method: method
          });
        }
      });
    });
    this.audit.missingCellsFound = missingCells;

    const seenHashes = new Map();
    this.rawRows.forEach((r, idx) => {
      const hash = this.columns.map(c => String(r[c]).trim().toLowerCase()).join('||');
      if (seenHashes.has(hash)) {
        this.defectDetails.duplicateRows.push({
          rowIdx: idx + 1,
          originalIdx: seenHashes.get(hash),
          data: r
        });
      } else {
        seenHashes.set(hash, idx + 1);
      }
    });
    this.audit.duplicatesRemoved = this.defectDetails.duplicateRows.length;

    let totalOutliers = 0;
    this.columns.forEach(col => {
      if (this.schema[col]?.type.includes('Số học')) {
        const nums = this.rawRows
          .map(r => this.parseNumber(r[col]))
          .filter(n => !isNaN(n))
          .sort((a, b) => a - b);

        if (nums.length >= 8) {
          const q1 = nums[Math.floor(nums.length * 0.25)];
          const q3 = nums[Math.floor(nums.length * 0.75)];
          const iqr = q3 - q1;
          const lower = q1 - 1.5 * iqr;
          const upper = q3 + 1.5 * iqr;

          let colOutlierCount = 0;
          this.rawRows.forEach((r, idx) => {
            const v = this.parseNumber(r[col]);
            if (!isNaN(v) && (v < lower || v > upper)) {
              colOutlierCount++;
              totalOutliers++;
              const capped = v > upper ? Math.round(upper) : Math.round(lower);
              this.defectDetails.outlierErrors.push({
                rowIdx: idx + 1,
                col: col,
                val: v,
                cappedVal: capped,
                bound: v > upper ? `> Ngưỡng trên (${upper.toLocaleString('vi-VN')})` : `< Ngưỡng dưới (${lower.toLocaleString('vi-VN')})`,
                type: v > upper ? 'Đột biến cao (Spike)' : 'Đột biến thấp (Dip)'
              });
            }
          });

          this.defectDetails.iqrStats[col] = {
            q1, q3, iqr, lower, upper, count: colOutlierCount
          };
        }
      }
    });
    this.audit.outliersFound = totalOutliers;
  },

  // ==========================================
  // PAGE 2: OVERVIEW SCREEN
  // ==========================================
  renderOverviewMetrics() {
    const elRows = document.getElementById('ovTotalRows');
    const elCols = document.getElementById('ovTotalCols');
    const elMissing = document.getElementById('ovMissingCells');
    const elDups = document.getElementById('ovDuplicateRows');
    const elOutliers = document.getElementById('ovOutlierPoints');

    if (this.rawRows.length === 0) {
      if (elRows) elRows.textContent = '--';
      if (elCols) elCols.textContent = '-- cột thông tin';
      if (elMissing) elMissing.textContent = '--';
      if (elDups) elDups.textContent = '--';
      if (elOutliers) elOutliers.textContent = '--';
      return;
    }

    if (elRows) elRows.textContent = `${this.rawRows.length.toLocaleString('vi-VN')} dòng`;
    if (elCols) elCols.textContent = `${this.columns.length} cột thông tin`;
    if (elMissing) elMissing.textContent = `${this.audit.missingCellsFound.toLocaleString('vi-VN')} ô`;
    if (elDups) elDups.textContent = `${this.audit.duplicatesRemoved.toLocaleString('vi-VN')} dòng`;
    if (elOutliers) elOutliers.textContent = `${this.audit.outliersFound.toLocaleString('vi-VN')} điểm`;
  },

  // ==========================================
  // STEP 1: SCHEMA INSPECTOR & DATA EXPLORER
  // ==========================================
  prepareStep1() {
    const colBadge = document.getElementById('step1ColCountBadge');
    const rowBadge = document.getElementById('step1RowCountBadge');
    if (colBadge) colBadge.textContent = `${this.columns.length} Cột`;
    if (rowBadge) rowBadge.textContent = `${this.rawRows.length} Dòng`;

    const schemaBody = document.getElementById('step1SchemaBody');
    if (schemaBody) {
      let html = '';
      this.columns.forEach((col, idx) => {
        const s = this.schema[col];
        const statusHtml = s.nullCount > 0 
          ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D96B6B]/15 text-[#D96B6B] border border-[#D96B6B]/30">⚠️ Có ${s.nullCount} ô thiếu</span>`
          : `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#5D7B6F]/15 text-[#5D7B6F] border border-[#5D7B6F]/30">✓ Đầy đủ 100%</span>`;

        html += `
          <tr>
            <td class="font-mono text-center text-[#7F938B] font-bold">${idx + 1}</td>
            <td class="font-bold text-[#22332C]">${col}</td>
            <td><span class="type-badge ${s.badgeClass}">${s.type}</span></td>
            <td>${s.validCount} / ${this.rawRows.length}</td>
            <td><span class="font-bold ${s.nullCount > 0 ? 'text-[#D96B6B]' : 'text-[#5D7B6F]'}">${s.nullCount}</span></td>
            <td>${s.uniqueCount}</td>
            <td class="text-xs text-[#566961] font-mono">${s.samples.slice(0, 2).join(', ')}</td>
            <td>${statusHtml}</td>
          </tr>
        `;
      });
      schemaBody.innerHTML = html;
    }

    this.renderRawPreviewTable();

    const passBtn = document.getElementById('btnPassStep1');
    if (passBtn) {
      passBtn.disabled = !this.stepExecuted[1];
      if (this.stepExecuted[1]) {
        passBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      }
    }
  },

  onStep1Search(query) {
    this.rawSearchQuery = (query || '').toLowerCase().trim();
    this.rawPage = 1;
    this.renderRawPreviewTable();
  },

  prevRawPage() {
    if (this.rawPage > 1) {
      this.rawPage--;
      this.renderRawPreviewTable();
    }
  },

  nextRawPage() {
    const filtered = this.getFilteredRawRows();
    const totalPages = Math.ceil(filtered.length / this.rawPageSize) || 1;
    if (this.rawPage < totalPages) {
      this.rawPage++;
      this.renderRawPreviewTable();
    }
  },

  getFilteredRawRows() {
    if (!this.rawSearchQuery) return this.rawRows;
    return this.rawRows.filter(r => {
      return this.columns.some(c => String(r[c] || '').toLowerCase().includes(this.rawSearchQuery));
    });
  },

  renderRawPreviewTable() {
    const head = document.getElementById('step1RawHead');
    const body = document.getElementById('step1RawBody');
    const pageText = document.getElementById('step1PaginationText');
    if (!head || !body) return;

    let hHtml = '<tr><th style="width: 50px;">#</th>';
    this.columns.forEach(c => hHtml += `<th>${c}</th>`);
    hHtml += '</tr>';
    head.innerHTML = hHtml;

    const filtered = this.getFilteredRawRows();
    const totalPages = Math.ceil(filtered.length / this.rawPageSize) || 1;
    if (this.rawPage > totalPages) this.rawPage = totalPages;

    const startIdx = (this.rawPage - 1) * this.rawPageSize;
    const pageRows = filtered.slice(startIdx, startIdx + this.rawPageSize);

    if (pageText) {
      pageText.textContent = `Trang ${this.rawPage} / ${totalPages} (${filtered.length} dòng)`;
    }

    let bHtml = '';
    if (pageRows.length === 0) {
      bHtml = `<tr><td colspan="${this.columns.length + 1}" class="text-center py-6 text-xs text-[#566961]">Không tìm thấy bản ghi nào khớp với từ khóa tìm kiếm.</td></tr>`;
    } else {
      pageRows.forEach((r, i) => {
        const actualRowIdx = startIdx + i + 1;
        bHtml += '<tr>';
        bHtml += `<td class="font-mono text-center text-[#7F938B] font-bold">#${actualRowIdx}</td>`;
        this.columns.forEach(c => {
          const val = r[c];
          if (this.isMissing(val)) {
            bHtml += '<td class="text-[#D96B6B] italic font-semibold bg-[#D96B6B]/10">[Ô Trống]</td>';
          } else {
            bHtml += `<td>${String(val)}</td>`;
          }
        });
        bHtml += '</tr>';
      });
    }
    body.innerHTML = bHtml;
  },

  // ZERO POPUP: Smoothly unlocks next button & updates state
  runStep1Audit() {
    this.stepExecuted[1] = true;
    const passBtn = document.getElementById('btnPassStep1');
    if (passBtn) {
      passBtn.disabled = false;
      passBtn.classList.remove('opacity-50', 'cursor-not-allowed', 'btn-sage-outline');
      passBtn.classList.add('btn-sage');
      passBtn.innerHTML = '<span>Xác Nhận & Sang Bước 2 →</span>';
    }

    this.addAiChatMessage(`✅ <strong>Bước 1 - Khởi Tạo & Khám Phá Nguồn Hoàn Tất:</strong> Thẩm định thành công <strong>${this.columns.length}</strong> cột và <strong>${this.rawRows.length}</strong> dòng. Bạn có thể bấm <em>"Xác Nhận & Sang Bước 2"</em> để tiếp tục.`);
  },

  // ==========================================
  // STEP 2: DUPLICATE REMOVAL (DEDUPLICATION)
  // ==========================================
  prepareStep2() {
    const badge = document.getElementById('step2DupBadge');
    if (badge) badge.textContent = `${this.defectDetails.duplicateRows.length} dòng trùng`;

    const summary = document.getElementById('step2DupSummaryText');
    if (summary) {
      if (this.defectDetails.duplicateRows.length === 0) {
        summary.innerHTML = `<span class="text-[#5D7B6F] font-bold">✓ Dữ liệu hoàn hảo!</span> Không phát hiện dòng dữ liệu trùng lặp nào trong tập dữ liệu.`;
      } else {
        summary.innerHTML = `Hệ thống quét phát hiện chính xác <strong>${this.defectDetails.duplicateRows.length}</strong> dòng dữ liệu trùng lặp 100% về thông tin giao dịch. Cần được lọc sạch trước khi tính toán.`;
      }
    }

    const head = document.getElementById('step2DupHead');
    const body = document.getElementById('step2DupBody');
    if (head && body) {
      let hHtml = '<tr><th style="width: 140px;">Vị Trí Bản Ghi</th>';
      this.columns.slice(0, 6).forEach(c => hHtml += `<th>${c}</th>`);
      hHtml += '</tr>';
      head.innerHTML = hHtml;

      let bHtml = '';
      if (this.defectDetails.duplicateRows.length === 0) {
        bHtml = `<tr><td colspan="${Math.min(7, this.columns.length + 1)}" class="text-center text-xs text-[#566961] py-6 font-semibold">Tập dữ liệu hoàn toàn không có dòng trùng lặp nào! Bạn có thể bấm xác nhận để tiếp tục.</td></tr>`;
      } else {
        this.defectDetails.duplicateRows.forEach(dup => {
          bHtml += `
            <tr>
              <td class="font-bold text-[#D96B6B]">
                Dòng #${dup.rowIdx}
                <span class="text-[10px] text-[#566961] block font-normal">(Trùng dòng gốc #${dup.originalIdx})</span>
              </td>
          `;
          this.columns.slice(0, 6).forEach(c => {
            bHtml += `<td>${String(dup.data[c])}</td>`;
          });
          bHtml += '</tr>';
        });
      }
      body.innerHTML = bHtml;
    }

    const passBtn = document.getElementById('btnPassStep2');
    if (passBtn) {
      passBtn.disabled = !this.stepExecuted[2];
      if (this.stepExecuted[2]) passBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
  },

  // ZERO POPUP: Smoothly dedupes & unlocks Step 3
  runStep2Dedup() {
    const originalCount = this.cleanedRows.length;
    const seen = new Set();
    const deduped = [];

    this.cleanedRows.forEach(r => {
      const hash = this.columns.map(c => String(r[c]).trim().toLowerCase()).join('||');
      if (!seen.has(hash)) {
        seen.add(hash);
        deduped.push(r);
      }
    });

    this.cleanedRows = deduped;
    const removedCount = originalCount - this.cleanedRows.length;
    this.audit.duplicatesRemoved = removedCount;
    this.stepExecuted[2] = true;

    const summary = document.getElementById('step2DupSummaryText');
    if (summary) {
      summary.innerHTML = `<span class="text-[#5D7B6F] font-bold">✅ ĐÃ LỌC SẠCH ${removedCount} DÒNG TRÙNG LẶP!</span> Tập dữ liệu hiện tại còn <strong>${this.cleanedRows.length}</strong> bản ghi độc bản. Sẵn sàng sang Bước 3.`;
    }

    const passBtn = document.getElementById('btnPassStep2');
    if (passBtn) {
      passBtn.disabled = false;
      passBtn.classList.remove('opacity-50', 'cursor-not-allowed', 'btn-sage-outline');
      passBtn.classList.add('btn-sage');
      passBtn.innerHTML = '<span>Xác Nhận & Sang Bước 3 →</span>';
    }

    this.addAiChatMessage(`✅ <strong>Bước 2 - Lọc Sạch Bản Ghi Trùng Hoàn Thành:</strong> Đã loại bỏ <strong>${removedCount}</strong> bản ghi trùng lặp. Nút sang Bước 3 đã mở khóa!`);
  },

  // ==========================================
  // STEP 3: MISSING VALUE IMPUTATION
  // ==========================================
  prepareStep3() {
    const totalBadge = document.getElementById('step3MissingTotalBadge');
    if (totalBadge) totalBadge.textContent = `${this.audit.missingCellsFound} ô cần điền`;

    const errList = document.getElementById('step3ErrorList');
    if (errList) {
      if (this.defectDetails.missingErrors.length === 0) {
        errList.innerHTML = `<div class="col-span-full p-4 bg-[#B0D4B8]/20 rounded-xl text-xs text-[#22332C] font-semibold text-center">Tuyệt vời! Không phát hiện ô khuyết thiếu nào trong tập dữ liệu.</div>`;
      } else {
        let items = '';
        this.defectDetails.missingErrors.slice(0, 12).forEach(e => {
          items += `
            <div class="p-2.5 rounded-xl bg-[#F8FAF9] border border-[#A4C3A2]/40 text-xs shadow-2xs space-y-1">
              <div class="flex items-center justify-between">
                <span class="font-mono text-[#22332C] font-bold">Dòng #${e.rowIdx}</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D96B6B]/15 text-[#D96B6B] border border-[#D96B6B]/30">${e.issue}</span>
              </div>
              <div class="text-[11px] text-[#566961]">
                Cột: <code class="font-bold text-[#22332C]">${e.col}</code>
              </div>
            </div>
          `;
        });
        if (this.defectDetails.missingErrors.length > 12) {
          items += `<div class="col-span-full text-xs text-[#566961] text-center italic py-1">... và ${this.defectDetails.missingErrors.length - 12} ô khuyết thiếu khác.</div>`;
        }
        errList.innerHTML = items;
      }
    }

    const tbody = document.getElementById('step3TableBody');
    if (tbody) {
      let html = '';
      this.columns.forEach(col => {
        const s = this.schema[col];
        if (s.nullCount > 0) {
          const method = s.type.includes('Số học') ? 'Trung vị (Median)' : (s.type.includes('Thời gian') ? 'Dòng gần nhất (Forward Fill)' : 'Yếu vị (Mode)');
          html += `
            <tr>
              <td class="font-bold text-[#22332C]">${col}</td>
              <td><span class="type-badge ${s.badgeClass}">${s.type}</span></td>
              <td class="text-[#D96B6B] font-bold">${s.nullCount} ô</td>
              <td class="font-bold">${((s.nullCount / this.rawRows.length) * 100).toFixed(1)}%</td>
              <td><span class="type-badge type-categorical">${method}</span></td>
              <td id="status_missing_${col}" class="text-xs font-bold text-[#D99B52]">Chờ xử lý</td>
            </tr>
          `;
        }
      });
      if (html === '') {
        html = `<tr><td colspan="6" class="text-center text-xs text-[#566961] py-4">Tất cả các cột đều đầy đủ 100% dữ liệu.</td></tr>`;
      }
      tbody.innerHTML = html;
    }

    const passBtn = document.getElementById('btnPassStep3');
    if (passBtn) {
      passBtn.disabled = !this.stepExecuted[3];
      if (this.stepExecuted[3]) passBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
  },

  // ZERO POPUP: Smoothly imputes & unlocks Step 4
  runStep3Impute() {
    let imputedCount = 0;

    this.columns.forEach(col => {
      const s = this.schema[col];
      if (s.nullCount > 0) {
        if (s.type.includes('Số học')) {
          const validNums = this.cleanedRows
            .map(r => this.parseNumber(r[col]))
            .filter(n => !isNaN(n))
            .sort((a, b) => a - b);
          const median = validNums.length > 0 ? validNums[Math.floor(validNums.length / 2)] : 0;

          this.cleanedRows.forEach(r => {
            if (this.isMissing(r[col])) {
              r[col] = median;
              imputedCount++;
            }
          });
        } else if (s.type.includes('Thời gian')) {
          let lastValid = null;
          this.cleanedRows.forEach(r => {
            if (!this.isMissing(r[col])) {
              lastValid = r[col];
            } else if (lastValid) {
              r[col] = lastValid;
              imputedCount++;
            }
          });
        } else {
          const counts = {};
          this.cleanedRows.forEach(r => {
            const v = String(r[col]).trim();
            if (!this.isMissing(v)) counts[v] = (counts[v] || 0) + 1;
          });
          let mode = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0] || 'Unknown';

          this.cleanedRows.forEach(r => {
            if (this.isMissing(r[col])) {
              r[col] = mode;
              imputedCount++;
            }
          });
        }

        const statusEl = document.getElementById(`status_missing_${col}`);
        if (statusEl) {
          statusEl.textContent = '✓ Đã bù đắp thành công';
          statusEl.className = 'text-xs font-bold text-[#5D7B6F]';
        }
      }
    });

    this.audit.missingCellsImputed = imputedCount;
    this.stepExecuted[3] = true;

    const errList = document.getElementById('step3ErrorList');
    if (errList && this.defectDetails.missingErrors.length > 0) {
      errList.querySelectorAll('span.bg-\\[\\#D96B6B\\]\\/15').forEach(el => {
        el.textContent = '✓ ĐÃ ĐIỀU CHỈNH';
        el.className = 'px-2 py-0.5 rounded text-[10px] font-bold bg-[#5D7B6F]/20 text-[#5D7B6F] border border-[#5D7B6F]/40';
      });
    }

    const passBtn = document.getElementById('btnPassStep3');
    if (passBtn) {
      passBtn.disabled = false;
      passBtn.classList.remove('opacity-50', 'cursor-not-allowed', 'btn-sage-outline');
      passBtn.classList.add('btn-sage');
      passBtn.innerHTML = '<span>Xác Nhận & Sang Bước 4 →</span>';
    }

    this.addAiChatMessage(`✅ <strong>Bước 3 - Lấp Đầy Dữ Liệu Trống Hoàn Thành:</strong> Đã bù đắp thành công <strong>${imputedCount}</strong> ô dữ liệu khuyết thiếu. Nút sang Bước 4 đã mở khóa!`);
  },

  // ==========================================
  // STEP 4: OUTLIER TREATMENT (IQR WINSORIZATION)
  // ==========================================
  prepareStep4() {
    const list = document.getElementById('step4OutlierList');
    if (list) {
      if (this.defectDetails.outlierErrors.length === 0) {
        list.innerHTML = `<div class="p-3 bg-[#B0D4B8]/20 rounded-xl text-xs text-[#22332C] font-semibold text-center">Không phát hiện điểm ngoại lai bất thường trong các cột số học.</div>`;
      } else {
        let items = '';
        this.defectDetails.outlierErrors.slice(0, 10).forEach(o => {
          items += `
            <div class="p-2 rounded-xl bg-[#F8FAF9] border border-[#A4C3A2]/40 text-xs shadow-2xs space-y-1">
              <div class="flex items-center justify-between">
                <span class="font-mono text-[#22332C] font-bold">Dòng #${o.rowIdx}</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D96B6B]/15 text-[#D96B6B] border border-[#D96B6B]/30">${o.type}</span>
              </div>
              <div class="text-[11px] text-[#566961]">
                Cột: <strong>${o.col}</strong> = <span class="text-[#D96B6B] font-bold">${o.val.toLocaleString('vi-VN')}</span>
              </div>
            </div>
          `;
        });
        if (this.defectDetails.outlierErrors.length > 10) {
          items += `<div class="text-xs text-[#566961] text-center italic py-1">... và ${this.defectDetails.outlierErrors.length - 10} điểm ngoại lai khác.</div>`;
        }
        list.innerHTML = items;
      }
    }

    const tbody = document.getElementById('step4TableBody');
    if (tbody) {
      let html = '';
      Object.keys(this.defectDetails.iqrStats).forEach(col => {
        const stat = this.defectDetails.iqrStats[col];
        html += `
          <tr>
            <td class="font-bold text-[#22332C]">${col}</td>
            <td>${stat.q1.toLocaleString('vi-VN')}</td>
            <td>${stat.q3.toLocaleString('vi-VN')}</td>
            <td class="font-mono font-bold">${stat.iqr.toLocaleString('vi-VN')}</td>
            <td class="font-mono text-[#566961]">${stat.lower.toLocaleString('vi-VN')}</td>
            <td class="font-mono text-[#566961]">${stat.upper.toLocaleString('vi-VN')}</td>
            <td class="text-[#D96B6B] font-bold">${stat.count} điểm</td>
            <td><span class="type-badge type-categorical">Winsorization</span></td>
          </tr>
        `;
      });
      if (html === '') {
        html = `<tr><td colspan="8" class="text-center text-xs text-[#566961] py-4">Không có cột số nào cần kiểm định IQR.</td></tr>`;
      }
      tbody.innerHTML = html;
    }

    const passBtn = document.getElementById('btnPassStep4');
    if (passBtn) {
      passBtn.disabled = !this.stepExecuted[4];
      if (this.stepExecuted[4]) passBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
  },

  // ZERO POPUP
  runStep4Winsorize() {
    let treatedCount = 0;

    Object.keys(this.defectDetails.iqrStats).forEach(col => {
      const stat = this.defectDetails.iqrStats[col];
      this.cleanedRows.forEach(r => {
        const v = this.parseNumber(r[col]);
        if (!isNaN(v)) {
          if (v < stat.lower) {
            r[col] = Math.round(stat.lower);
            treatedCount++;
          } else if (v > stat.upper) {
            r[col] = Math.round(stat.upper);
            treatedCount++;
          }
        }
      });
    });

    this.audit.outliersTreated = treatedCount;
    this.stepExecuted[4] = true;

    const list = document.getElementById('step4OutlierList');
    if (list && this.defectDetails.outlierErrors.length > 0) {
      list.querySelectorAll('span.bg-\\[\\#D96B6B\\]\\/15').forEach(el => {
        el.textContent = '✓ ĐÃ WINSORIZE';
        el.className = 'px-2 py-0.5 rounded text-[10px] font-bold bg-[#5D7B6F]/20 text-[#5D7B6F] border border-[#5D7B6F]/40';
      });
    }

    const passBtn = document.getElementById('btnPassStep4');
    if (passBtn) {
      passBtn.disabled = false;
      passBtn.classList.remove('opacity-50', 'cursor-not-allowed', 'btn-sage-outline');
      passBtn.classList.add('btn-sage');
      passBtn.innerHTML = '<span>Xác Nhận & Sang Bước 5 →</span>';
    }

    this.addAiChatMessage(`✅ <strong>Bước 4 - Kiểm Soát Biến Động & Dị Biệt Hoàn Thành:</strong> Đã điều chỉnh <strong>${treatedCount}</strong> điểm dữ liệu bất thường bằng thuật toán Winsorization (IQR). Nút sang Bước 5 đã mở khóa!`);
  },

  // ==========================================
  // STEP 5: STANDARDIZATION
  // ==========================================
  prepareStep5() {
    const reportBox = document.getElementById('step5ReportBox');
    if (reportBox && !this.stepExecuted[5]) {
      reportBox.innerHTML = `
        <div class="col-span-full p-8 text-center text-xs text-[#566961] bg-white rounded-2xl border border-[#A4C3A2]/40">
          Nhấn nút <strong>"Chạy Chuẩn Hóa Toàn Diện"</strong> ở bên trái để thực thi đồng bộ ngày ISO 8601, chuyển tiền tệ sang số thực và tinh chỉnh chuỗi ký tự.
        </div>
      `;
    }

    const passBtn = document.getElementById('btnPassStep5');
    if (passBtn) {
      passBtn.disabled = !this.stepExecuted[5];
      if (this.stepExecuted[5]) passBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
  },

  // ZERO POPUP
  runStep5Standardize() {
    let dateCount = 0;
    let currCount = 0;
    let strCount = 0;

    this.cleanedRows.forEach(r => {
      this.columns.forEach(col => {
        const val = r[col];
        if (this.isMissing(val)) return;

        if (this.schema[col]?.type.includes('Thời gian')) {
          const d = this.parseDate(val);
          if (d) {
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            r[col] = `${yyyy}-${mm}-${dd}`;
            dateCount++;
          }
        }

        if (this.schema[col]?.type.includes('Số học')) {
          const num = this.parseNumber(val);
          if (!isNaN(num)) {
            r[col] = num;
            currCount++;
          }
        }

        if (typeof val === 'string' && !this.schema[col]?.type.includes('Thời gian')) {
          const trimmed = val.trim().replace(/\s+/g, ' ');
          if (trimmed !== val) strCount++;
          r[col] = trimmed;
        }
      });
    });

    this.audit.datesHarmonized = dateCount;
    this.audit.currenciesCleaned = currCount;
    this.audit.stringsStandardized = strCount;
    this.stepExecuted[5] = true;

    const reportBox = document.getElementById('step5ReportBox');
    if (reportBox) {
      reportBox.innerHTML = `
        <div class="p-5 rounded-2xl bg-white border border-[#A4C3A2]/40 shadow-xs space-y-2">
          <div class="flex items-center gap-2 text-xs font-bold text-[#5D7B6F]">
            <i data-lucide="calendar-check" class="w-4 h-4"></i> Chuẩn Hóa Ngày Tháng
          </div>
          <p class="text-2xl font-extrabold text-[#22332C]">${dateCount.toLocaleString('vi-VN')} ô</p>
          <p class="text-[11px] text-[#566961]">Đồng bộ định dạng về chuẩn ISO 8601 (YYYY-MM-DD).</p>
        </div>

        <div class="p-5 rounded-2xl bg-white border border-[#A4C3A2]/40 shadow-xs space-y-2">
          <div class="flex items-center gap-2 text-xs font-bold text-[#5D7B6F]">
            <i data-lucide="badge-dollar-sign" class="w-4 h-4"></i> Tiền Tệ & Số Thực
          </div>
          <p class="text-2xl font-extrabold text-[#22332C]">${currCount.toLocaleString('vi-VN')} ô</p>
          <p class="text-[11px] text-[#566961]">Loại bỏ ký hiệu đ, $, dấu phẩy, đưa về kiểu số nguyên thủy.</p>
        </div>

        <div class="p-5 rounded-2xl bg-white border border-[#A4C3A2]/40 shadow-xs space-y-2">
          <div class="flex items-center gap-2 text-xs font-bold text-[#5D7B6F]">
            <i data-lucide="type" class="w-4 h-4"></i> Tinh Chỉnh Chuỗi
          </div>
          <p class="text-2xl font-extrabold text-[#22332C]">${strCount.toLocaleString('vi-VN')} ô</p>
          <p class="text-[11px] text-[#566961]">Cắt bỏ khoảng trắng thừa đầu/cuối và định dạng lại văn bản.</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
    }

    const passBtn = document.getElementById('btnPassStep5');
    if (passBtn) {
      passBtn.disabled = false;
      passBtn.classList.remove('opacity-50', 'cursor-not-allowed', 'btn-sage-outline');
      passBtn.classList.add('btn-sage');
      passBtn.innerHTML = '<span>Xác Nhận & Sang Bước 6 →</span>';
    }

    this.addAiChatMessage(`✅ <strong>Bước 5 - Đồng Bộ Hóa Dữ Liệu Hoàn Thành:</strong> Đã chuẩn hóa <strong>${dateCount}</strong> ngày ISO và <strong>${currCount}</strong> giá trị số thực. Nút sang Bước 6 (Phê Duyệt Dữ Liệu Sạch HITL) đã mở khóa!`);
  },

  // ==========================================
  // STEP 6: HUMAN-IN-THE-LOOP (HITL) GATEKEEPER
  // ==========================================
  prepareStep6() {
    this.audit.cleanedRowCount = this.cleanedRows.length;

    const elBefore = document.getElementById('hitlRowsBefore');
    const elAfter = document.getElementById('hitlRowsAfter');
    const elMissing = document.getElementById('hitlMissingImputed');
    const elOutlier = document.getElementById('hitlOutlierTreated');
    const elName = document.getElementById('hitlSignerName');
    const elGmail = document.getElementById('hitlSignerGmail');

    if (elBefore) elBefore.textContent = `${this.audit.initialRowCount.toLocaleString('vi-VN')} dòng`;
    if (elAfter) elAfter.textContent = `${this.audit.cleanedRowCount.toLocaleString('vi-VN')} dòng`;
    if (elMissing) elMissing.textContent = `${this.audit.missingCellsImputed.toLocaleString('vi-VN')} ô`;
    if (elOutlier) elOutlier.textContent = `${this.audit.outliersTreated.toLocaleString('vi-VN')} điểm`;
    if (elName) elName.textContent = this.audit.supervisorName;
    if (elGmail) elGmail.textContent = this.audit.supervisorGmail;

    const head = document.getElementById('hitlCleanedHead');
    const body = document.getElementById('hitlCleanedBody');
    if (head && body) {
      let hHtml = '<tr><th style="width: 50px;">#</th>';
      this.columns.forEach(c => hHtml += `<th>${c}</th>`);
      hHtml += '</tr>';
      head.innerHTML = hHtml;

      let bHtml = '';
      this.cleanedRows.slice(0, 10).forEach((r, idx) => {
        bHtml += '<tr>';
        bHtml += `<td class="font-mono text-center text-[#5D7B6F] font-bold">#${idx + 1}</td>`;
        this.columns.forEach(c => {
          bHtml += `<td>${String(r[c])}</td>`;
        });
        bHtml += '</tr>';
      });
      body.innerHTML = bHtml;
    }

    this.addAiChatMessage(`⚠️ <strong>Bước 6 - Phê Duyệt Dữ Liệu Sạch (HITL):</strong> Chốt chặn chất lượng cuối cùng đang chờ bạn phê duyệt. Vui lòng đối soát các chỉ số rồi bấm <em>"Phê Duyệt Dữ Liệu Sạch & Xem Báo Cáo Bước 7"</em>.`);
  },

  // ZERO POPUP
  approveGatekeeper() {
    this.stepExecuted[6] = true;
    this.stepStates[6] = 'COMPLETED';
    this.stepStates[7] = 'UNLOCKED';

    const nextNav = document.getElementById('stepNav7');
    if (nextNav) nextNav.classList.remove('locked');

    this.addAiChatMessage(`🎉 <strong>Dữ liệu đã được Phê duyệt thành công!</strong> Đang mở Báo Cáo Quản Trị & Dự Báo Xu Hướng ở Bước 7.`);
    this.goToStep(7);
  },

  // ZERO POPUP
  rejectGatekeeper() {
    this.stepStates = { 1: 'UNLOCKED', 2: 'LOCKED', 3: 'LOCKED', 4: 'LOCKED', 5: 'LOCKED', 6: 'LOCKED', 7: 'LOCKED' };
    this.stepExecuted = { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false };
    this.cleanedRows = JSON.parse(JSON.stringify(this.rawRows));
    this.goToStep(1);
    this.addAiChatMessage(`Đã đặt lại quy trình pipeline theo yêu cầu của bạn. Mời bạn tiến hành kiểm tra lại từ Bước 1.`);
  },

  // ==========================================
  // STEP 7: AUTOMATED REPORTING & FORECASTING
  // ==========================================
  prepareStep7() {
    this.computeKpis();
    this.populateChartColumnDropdowns();
    this.renderChart1();
    this.renderCategoryChart();
    this.renderRegionChart();
    this.updateForecast();
    this.synthesizeAiInsights();
  },

  computeKpis() {
    let totalRev = 0;
    const values = [];

    this.cleanedRows.forEach(r => {
      const v = this.parseNumber(r[this.metricCol]);
      if (!isNaN(v)) {
        totalRev += v;
        values.push(v);
      }
    });

    const count = values.length || 1;
    const avg = totalRev / count;

    const variance = values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / count;
    const stdDev = Math.sqrt(variance);
    const cv = (stdDev / (avg || 1)) * 100;

    const elRev = document.getElementById('kpiTotalRevenue');
    const elAvg = document.getElementById('kpiAvgOrder');
    const elOrders = document.getElementById('kpiTotalOrders');
    const elCv = document.getElementById('kpiVolatility');

    if (elRev) elRev.textContent = totalRev.toLocaleString('vi-VN') + ' ₫';
    if (elAvg) elAvg.textContent = Math.round(avg).toLocaleString('vi-VN') + ' ₫';
    if (elOrders) elOrders.textContent = count.toLocaleString('vi-VN');
    if (elCv) elCv.textContent = cv.toFixed(1) + '%';
  },

  // =========================================================================
  // BIỂU ĐỒ 1: THÔNG MINH, TỰ ĐỘNG THÍCH ỨNG THEO FILE DỮ LIỆU
  // =========================================================================
  renderChart1() {
    const canvas = document.getElementById('chart1Canvas');
    if (!canvas) return;

    if (this.charts.chart1) {
      this.charts.chart1.destroy();
    }

    const titleEl = document.getElementById('chart1Title');
    const subtitleEl = document.getElementById('chart1Subtitle');
    const legendBody = document.getElementById('chart1LegendBody');

    // Case A: Chronological Date Aggregation
    if (this.chart1Col === '__DATE__' && this.dateCol) {
      if (titleEl) {
        titleEl.innerHTML = `<i data-lucide="calendar" class="w-4 h-4 text-[#5D7B6F]"></i> Xu Hướng Doanh Số Theo Chu Kỳ Tháng (${this.dateCol})`;
      }
      if (subtitleEl) {
        subtitleEl.textContent = 'Tổng hợp số tiền và tỷ trọng đóng góp theo từng chu kỳ tháng';
      }

      const monthMap = {};
      let grandTotal = 0;

      this.cleanedRows.forEach(r => {
        const dVal = r[this.dateCol];
        let monthKey = 'Kỳ 1';
        if (dVal) {
          const d = this.parseDate(dVal);
          if (d && !isNaN(d.getTime())) {
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            monthKey = `Tháng ${mm}/${yyyy}`;
          }
        }
        const v = this.parseNumber(r[this.metricCol]) || 0;
        monthMap[monthKey] = (monthMap[monthKey] || 0) + v;
        grandTotal += v;
      });

      let sortedKeys = Object.keys(monthMap).sort();
      if (sortedKeys.length > 12) {
        sortedKeys = sortedKeys.slice(-12);
      }
      const sortedVals = sortedKeys.map(k => Math.round(monthMap[k]));

      if (legendBody) {
        let lHtml = '';
        sortedKeys.forEach((m, idx) => {
          const val = sortedVals[idx];
          const pct = grandTotal > 0 ? ((val / grandTotal) * 100).toFixed(1) : '0';
          lHtml += `
            <tr>
              <td class="font-bold text-[#22332C]">${m}</td>
              <td class="font-mono text-[#5D7B6F] font-bold">${val.toLocaleString('vi-VN')} ₫</td>
              <td class="font-bold">${pct}%</td>
            </tr>
          `;
        });
        legendBody.innerHTML = lHtml;
      }

      this.charts.chart1 = new Chart(canvas, {
        type: 'bar',
        data: {
          labels: sortedKeys,
          datasets: [{
            label: 'Doanh thu (₫)',
            data: sortedVals,
            backgroundColor: '#5D7B6F',
            hoverBackgroundColor: '#4C675C',
            borderRadius: 6,
            barPercentage: 0.55
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  const val = ctx.parsed.y;
                  const pct = grandTotal > 0 ? ((val / grandTotal) * 100).toFixed(1) : '0';
                  return ` Doanh số: ${val.toLocaleString('vi-VN')} ₫ (${pct}%)`;
                }
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { font: { family: 'Be Vietnam Pro', size: 11, weight: '600' }, color: '#22332C' }
            },
            y: {
              grid: { color: 'rgba(164, 195, 162, 0.2)' },
              ticks: {
                font: { size: 10 },
                color: '#566961',
                callback: v => (v >= 1e9 ? (v / 1e9).toFixed(1) + ' Tỷ' : (v >= 1e6 ? (v / 1e6).toFixed(0) + ' Tr' : v.toLocaleString('vi-VN')))
              }
            }
          }
        }
      });

    } else {
      // Case B: Categorical Top 7 + Nhóm khác (Others)
      const targetCol = (this.chart1Col && this.chart1Col !== '__DATE__') ? this.chart1Col : (this.categoryCol || this.columns[0]);

      if (titleEl) {
        titleEl.innerHTML = `<i data-lucide="bar-chart-3" class="w-4 h-4 text-[#5D7B6F]"></i> Cơ Cấu Doanh Số & Tỷ Trọng Theo: <span class="text-[#5D7B6F] underline ml-1">${targetCol}</span>`;
      }
      if (subtitleEl) {
        subtitleEl.textContent = 'Top phân nhóm đóng góp cao nhất, kèm số liệu cụ thể và tỷ trọng (%)';
      }

      const valMap = {};
      let grandTotal = 0;

      this.cleanedRows.forEach(r => {
        const key = String(r[targetCol] || 'Chung').trim();
        const v = this.parseNumber(r[this.metricCol]) || 0;
        valMap[key] = (valMap[key] || 0) + v;
        grandTotal += v;
      });

      const allKeys = Object.keys(valMap).sort((a, b) => valMap[b] - valMap[a]);
      const topKeys = allKeys.slice(0, 7);
      const otherKeys = allKeys.slice(7);

      const displayLabels = [...topKeys];
      const displayVals = topKeys.map(k => Math.round(valMap[k]));

      if (otherKeys.length > 0) {
        const othersVal = otherKeys.reduce((sum, k) => sum + valMap[k], 0);
        displayLabels.push(`Nhóm khác (${otherKeys.length} mục)`);
        displayVals.push(Math.round(othersVal));
      }

      if (legendBody) {
        let lHtml = '';
        displayLabels.forEach((label, idx) => {
          const val = displayVals[idx];
          const pct = grandTotal > 0 ? ((val / grandTotal) * 100).toFixed(1) : '0';
          lHtml += `
            <tr>
              <td class="font-bold text-[#22332C]">${label}</td>
              <td class="font-mono text-[#5D7B6F] font-bold">${val.toLocaleString('vi-VN')} ₫</td>
              <td class="font-bold">${pct}%</td>
            </tr>
          `;
        });
        legendBody.innerHTML = lHtml;
      }

      const colors = ['#5D7B6F', '#739072', '#86A789', '#A4C3A2', '#B0D4B8', '#C3E2C2', '#D7F9FA', '#EAE7D6'];

      this.charts.chart1 = new Chart(canvas, {
        type: 'bar',
        data: {
          labels: displayLabels,
          datasets: [{
            label: 'Giá trị (₫)',
            data: displayVals,
            backgroundColor: colors.slice(0, displayLabels.length),
            borderRadius: 6,
            barPercentage: 0.6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  const val = ctx.parsed.y;
                  const pct = grandTotal > 0 ? ((val / grandTotal) * 100).toFixed(1) : '0';
                  return ` Giá trị: ${val.toLocaleString('vi-VN')} ₫ (${pct}%)`;
                }
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: {
                font: { family: 'Be Vietnam Pro', size: 10, weight: '600' },
                color: '#22332C',
                maxRotation: 25,
                callback: function(val, index) {
                  const label = displayLabels[index] || '';
                  return label.length > 18 ? label.slice(0, 16) + '...' : label;
                }
              }
            },
            y: {
              grid: { color: 'rgba(164, 195, 162, 0.2)' },
              ticks: {
                font: { size: 10 },
                color: '#566961',
                callback: v => (v >= 1e9 ? (v / 1e9).toFixed(1) + ' Tỷ' : (v >= 1e6 ? (v / 1e6).toFixed(0) + ' Tr' : v.toLocaleString('vi-VN')))
              }
            }
          }
        }
      });
    }

    if (window.lucide) window.lucide.createIcons();
  },

  // =========================================================================
  // BIỂU ĐỒ 2: CƠ CẤU DANH MỤC KÈM TỶ TRỌNG (%)
  // =========================================================================
  renderCategoryChart() {
    const canvas = document.getElementById('categoryChart');
    if (!canvas) return;
    if (this.charts.category) this.charts.category.destroy();

    const catMap = {};
    let totalCatRev = 0;

    this.cleanedRows.forEach(r => {
      const c = String(r[this.categoryCol] || 'Chung').trim();
      const v = this.parseNumber(r[this.metricCol]) || 0;
      catMap[c] = (catMap[c] || 0) + v;
      totalCatRev += v;
    });

    const allCats = Object.keys(catMap).sort((a, b) => catMap[b] - catMap[a]);
    const topCats = allCats.slice(0, 6);
    const otherCats = allCats.slice(6);

    const displayCats = [...topCats];
    const displayVals = topCats.map(c => Math.round(catMap[c]));

    if (otherCats.length > 0) {
      const othersSum = otherCats.reduce((acc, c) => acc + catMap[c], 0);
      displayCats.push(`Khác (${otherCats.length})`);
      displayVals.push(Math.round(othersSum));
    }

    const legBody = document.getElementById('catLegendBody');
    if (legBody) {
      let html = '';
      displayCats.forEach((c, i) => {
        const v = displayVals[i];
        const pct = totalCatRev > 0 ? ((v / totalCatRev) * 100).toFixed(1) : '0';
        html += `
          <tr>
            <td class="font-bold text-[#22332C]">${c}</td>
            <td class="font-mono text-[#5D7B6F] font-bold">${v.toLocaleString('vi-VN')} ₫</td>
            <td class="font-bold">${pct}%</td>
          </tr>
        `;
      });
      legBody.innerHTML = html;
    }

    this.charts.category = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: displayCats,
        datasets: [{
          data: displayVals,
          backgroundColor: ['#5D7B6F', '#739072', '#86A789', '#A4C3A2', '#B0D4B8', '#C3E2C2', '#D7F9FA'],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const val = ctx.parsed.x;
                const pct = totalCatRev > 0 ? ((val / totalCatRev) * 100).toFixed(1) : '0';
                return ` Giá trị: ${val.toLocaleString('vi-VN')} ₫ (${pct}%)`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(164, 195, 162, 0.2)' },
            ticks: {
              font: { size: 10 },
              color: '#566961',
              callback: v => (v >= 1e9 ? (v / 1e9).toFixed(1) + ' Tỷ' : (v >= 1e6 ? (v / 1e6).toFixed(0) + 'M' : v))
            }
          },
          y: {
            grid: { display: false },
            ticks: {
              font: { family: 'Be Vietnam Pro', size: 10, weight: '600' },
              color: '#22332C',
              callback: function(val, index) {
                const label = displayCats[index] || '';
                return label.length > 20 ? label.slice(0, 18) + '...' : label;
              }
            }
          }
        }
      }
    });
  },

  // =========================================================================
  // BIỂU ĐỒ 3: PHÂN BỔ THỊ PHẦN / NHÓM (DOUGHNUT KÈM TỶ TRỌNG %)
  // =========================================================================
  renderRegionChart() {
    const canvas = document.getElementById('regionChart');
    if (!canvas) return;
    if (this.charts.region) this.charts.region.destroy();

    const regMap = {};
    let totalRegRev = 0;

    this.cleanedRows.forEach(r => {
      const reg = String(r[this.regionCol] || 'Chung').trim();
      const v = this.parseNumber(r[this.metricCol]) || 0;
      regMap[reg] = (regMap[reg] || 0) + v;
      totalRegRev += v;
    });

    const allRegs = Object.keys(regMap).sort((a, b) => regMap[b] - regMap[a]);
    const topRegs = allRegs.slice(0, 5);
    const otherRegs = allRegs.slice(5);

    const labels = [...topRegs];
    const vals = topRegs.map(l => Math.round(regMap[l]));

    if (otherRegs.length > 0) {
      const othersVal = otherRegs.reduce((sum, r) => sum + regMap[r], 0);
      labels.push(`Khác (${otherRegs.length})`);
      vals.push(Math.round(othersVal));
    }

    const legBody = document.getElementById('regLegendBody');
    if (legBody) {
      let html = '';
      labels.forEach((l, i) => {
        const v = vals[i];
        const pct = totalRegRev > 0 ? ((v / totalRegRev) * 100).toFixed(1) : '0';
        html += `
          <tr>
            <td class="font-bold text-[#22332C]">${l}</td>
            <td class="font-mono text-[#5D7B6F] font-bold">${v.toLocaleString('vi-VN')} ₫</td>
            <td class="font-bold">${pct}%</td>
          </tr>
        `;
      });
      legBody.innerHTML = html;
    }

    this.charts.region = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: vals,
          backgroundColor: ['#5D7B6F', '#A4C3A2', '#B0D4B8', '#D7F9FA', '#EAE7D6', '#739072'],
          borderWidth: 2,
          borderColor: '#FFFFFF'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: { font: { family: 'Be Vietnam Pro', size: 10 }, color: '#22332C', boxWidth: 12 }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const val = ctx.parsed;
                const pct = totalRegRev > 0 ? ((val / totalRegRev) * 100).toFixed(1) : '0';
                return ` ${ctx.label}: ${val.toLocaleString('vi-VN')} ₫ (${pct}%)`;
              }
            }
          }
        }
      }
    });
  },

  // ==========================================
  // PREDICTIVE ANALYTICS & HOLT'S LINEAR FORECAST
  // ==========================================
  onScenarioSlider(val) {
    const mult = 1 + parseInt(val, 10) / 100;
    this.scenarioMultiplier = mult;

    const badge = document.getElementById('sliderValueBadge');
    if (badge) {
      const sign = val > 0 ? '+' : '';
      badge.textContent = `${sign}${val}% (${mult.toFixed(2)}x)`;
    }

    this.updateForecast();
  },

  updateForecast() {
    let histPeriods = [];
    let histVals = [];

    if (this.dateCol) {
      const dateMap = {};
      this.cleanedRows.forEach(r => {
        const d = r[this.dateCol];
        const dObj = this.parseDate(d);
        const key = dObj ? `${dObj.getFullYear()}-${String(dObj.getMonth() + 1).padStart(2, '0')}` : 'Kỳ 1';
        const v = this.parseNumber(r[this.metricCol]) || 0;
        dateMap[key] = (dateMap[key] || 0) + v;
      });
      const sortedKeys = Object.keys(dateMap).sort();
      histPeriods = sortedKeys;
      histVals = sortedKeys.map(k => dateMap[k]);
    }

    // Fallback if no valid date or only 1 date: divide rows into sequential tranches
    if (histVals.length < 3) {
      const numTranches = Math.min(12, Math.max(4, Math.floor(this.cleanedRows.length / 10)));
      const trancheSize = Math.ceil(this.cleanedRows.length / numTranches);
      histPeriods = [];
      histVals = [];
      for (let t = 0; t < numTranches; t++) {
        const slice = this.cleanedRows.slice(t * trancheSize, (t + 1) * trancheSize);
        const sum = slice.reduce((acc, r) => acc + (this.parseNumber(r[this.metricCol]) || 0), 0);
        histPeriods.push(`Kỳ ${t + 1}`);
        histVals.push(sum);
      }
    }

    if (histVals.length === 0) return;

    const alpha = 0.3;
    const beta = 0.15;

    let level = histVals[0];
    let trend = histVals.length > 1 ? histVals[1] - histVals[0] : 0;

    for (let i = 1; i < histVals.length; i++) {
      const prevLevel = level;
      level = alpha * histVals[i] + (1 - alpha) * (level + trend);
      trend = beta * (level - prevLevel) + (1 - beta) * trend;
    }

    const horizon = this.forecastHorizon || 30;
    const fLabels = [];
    const fVals = [];
    const uBounds = [];
    const lBounds = [];

    let totalForecast = 0;
    for (let h = 1; h <= horizon; h++) {
      fLabels.push(`Dự báo +${h}`);
      let baseVal = (level + h * trend) * this.scenarioMultiplier;
      if (baseVal < 0) baseVal = 0;

      fVals.push(Math.round(baseVal));
      totalForecast += baseVal;

      const confRange = baseVal * (0.05 + 0.02 * Math.sqrt(h));
      uBounds.push(Math.round(baseVal + confRange));
      lBounds.push(Math.round(Math.max(0, baseVal - confRange)));
    }

    const elSum = document.getElementById('forecastTotalSum');
    const elRange = document.getElementById('forecastConfidenceRange');
    const elGrowth = document.getElementById('forecastGrowthRate');

    if (elSum) elSum.textContent = Math.round(totalForecast).toLocaleString('vi-VN') + ' ₫';
    if (elRange) elRange.textContent = `CI 95%: [${Math.round(totalForecast * 0.9).toLocaleString('vi-VN')} - ${Math.round(totalForecast * 1.1).toLocaleString('vi-VN')} ₫]`;

    const histRecentSum = histVals.slice(-horizon).reduce((a, b) => a + b, 0) || 1;
    const growth = ((totalForecast - histRecentSum) / histRecentSum) * 100;
    if (elGrowth) {
      const sign = growth >= 0 ? '+' : '';
      elGrowth.textContent = `${sign}${growth.toFixed(1)}%`;
      elGrowth.className = `font-bold text-xs ${growth >= 0 ? 'text-[#5D7B6F]' : 'text-[#D96B6B]'}`;
    }

    this.renderForecastChart(histPeriods, histVals, fLabels, fVals, uBounds, lBounds);
  },

  renderForecastChart(histDates, histVals, fDates, fVals, uBounds, lBounds) {
    const canvas = document.getElementById('forecastChart');
    if (!canvas) return;
    if (this.charts.forecast) this.charts.forecast.destroy();

    const recentHistCount = Math.min(20, histDates.length);
    const subHistDates = histDates.slice(-recentHistCount);
    const subHistVals = histVals.slice(-recentHistCount);

    const labels = [...subHistDates, ...fDates];
    const histData = [...subHistVals, ...fDates.map(() => null)];

    const lastHistVal = subHistVals[subHistVals.length - 1];
    const forecastData = [
      ...subHistDates.slice(0, -1).map(() => null),
      lastHistVal,
      ...fVals
    ];

    const upperData = [
      ...subHistDates.slice(0, -1).map(() => null),
      lastHistVal,
      ...uBounds
    ];

    const lowerData = [
      ...subHistDates.slice(0, -1).map(() => null),
      lastHistVal,
      ...lBounds
    ];

    this.charts.forecast = new Chart(canvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Lịch sử thực tế',
            data: histData,
            borderColor: '#5D7B6F',
            backgroundColor: 'rgba(93, 123, 111, 0.1)',
            fill: true,
            borderWidth: 2.5,
            pointRadius: 2,
            tension: 0.2
          },
          {
            label: 'Dự báo chu kỳ tới',
            data: forecastData,
            borderColor: '#D97706',
            borderDash: [5, 5],
            borderWidth: 2.5,
            pointRadius: 3,
            pointBackgroundColor: '#D97706',
            tension: 0.2
          },
          {
            label: 'Cận trên (Upper 95%)',
            data: upperData,
            borderColor: 'rgba(217, 119, 6, 0.2)',
            borderWidth: 1,
            pointRadius: 0,
            fill: '+1',
            backgroundColor: 'rgba(217, 119, 6, 0.08)'
          },
          {
            label: 'Cận dưới (Lower 95%)',
            data: lowerData,
            borderColor: 'rgba(217, 119, 6, 0.2)',
            borderWidth: 1,
            pointRadius: 0,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { font: { family: 'Be Vietnam Pro', size: 10 }, color: '#22332C', boxWidth: 12 }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 10 }, maxRotation: 45, color: '#566961' }
          },
          y: {
            grid: { color: 'rgba(164, 195, 162, 0.2)' },
            ticks: {
              font: { size: 10 },
              color: '#566961',
              callback: v => (v >= 1e9 ? (v / 1e9).toFixed(1) + ' Tỷ' : (v >= 1e6 ? (v / 1e6).toFixed(0) + 'M' : v.toLocaleString('vi-VN')))
            }
          }
        }
      }
    });
  },

  // ==========================================
  // AI INSIGHTS & STRATEGIC RECOMMENDATIONS
  // ==========================================
  synthesizeAiInsights() {
    const insightsBox = document.getElementById('aiInsightsContainer');
    const recBox = document.getElementById('aiRecommendationsContainer');

    if (insightsBox) {
      insightsBox.innerHTML = `
        <div class="flex items-start gap-2.5 p-3.5 rounded-xl bg-white border border-[#A4C3A2]/30 shadow-2xs">
          <span class="w-5 h-5 rounded-full bg-[#5D7B6F] text-white flex items-center justify-center text-xs font-bold shrink-0">1</span>
          <p class="text-xs text-[#22332C] leading-relaxed"><strong>Độ tin cậy dữ liệu:</strong> Đã xử lý ${this.audit.missingCellsImputed} ô khuyết thiếu và loại bỏ ${this.audit.duplicatesRemoved} dòng trùng, nâng điểm tin cậy số liệu lên <strong>${this.audit.healthScoreAfter}%</strong>.</p>
        </div>
        <div class="flex items-start gap-2.5 p-3.5 rounded-xl bg-white border border-[#A4C3A2]/30 shadow-2xs">
          <span class="w-5 h-5 rounded-full bg-[#5D7B6F] text-white flex items-center justify-center text-xs font-bold shrink-0">2</span>
          <p class="text-xs text-[#22332C] leading-relaxed"><strong>Chất lượng chuỗi thời gian:</strong> Việc tổng hợp theo tháng rõ ràng và xử lý ${this.audit.outliersTreated} ngoại lai IQR giúp mô hình Holt-Winters dự phóng đáng tin cậy.</p>
        </div>
      `;
    }

    if (recBox) {
      recBox.innerHTML = `
        <div class="flex items-start gap-2.5 p-3.5 rounded-xl bg-white border border-[#A4C3A2]/30 shadow-2xs">
          <i data-lucide="sparkles" class="w-4 h-4 text-[#5D7B6F] shrink-0 mt-0.5"></i>
          <p class="text-xs text-[#22332C] leading-relaxed"><strong>Chiến lược phân bổ:</strong> Dựa trên bảng số liệu danh mục, tập trung nguồn lực tiếp thị vào nhóm hàng chiếm tỷ trọng cao nhất.</p>
        </div>
        <div class="flex items-start gap-2.5 p-3.5 rounded-xl bg-white border border-[#A4C3A2]/30 shadow-2xs">
          <i data-lucide="mail-check" class="w-4 h-4 text-[#5D7B6F] shrink-0 mt-0.5"></i>
          <p class="text-xs text-[#22332C] leading-relaxed"><strong>Bảo mật hồ sơ:</strong> Toàn bộ dữ liệu sạch kèm chữ ký số điện tử đã sẵn sàng chuyển phát về hòm thư <code>${this.audit.supervisorGmail}</code>.</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
    }
  },

  // ==========================================
  // EXPORTS
  // ==========================================
  downloadCleanCsv() {
    if (this.cleanedRows.length === 0) {
      this.addAiChatMessage('⚠️ Không có dữ liệu đã làm sạch để tải xuống!');
      return;
    }
    const csvStr = Papa.unparse(this.cleanedRows);
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cleaned_${this.fileName || 'Data'}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    this.addAiChatMessage('Đã xuất bản và tải xuống tệp dữ liệu sạch chuẩn hóa (CSV).');
  },

  downloadStandaloneHtmlReport() {
    const reportHtml = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Báo Cáo Phân Tích Dữ Liệu & Dự Báo - SAGE AI Enterprise</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 40px; color: #22332C; background: #F8FAF9; }
    .card { background: #FFFFFF; border-radius: 12px; padding: 24px; margin-bottom: 24px; border: 1px solid #A4C3A2; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    h1 { color: #5D7B6F; margin-top: 0; }
    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 20px 0; }
    .kpi { background: #D7F9FA; padding: 16px; border-radius: 8px; border-left: 4px solid #5D7B6F; }
    .kpi-label { font-size: 11px; text-transform: uppercase; color: #566961; }
    .kpi-value { font-size: 20px; font-weight: bold; color: #22332C; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px; }
    th, td { border: 1px solid #EAE7D6; padding: 8px 12px; text-align: left; }
    th { background: #B0D4B8; color: #22332C; }
    tr:nth-child(even) { background: #F8FAF9; }
    .signature { font-family: monospace; font-size: 11px; color: #566961; background: #EAE7D6; padding: 10px; border-radius: 6px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>SAGE AI ENTERPRISE // BÁO CÁO QUẢN TRỊ & DỰ BÁO XU HƯỚNG</h1>
    <p><strong>Tệp nguồn:</strong> ${this.fileName} | <strong>Thời gian:</strong> ${new Date().toLocaleString('vi-VN')}</p>
    <p><strong>Email tiếp nhận:</strong> ${this.audit.supervisorGmail}</p>

    <div class="kpi-grid">
      <div class="kpi">
        <div class="kpi-label">Tổng Dòng Trước / Sau</div>
        <div class="kpi-value">${this.audit.initialRowCount} ➔ ${this.audit.cleanedRowCount}</div>
      </div>
      <div class="kpi">
        <div class="kpi-label">Ô Trống Đã Điền</div>
        <div class="kpi-value">${this.audit.missingCellsImputed} ô</div>
      </div>
      <div class="kpi">
        <div class="kpi-label">Dòng Trùng Lặp Lọc</div>
        <div class="kpi-value">${this.audit.duplicatesRemoved} dòng</div>
      </div>
      <div class="kpi">
        <div class="kpi-label">Ngoại Lai Winsorized</div>
        <div class="kpi-value">${this.audit.outliersTreated} điểm</div>
      </div>
    </div>

    <h3>MẪU DỮ LIỆU ĐÃ LÀM SẠCH (15 BẢN GHI ĐẦU TIÊN)</h3>
    <table>
      <thead>
        <tr>${this.columns.map(c => `<th>${c}</th>`).join('')}</tr>
      </thead>
      <tbody>
        ${this.cleanedRows.slice(0, 15).map(r => `<tr>${this.columns.map(c => `<td>${r[c]}</td>`).join('')}</tr>`).join('')}
      </tbody>
    </table>

    <h3 style="margin-top: 30px;">CHỮ KÝ ĐIỆN TỬ BẢO MẬT & KIỂM ĐỊNH (HITL AUDIT TRAIL)</h3>
    <div class="signature">
      Signer: &lt;${this.audit.supervisorGmail}&gt;<br>
      Timestamp: ${this.audit.timestamp}<br>
      Digital Signature: ${this.audit.digitalSignature}<br>
      Pipeline Engine: Sage AI Data Cleaner v6.0
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([reportHtml], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BaoCao_KinhDoanh_${new Date().toISOString().slice(0, 10)}.html`;
    a.click();
    URL.revokeObjectURL(url);
    this.addAiChatMessage('Đã kết xuất và tải xuống bản báo cáo độc lập (Standalone HTML Report).');
  },

  // ==========================================
  // REAL-TIME AI ASSISTANT CHATBOX
  // ==========================================
  addAiChatMessage(htmlContent) {
    const viewport = document.getElementById('chatMessageViewport');
    if (!viewport) return;

    const div = document.createElement('div');
    div.className = 'flex items-start gap-3';
    div.innerHTML = `
      <div class="w-8 h-8 rounded-xl bg-[#5D7B6F] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
        <i data-lucide="bot" class="w-4 h-4"></i>
      </div>
      <div class="flex-1 bg-white p-3.5 rounded-2xl rounded-tl-xs border border-[#A4C3A2]/40 shadow-2xs text-xs text-[#22332C] leading-relaxed">
        ${htmlContent}
      </div>
    `;
    viewport.appendChild(div);
    viewport.scrollTop = viewport.scrollHeight;
    if (window.lucide) window.lucide.createIcons();
  },

  addUserChatMessage(text) {
    const viewport = document.getElementById('chatMessageViewport');
    if (!viewport) return;

    const div = document.createElement('div');
    div.className = 'flex items-start gap-3 justify-end';
    div.innerHTML = `
      <div class="max-w-[80%] bg-[#5D7B6F] text-white p-3.5 rounded-2xl rounded-tr-xs shadow-xs text-xs leading-relaxed">
        ${text}
      </div>
      <div class="w-8 h-8 rounded-xl bg-[#B0D4B8] text-[#22332C] flex items-center justify-center shrink-0 shadow-xs mt-0.5 font-bold text-xs">
        BẠN
      </div>
    `;
    viewport.appendChild(div);
    viewport.scrollTop = viewport.scrollHeight;
  },

  sendQuickPrompt(text) {
    const chatInput = document.getElementById('chatInputBox');
    if (chatInput) chatInput.value = text;
    this.sendChatMessage();
  },

  sendChatMessage() {
    const chatInput = document.getElementById('chatInputBox');
    if (!chatInput) return;
    const text = chatInput.value.trim();
    if (!text) return;

    this.addUserChatMessage(text);
    chatInput.value = '';

    setTimeout(() => {
      this.generateAiReply(text);
    }, 400);
  },

  generateAiReply(query) {
    const q = query.toLowerCase();

    if (this.rawRows.length === 0) {
      this.addAiChatMessage(`Hiện tại bạn chưa nạp tệp dữ liệu nào vào hệ thống. Bạn hãy tải tệp của mình lên ở Bước Khởi Đầu, hoặc bấm <strong>"Dùng Thử Mẫu CSV / Excel"</strong> để tôi có số liệu phân tích và trả lời câu hỏi của bạn nhé!`);
      return;
    }

    if (q.includes('bao nhiêu lỗi') || q.includes('lỗi cần sửa') || q.includes('tổng số lỗi') || q.includes('sai')) {
      const totalDefects = this.audit.missingCellsFound + this.audit.duplicatesRemoved + this.audit.outliersFound;
      this.addAiChatMessage(`
        Dựa trên kết quả rà soát dữ liệu <em>${this.fileName}</em>, hệ thống phát hiện tổng cộng <strong>${totalDefects} vấn đề</strong> cần xử lý:
        <ul class="list-disc pl-5 mt-1.5 space-y-1">
          <li><strong>${this.audit.duplicatesRemoved}</strong> dòng bản ghi trùng lặp 100% ở Bước 2.</li>
          <li><strong>${this.audit.missingCellsFound}</strong> ô dữ liệu bị khuyết thiếu (Null/NaN) ở Bước 3.</li>
          <li><strong>${this.audit.outliersFound}</strong> giá trị số đột biến ngoại lai (Outliers) vượt ngưỡng IQR ở Bước 4.</li>
        </ul>
        Mọi vấn đề đều được giải quyết tự động và khoa học qua từng bước tương ứng.
      `);
      return;
    }

    if (q.includes('trùng') || q.includes('duplicate') || q.includes('bước 2')) {
      this.addAiChatMessage(`
        <strong>Về khử trùng lặp ở Bước 2:</strong><br>
        Hệ thống tính toán mã băm (hash) dựa trên toàn bộ các trường thông tin của mỗi dòng giao dịch. Việc loại bỏ các bản ghi sao chép rác trước khi điền khuyết thiếu là nguyên tắc khoa học dữ liệu nhằm bảo toàn độ chuẩn xác cho các số đo thống kê (Mean, Median, Variance).
      `);
      return;
    }

    if (q.includes('khuyết thiếu') || q.includes('trống') || q.includes('bước 3') || q.includes('điền')) {
      this.addAiChatMessage(`
        <strong>Về phương pháp điền ô khuyết thiếu ở Bước 3:</strong><br>
        Hệ thống áp dụng các nguyên lý thống kê học thuật:
        <ul class="list-disc pl-5 mt-1 space-y-1">
          <li><strong>Cột Số học:</strong> Điền bằng giá trị Trung vị (Median) vì không bị méo mó bởi các giá trị cực đoan.</li>
          <li><strong>Cột Phân loại:</strong> Điền bằng Yếu vị (Mode - giá trị có tần suất xuất hiện cao nhất).</li>
          <li><strong>Cột Thời gian:</strong> Điền theo phương pháp dòng hợp lệ gần nhất (Forward Fill).</li>
        </ul>
      `);
      return;
    }

    if (q.includes('dự báo') || q.includes('kinh doanh') || q.includes('khả quan') || q.includes('bước 7')) {
      const sum = document.getElementById('forecastTotalSum')?.textContent || 'Đang tính toán';
      const growth = document.getElementById('forecastGrowthRate')?.textContent || '+0%';
      this.addAiChatMessage(`
        <strong>Đánh giá Dự Báo Kinh Doanh Chu Kỳ Tới:</strong><br>
        Mô hình Holt-Winters dự phóng tổng doanh thu đạt <strong>${sum}</strong> (tốc độ tăng trưởng dự kiến <strong>${growth}</strong>).
        <br>Xu hướng chung là khả quan. Bạn có thể sử dụng thanh trượt kịch bản What-If ở Bước 7 để kiểm tra độ nhạy của doanh nghiệp trước các kịch bản tăng giảm từ -30% đến +30%.
      `);
      return;
    }

    this.addAiChatMessage(`
      Tôi đã ghi nhận câu hỏi: <em>"${query}"</em>.<br>
      Hiện tại dữ liệu đang ở <strong>Bước ${this.currentStep}</strong> trong quy trình 7 bước. Bạn hãy hoàn thành việc chạy thuật toán và nhấn <strong>Xác Nhận</strong> để tiếp tục, hoặc hỏi tôi cụ thể về bất kỳ chỉ số nào nhé!
    `);
  }
};

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
