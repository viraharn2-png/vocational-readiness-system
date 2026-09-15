/**
 * Vocational Student Work Readiness System (V-WRS 2567)
 * Core Application Engine
 */

// Application State
const AppState = {
  profile: {
    fullName: "นายอาชีวะ มุ่งมั่น",
    studentId: "66201010099",
    level: "voc_cert",
    gradeYear: "ปวช. 3 (เตรียมฝึกงาน/จบการศึกษา)",
    departmentId: "industrial",
    major: "สาขาวิชาช่างไฟฟ้ากำลัง (Electrical Power)",
    college: "วิทยาลัยเทคนิคอาชีวศึกษา",
    evaluatorRole: "student", // student, teacher, enterprise
    evaluatorName: "ผู้เรียนประเมินตนเอง",
    evalDate: new Date().toISOString().split("T")[0]
  },
  scores: {},
  benchmarks: {
    eth_1: 4, eth_2: 4, eth_3: 4, eth_4: 3,
    kno_1: 4, kno_2: 3, kno_3: 4, kno_4: 3,
    skl_1: 4, skl_2: 3, skl_3: 4, skl_4: 3,
    aut_1: 4, aut_2: 3, aut_3: 3, aut_4: 4
  },
  chartInstances: {
    radar: null,
    bar: null
  }
};

// Initialize application on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  initDepartmentsDropdown();
  initFormInputs();
  renderAssessmentForm();
  loadSavedState();
  bindEventHandlers();
  updateCalculations();
});

// Setup department and major cascading dropdowns
function initDepartmentsDropdown() {
  const deptSelect = document.getElementById("departmentSelect");
  const majorSelect = document.getElementById("majorSelect");
  if (!deptSelect || !majorSelect) return;

  deptSelect.innerHTML = "";
  CURRICULUM_DATA.departments.forEach((dept) => {
    const opt = document.createElement("option");
    opt.value = dept.id;
    opt.textContent = dept.name;
    deptSelect.appendChild(opt);
  });

  deptSelect.addEventListener("change", () => {
    updateMajorsDropdown(deptSelect.value);
  });

  // Populate initial majors
  updateMajorsDropdown(CURRICULUM_DATA.departments[0].id);
}

function updateMajorsDropdown(deptId) {
  const majorSelect = document.getElementById("majorSelect");
  if (!majorSelect) return;

  majorSelect.innerHTML = "";
  const dept = CURRICULUM_DATA.departments.find(d => d.id === deptId) || CURRICULUM_DATA.departments[0];
  dept.majors.forEach((m) => {
    const opt = document.createElement("option");
    opt.value = m;
    opt.textContent = m;
    majorSelect.appendChild(opt);
  });
}

// Bind top-level profile inputs to state
function initFormInputs() {
  const fields = ["fullName", "studentId", "level", "gradeYear", "college", "evaluatorRole", "evaluatorName", "evalDate"];
  fields.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", (e) => {
        AppState.profile[id] = e.target.value;
        saveState();
        updateReportHeader();
      });
    }
  });

  const deptSelect = document.getElementById("departmentSelect");
  const majorSelect = document.getElementById("majorSelect");
  if (deptSelect) {
    deptSelect.addEventListener("change", (e) => {
      AppState.profile.departmentId = e.target.value;
      saveState();
      updateReportHeader();
    });
  }
  if (majorSelect) {
    majorSelect.addEventListener("change", (e) => {
      AppState.profile.major = e.target.value;
      saveState();
      updateReportHeader();
    });
  }
}

// Render the 4 dimensions & 16 indicator cards
function renderAssessmentForm() {
  const container = document.getElementById("assessmentContainer");
  if (!container) return;

  container.innerHTML = "";

  CURRICULUM_DATA.dimensions.forEach((dim, dimIdx) => {
    const dimCard = document.createElement("div");
    dimCard.className = "bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8 transition-all hover:shadow-md";

    // Dimension Header
    dimCard.innerHTML = `
      <div class="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm" style="background-color: ${dim.color};">
            ${dimIdx + 1}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full ${dim.badgeColor}">
                ${dim.code}
              </span>
              <h3 class="text-lg font-bold text-slate-800 font-heading">${dim.title}</h3>
            </div>
            <p class="text-xs text-slate-500 mt-0.5">${dim.description}</p>
          </div>
        </div>
        <div class="text-right">
          <span id="dimScore_${dim.id}" class="text-sm font-semibold px-3 py-1 rounded-lg bg-slate-100 text-slate-700">
            เฉลี่ย: 0.00 / 5.00
          </span>
        </div>
      </div>
      <div class="p-6 divide-y divide-slate-100" id="dimIndicators_${dim.id}">
      </div>
    `;

    container.appendChild(dimCard);
    const indicatorsContainer = dimCard.querySelector(`#dimIndicators_${dim.id}`);

    // Render each indicator inside dimension
    dim.indicators.forEach((ind) => {
      const indRow = document.createElement("div");
      indRow.className = "py-5 first:pt-0 last:pb-0";
      indRow.id = `indicator_wrapper_${ind.id}`;

      indRow.innerHTML = `
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div class="lg:w-7/12">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">${ind.code}</span>
              <h4 class="text-base font-semibold text-slate-800">${ind.name}</h4>
            </div>
            <p class="text-xs text-slate-500">${ind.description}</p>
            <div id="rubric_hint_${ind.id}" class="mt-2 text-xs p-2 rounded-lg bg-blue-50 text-blue-800 border border-blue-100 transition-all">
              <span class="font-semibold">เกณฑ์ระดับ:</span> <span class="rubric-text">กรุณาเลือกระดับคะแนน 1 - 5</span>
            </div>
          </div>
          <div class="lg:w-5/12 flex items-center justify-start lg:justify-end gap-1.5 sm:gap-2">
            ${[1, 2, 3, 4, 5].map(score => `
              <label class="rating-pill flex-1 max-w-[65px] text-center cursor-pointer">
                <input type="radio" name="score_${ind.id}" value="${score}" class="rating-input sr-only" data-indicator="${ind.id}" />
                <div class="rating-label py-2 px-1 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs font-medium hover:bg-slate-100 transition-all flex flex-col items-center justify-center gap-0.5">
                  <span class="text-sm font-bold">${score}</span>
                  <span class="text-[10px] text-slate-400 rating-desc">${getScoreShortDesc(score)}</span>
                </div>
              </label>
            `).join("")}
          </div>
        </div>
      `;

      indicatorsContainer.appendChild(indRow);

      // Bind radio inputs
      const radios = indRow.querySelectorAll(`input[name="score_${ind.id}"]`);
      radios.forEach((r) => {
        r.addEventListener("change", (e) => {
          const val = parseInt(e.target.value, 10);
          AppState.scores[ind.id] = val;
          updateRubricHint(ind.id, val, ind.rubrics[val]);
          saveState();
          updateCalculations();
        });
      });
    });
  });
}

function getScoreShortDesc(score) {
  switch (score) {
    case 1: return "ปรับปรุง";
    case 2: return "พอใช้";
    case 3: return "ปานกลาง";
    case 4: return "ดี";
    case 5: return "ยอดเยี่ยม";
    default: return "";
  }
}

function updateRubricHint(indicatorId, score, rubricText) {
  const hintEl = document.getElementById(`rubric_hint_${indicatorId}`);
  if (!hintEl) return;
  const textSpan = hintEl.querySelector(".rubric-text");
  if (textSpan) {
    textSpan.innerHTML = `<strong>ระดับ ${score} (${getScoreShortDesc(score)}):</strong> ${rubricText}`;
  }
}

// Calculate all metrics & update UI
function updateCalculations() {
  const totalIndicators = 16;
  const answeredCount = Object.keys(AppState.scores).length;
  const progressPct = Math.round((answeredCount / totalIndicators) * 100);

  // Update progress bar
  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");
  if (progressBar) progressBar.style.width = `${progressPct}%`;
  if (progressText) progressText.textContent = `${answeredCount}/${totalIndicators} ตัวชี้วัด (${progressPct}%)`;

  // Calculate per-dimension averages
  const dimResults = {};
  let totalScoreSum = 0;

  CURRICULUM_DATA.dimensions.forEach((dim) => {
    let dimSum = 0;
    let dimAnswered = 0;
    dim.indicators.forEach((ind) => {
      if (AppState.scores[ind.id]) {
        dimSum += AppState.scores[ind.id];
        dimAnswered++;
      }
    });

    const dimAvg = dimAnswered > 0 ? (dimSum / dimAnswered) : 0;
    const dimPct = (dimAvg / 5) * 100;
    dimResults[dim.id] = { avg: dimAvg, pct: dimPct, count: dimAnswered };
    totalScoreSum += dimAvg;

    // Update dimension header badge
    const badge = document.getElementById(`dimScore_${dim.id}`);
    if (badge) {
      badge.textContent = `เฉลี่ย: ${dimAvg.toFixed(2)} / 5.00 (${dimPct.toFixed(1)}%)`;
      badge.className = `text-xs font-semibold px-2.5 py-1 rounded-lg ${
        dimPct >= 85 ? "bg-emerald-100 text-emerald-800" :
        dimPct >= 70 ? "bg-blue-100 text-blue-800" :
        dimPct >= 55 ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-700"
      }`;
    }
  });

  const overallAvg = totalScoreSum / CURRICULUM_DATA.dimensions.length;
  const overallPct = (overallAvg / 5) * 100;

  // Determine Readiness Tier
  let tier = CURRICULUM_DATA.readinessTiers.find(t => overallPct >= t.minScore && overallPct <= t.maxScore);
  if (!tier) tier = CURRICULUM_DATA.readinessTiers[CURRICULUM_DATA.readinessTiers.length - 1];

  // Update Dashboard elements
  updateDashboardUI(overallAvg, overallPct, tier, dimResults);
  updateCharts(dimResults);
  updateGapAnalysis();
  updatePassportUI(overallAvg, overallPct, tier, dimResults);
}

function updateDashboardUI(overallAvg, overallPct, tier, dimResults) {
  const scoreDisplay = document.getElementById("overallScoreDisplay");
  const pctDisplay = document.getElementById("overallPctDisplay");
  const tierBadge = document.getElementById("tierBadgeDisplay");
  const tierDesc = document.getElementById("tierDescDisplay");
  const tierRec = document.getElementById("tierRecDisplay");

  if (scoreDisplay) scoreDisplay.textContent = overallAvg.toFixed(2);
  if (pctDisplay) pctDisplay.textContent = `${overallPct.toFixed(1)}%`;
  
  if (tierBadge) {
    tierBadge.textContent = tier.name;
    tierBadge.className = `inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${tier.bgClass}`;
  }
  if (tierDesc) tierDesc.textContent = tier.description;
  if (tierRec) tierRec.textContent = tier.recommendation;

  // Update Dimension summary cards
  CURRICULUM_DATA.dimensions.forEach((dim) => {
    const res = dimResults[dim.id];
    const scoreEl = document.getElementById(`dashDimScore_${dim.id}`);
    const barEl = document.getElementById(`dashDimBar_${dim.id}`);
    if (scoreEl) scoreEl.textContent = `${res.pct.toFixed(1)}% (${res.avg.toFixed(2)}/5)`;
    if (barEl) barEl.style.width = `${res.pct}%`;
  });
}

// Generate Radar and Bar charts
function updateCharts(dimResults) {
  if (typeof Chart === "undefined") return;

  const labels = CURRICULUM_DATA.dimensions.map(d => d.title.replace("มิติที่ ", "มิติ "));
  const studentData = CURRICULUM_DATA.dimensions.map(d => dimResults[d.id]?.pct || 0);
  const benchmarkData = [80, 75, 80, 75]; // Standards benchmark for 2567 curriculum

  // 1. Radar Chart
  const radarCtx = document.getElementById("radarChart")?.getContext("2d");
  if (radarCtx) {
    if (AppState.chartInstances.radar) {
      AppState.chartInstances.radar.destroy();
    }
    AppState.chartInstances.radar = new Chart(radarCtx, {
      type: "radar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "ผลประเมินของผู้เรียน (Student Result)",
            data: studentData,
            backgroundColor: "rgba(37, 99, 235, 0.25)",
            borderColor: "#2563eb",
            borderWidth: 2.5,
            pointBackgroundColor: "#2563eb",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "#2563eb",
            pointRadius: 4
          },
          {
            label: "เกณฑ์มาตรฐานหลักสูตร 2567 (Curriculum Benchmark)",
            data: benchmarkData,
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            borderColor: "#10b981",
            borderWidth: 2,
            borderDash: [5, 5],
            pointBackgroundColor: "#10b981",
            pointRadius: 3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          r: {
            angleLines: { color: "#e2e8f0" },
            grid: { color: "#f1f5f9" },
            suggestedMin: 0,
            suggestedMax: 100,
            ticks: {
              stepSize: 20,
              backdropColor: "transparent",
              color: "#64748b",
              font: { size: 10 }
            },
            pointLabels: {
              font: { family: "'Sarabun', sans-serif", size: 11, weight: "600" },
              color: "#334155"
            }
          }
        },
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              font: { family: "'Sarabun', sans-serif", size: 12 },
              usePointStyle: true
            }
          }
        }
      }
    });
  }

  // 2. Bar Chart
  const barCtx = document.getElementById("barChart")?.getContext("2d");
  if (barCtx) {
    if (AppState.chartInstances.bar) {
      AppState.chartInstances.bar.destroy();
    }
    AppState.chartInstances.bar = new Chart(barCtx, {
      type: "bar",
      data: {
        labels: ["มิติ 1: คุณธรรม/วินัย", "มิติ 2: ความรู้/ทฤษฎี", "มิติ 3: ทักษะ/เครื่องมือ", "มิติ 4: ประยุกต์/ความพร้อม"],
        datasets: [
          {
            label: "คะแนนเฉลี่ยร้อยละ (%)",
            data: studentData,
            backgroundColor: ["#2563eb", "#059669", "#d97706", "#7c3aed"],
            borderRadius: 8,
            barThickness: 28
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              stepSize: 25,
              callback: (val) => `${val}%`,
              font: { size: 11 }
            },
            grid: { color: "#f1f5f9" }
          },
          x: {
            grid: { display: false },
            ticks: { font: { family: "'Sarabun', sans-serif", size: 11 } }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }
}

// Perform Competency Gap Analysis
function updateGapAnalysis() {
  const strengthsContainer = document.getElementById("strengthsList");
  const improvementsContainer = document.getElementById("improvementsList");
  if (!strengthsContainer || !improvementsContainer) return;

  // Flatten all indicators with their current score
  const indicatorList = [];
  CURRICULUM_DATA.dimensions.forEach((dim) => {
    dim.indicators.forEach((ind) => {
      const score = AppState.scores[ind.id] || 0;
      indicatorList.push({
        ...ind,
        dimensionTitle: dim.title,
        dimensionColor: dim.color,
        score: score
      });
    });
  });

  // Sort by score
  const answeredOnly = indicatorList.filter(i => i.score > 0);
  answeredOnly.sort((a, b) => b.score - a.score);

  const strengths = answeredOnly.filter(i => i.score >= 4).slice(0, 3);
  const needsImprovement = answeredOnly.filter(i => i.score <= 3).reverse().slice(0, 3);

  // Render Strengths
  strengthsContainer.innerHTML = strengths.length > 0 ? strengths.map(item => `
    <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
      <div class="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
        ${item.score}
      </div>
      <div>
        <h5 class="text-sm font-semibold text-emerald-950">${item.name}</h5>
        <p class="text-xs text-emerald-700 mt-0.5">${item.rubrics[item.score] || item.description}</p>
      </div>
    </div>
  `).join("") : `<p class="text-xs text-slate-400 italic">ยังไม่มีตัวชี้วัดที่ได้คะแนนระดับ 4-5</p>`;

  // Render Improvements with Roadmap Recommendation
  improvementsContainer.innerHTML = needsImprovement.length > 0 ? needsImprovement.map(item => {
    const course = CURRICULUM_DATA.remedialCourses[item.id] || "หลักสูตรเสริมสร้างทักษะวิชาชีพมาตรฐาน";
    return `
      <div class="p-3 bg-amber-50 border border-amber-200 rounded-xl">
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
            ${item.score}
          </div>
          <div class="flex-1">
            <h5 class="text-sm font-semibold text-amber-950">${item.name}</h5>
            <p class="text-xs text-amber-800 mt-0.5">${item.rubrics[item.score] || item.description}</p>
            <div class="mt-2 text-xs bg-white p-2 rounded-lg border border-amber-200 text-slate-700">
              <span class="font-bold text-amber-700">📌 แนะนำคอร์สอัปสกิล:</span> ${course}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("") : `<p class="text-xs text-slate-400 italic">ยอดเยี่ยม! ไม่มีตัวชี้วัดที่ต้องปรับปรุงเร่งด่วน</p>`;
}

// Update the Official Printable Work Readiness Passport
function updatePassportUI(overallAvg, overallPct, tier, dimResults) {
  const pName = document.getElementById("passStudentName");
  const pId = document.getElementById("passStudentId");
  const pLevel = document.getElementById("passLevel");
  const pMajor = document.getElementById("passMajor");
  const pCollege = document.getElementById("passCollege");
  const pDate = document.getElementById("passDate");
  const pScore = document.getElementById("passScore");
  const pPct = document.getElementById("passPct");
  const pTierBadge = document.getElementById("passTierBadge");
  const pVerdict = document.getElementById("passVerdict");
  const pTableBody = document.getElementById("passTableBody");

  if (pName) pName.textContent = AppState.profile.fullName || "-";
  if (pId) pId.textContent = AppState.profile.studentId || "-";
  if (pLevel) pLevel.textContent = AppState.profile.gradeYear || "-";
  if (pMajor) pMajor.textContent = AppState.profile.major || "-";
  if (pCollege) pCollege.textContent = AppState.profile.college || "-";
  if (pDate) pDate.textContent = formatDateTh(AppState.profile.evalDate);
  if (pScore) pScore.textContent = overallAvg.toFixed(2);
  if (pPct) pPct.textContent = `${overallPct.toFixed(1)}%`;

  if (pTierBadge) {
    pTierBadge.textContent = tier.name;
    pTierBadge.className = `px-3 py-1 text-xs font-bold rounded-full border ${tier.bgClass}`;
  }
  if (pVerdict) {
    pVerdict.textContent = tier.titleTh;
  }

  // Populate Passport Table
  if (pTableBody) {
    pTableBody.innerHTML = CURRICULUM_DATA.dimensions.map((dim, idx) => {
      const res = dimResults[dim.id];
      return `
        <tr class="border-b border-slate-200">
          <td class="py-2 px-3 font-semibold text-slate-800">${idx + 1}. ${dim.title}</td>
          <td class="py-2 px-3 text-center font-mono">${res.avg.toFixed(2)} / 5.00</td>
          <td class="py-2 px-3 text-center font-bold">${res.pct.toFixed(1)}%</td>
          <td class="py-2 px-3 text-center">
            <span class="inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
              res.pct >= 85 ? "bg-emerald-100 text-emerald-800" :
              res.pct >= 70 ? "bg-blue-100 text-blue-800" :
              res.pct >= 55 ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"
            }">
              ${res.pct >= 85 ? "ดีเยี่ยม" : res.pct >= 70 ? "พร้อมทำงาน" : res.pct >= 55 ? "มีพี่เลี้ยง" : "ปรับปรุง"}
            </span>
          </td>
        </tr>
      `;
    }).join("");
  }
}

function updateReportHeader() {
  const elHeaderName = document.getElementById("headerProfileName");
  if (elHeaderName) {
    elHeaderName.textContent = `${AppState.profile.fullName} | ${AppState.profile.major}`;
  }
}

function formatDateTh(dateStr) {
  if (!dateStr) return "-";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  const yearTh = parseInt(parts[0], 10) + 543;
  const monthsTh = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
  return `${parseInt(parts[2], 10)} ${monthsTh[parseInt(parts[1], 10) - 1]} พ.ศ. ${yearTh}`;
}

// Bind Global UI Buttons & Tabs
function bindEventHandlers() {
  // Tab Switcher
  const tabBtns = document.querySelectorAll(".tab-btn");
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabTarget = btn.dataset.tab;
      switchTab(tabTarget);
    });
  });

  // Sample Profile Loaders
  const sample1Btn = document.getElementById("loadSample1");
  const sample2Btn = document.getElementById("loadSample2");
  const sample3Btn = document.getElementById("loadSample3");

  if (sample1Btn) sample1Btn.addEventListener("click", () => loadSample(0));
  if (sample2Btn) sample2Btn.addEventListener("click", () => loadSample(1));
  if (sample3Btn) sample3Btn.addEventListener("click", () => loadSample(2));

  // Reset Button
  const resetBtn = document.getElementById("resetBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("คุณต้องการล้างข้อมูลการประเมินทั้งหมดเพื่อเริ่มใหม่ใช่หรือไม่?")) {
        AppState.scores = {};
        localStorage.removeItem("V_WRS_APP_STATE");
        renderAssessmentForm();
        updateCalculations();
        alert("ล้างข้อมูลเรียบร้อยแล้ว");
      }
    });
  }

  // Print PDF Button
  const printBtn = document.getElementById("printBtn");
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }

  // Export JSON
  const exportBtn = document.getElementById("exportJsonBtn");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(AppState, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `V-WRS_Assessment_${AppState.profile.studentId || "Data"}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });
  }
}

function switchTab(tabId) {
  document.querySelectorAll(".tab-btn").forEach(b => {
    if (b.dataset.tab === tabId) {
      b.classList.add("active", "border-blue-700", "text-blue-700");
      b.classList.remove("border-transparent", "text-slate-500");
    } else {
      b.classList.remove("active", "border-blue-700", "text-blue-700");
      b.classList.add("border-transparent", "text-slate-500");
    }
  });

  document.querySelectorAll(".tab-pane").forEach(p => {
    p.classList.remove("active");
  });

  const targetPane = document.getElementById(`${tabId}Tab`);
  if (targetPane) targetPane.classList.add("active");

  // Re-render chart if switching to dashboard
  if (tabId === "dashboard") {
    setTimeout(() => {
      updateCalculations();
    }, 100);
  }
}

function loadSample(idx) {
  const sample = CURRICULUM_DATA.sampleProfiles[idx];
  if (!sample) return;

  AppState.profile.fullName = sample.name;
  AppState.profile.studentId = sample.studentId;
  AppState.profile.level = sample.level;
  AppState.profile.gradeYear = sample.gradeYear;
  AppState.profile.departmentId = sample.department;
  AppState.profile.major = sample.major;
  AppState.profile.college = sample.college;
  AppState.scores = { ...sample.scores };

  // Sync inputs
  document.getElementById("fullName").value = sample.name;
  document.getElementById("studentId").value = sample.studentId;
  document.getElementById("level").value = sample.level;
  document.getElementById("gradeYear").value = sample.gradeYear;
  document.getElementById("departmentSelect").value = sample.department;
  updateMajorsDropdown(sample.department);
  document.getElementById("majorSelect").value = sample.major;
  document.getElementById("college").value = sample.college;

  // Sync radio selections in UI
  renderAssessmentForm();
  Object.keys(AppState.scores).forEach((indId) => {
    const scoreVal = AppState.scores[indId];
    const radio = document.querySelector(`input[name="score_${indId}"][value="${scoreVal}"]`);
    if (radio) {
      radio.checked = true;
      const indObj = findIndicator(indId);
      if (indObj) updateRubricHint(indId, scoreVal, indObj.rubrics[scoreVal]);
    }
  });

  saveState();
  updateCalculations();
  alert(`โหลดข้อมูลตัวอย่าง: ${sample.name} สำเร็จ!`);
}

function findIndicator(id) {
  for (const dim of CURRICULUM_DATA.dimensions) {
    const found = dim.indicators.find(i => i.id === id);
    if (found) return found;
  }
  return null;
}

// Local Storage Persistence
function saveState() {
  try {
    localStorage.setItem("V_WRS_APP_STATE", JSON.stringify(AppState));
  } catch (err) {
    console.warn("Could not save to localStorage", err);
  }
}

function loadSavedState() {
  try {
    const saved = localStorage.getItem("V_WRS_APP_STATE");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.profile) AppState.profile = { ...AppState.profile, ...parsed.profile };
      if (parsed.scores) AppState.scores = { ...parsed.scores };

      // Apply to inputs
      Object.keys(AppState.profile).forEach((k) => {
        const el = document.getElementById(k);
        if (el) el.value = AppState.profile[k];
      });

      if (AppState.profile.departmentId) {
        const deptEl = document.getElementById("departmentSelect");
        if (deptEl) {
          deptEl.value = AppState.profile.departmentId;
          updateMajorsDropdown(AppState.profile.departmentId);
        }
      }
      if (AppState.profile.major) {
        const majorEl = document.getElementById("majorSelect");
        if (majorEl) majorEl.value = AppState.profile.major;
      }

      // Check radios
      Object.keys(AppState.scores).forEach((indId) => {
        const scoreVal = AppState.scores[indId];
        const radio = document.querySelector(`input[name="score_${indId}"][value="${scoreVal}"]`);
        if (radio) {
          radio.checked = true;
          const indObj = findIndicator(indId);
          if (indObj) updateRubricHint(indId, scoreVal, indObj.rubrics[scoreVal]);
        }
      });
    } else {
      // Default to Sample 1
      loadSample(0);
    }
  } catch (err) {
    console.warn("Could not load from localStorage", err);
  }
}
