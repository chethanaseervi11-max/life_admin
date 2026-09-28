/**
 * LIFE ADMIN — Core Application Logic
 * "Life Admin — Put it somewhere you'll remember."
 */

(function () {
  'use strict';

  // =========================================================================
  // CONSTANTS & CATEGORY DEFINITIONS
  // =========================================================================
  const STORAGE_KEY_ITEMS = 'life_admin_items_v1';
  const STORAGE_KEY_THEME = 'life_admin_theme_v1';
  const STORAGE_KEY_WELCOME = 'life_admin_welcome_v1';

  const CATEGORIES = {
    documents: { label: 'Documents', emoji: '📄', icon: 'file-text' },
    education: { label: 'Education', emoji: '🎓', icon: 'graduation-cap' },
    payments: { label: 'Payments', emoji: '💳', icon: 'credit-card' },
    renewals: { label: 'Renewals', emoji: '🔄', icon: 'refresh-cw' },
    warranties: { label: 'Warranties', emoji: '🛠️', icon: 'wrench' },
    appointments: { label: 'Appointments', emoji: '📅', icon: 'calendar' },
    applications: { label: 'Applications', emoji: '📝', icon: 'clipboard-list' },
    events: { label: 'Events', emoji: '🎫', icon: 'ticket' },
    subscriptions: { label: 'Subscriptions', emoji: '📦', icon: 'package' },
    personal: { label: 'Personal', emoji: '🏠', icon: 'home' },
    other: { label: 'Other', emoji: '📌', icon: 'pin' }
  };

  // Keyword associations for automatic categorization
  const CATEGORY_KEYWORDS = {
    documents: ['passport', 'license', 'dl', 'visa', 'id card', 'certificate', 'pan card', 'aadhaar', 'tax', 'ssn', 'deed', 'will', 'citizenship'],
    education: ['scholarship', 'college', 'school', 'university', 'tuition', 'exam', 'assignment', 'homework', 'test', 'semester', 'course', 'grade', 'thesis', 'lecture'],
    payments: ['pay', 'bill', 'electric', 'electricity', 'water', 'rent', 'credit card', 'emi', 'invoice', 'fine', 'loan', 'mortgage', 'due payment', 'challan'],
    renewals: ['renew', 'renewal', 'expires', 'expire', 'expiration', 'reg renewal', 'domain'],
    warranties: ['warranty', 'guarantee', 'repair', 'ac service', 'car service', 'vehicle service', 'bike service', 'maintenance'],
    appointments: ['doctor', 'dentist', 'appointment', 'clinic', 'checkup', 'physician', 'vet', 'therapy', 'haircut', 'salon', 'meeting', 'consultation'],
    applications: ['application', 'apply', 'submit', 'submission', 'job application', 'visa application', 'grant', 'admission', 'form submission'],
    events: ['flight', 'ticket', 'concert', 'wedding', 'conference', 'party', 'movie', 'show', 'booking', 'reservation', 'hotel', 'trip'],
    subscriptions: ['netflix', 'spotify', 'amazon', 'prime', 'subscription', 'membership', 'gym', 'cancel', 'youtube premium', 'disney', 'hulu', 'apple tv'],
    personal: ['birthday', 'anniversary', 'family', 'call', 'gift', 'clean', 'home', 'groceries', 'mom', 'dad', 'brother', 'sister', 'friend']
  };

  // =========================================================================
  // STATE MANAGEMENT
  // =========================================================================
  let state = {
    items: [],
    theme: 'light',
    currentView: 'dashboard',
    activeFilter: 'all',
    selectedCategory: 'all',
    searchQuery: '',
    welcomeDismissed: false,
    pendingAdd: null, // Holds item data if date prompt modal is triggered
    lastCompletedItem: null, // For undo
    lastDeletedItem: null // For undo
  };

  // =========================================================================
  // DOM REFERENCES
  // =========================================================================
  const DOM = {
    // Navigation
    sidebarNavItems: document.querySelectorAll('.sidebar-nav .nav-item'),
    bottomNavItems: document.querySelectorAll('.bottom-nav-item'),
    viewPanels: document.querySelectorAll('.view-panel'),
    themeToggle: document.getElementById('theme-toggle'),
    themeIcon: document.getElementById('theme-icon'),
    mobileThemeToggle: document.getElementById('mobile-theme-toggle'),
    mobileThemeIcon: document.getElementById('mobile-theme-icon'),
    headerTodayDate: document.getElementById('header-today-date'),
    greetingHeading: document.getElementById('greeting-heading'),

    // Quick Add
    quickAddForm: document.getElementById('quick-add-form'),
    quickAddInput: document.getElementById('quick-add-input'),
    nlpLivePreview: document.getElementById('nlp-live-preview'),
    nlpPreviewDate: document.getElementById('nlp-preview-date'),
    nlpPreviewTime: document.getElementById('nlp-preview-time'),
    nlpPreviewCategory: document.getElementById('nlp-preview-category'),
    exampleChips: document.querySelectorAll('.example-chip'),
    welcomeBanner: document.getElementById('welcome-banner'),
    btnLoadSamples: document.getElementById('btn-load-samples'),
    btnDismissWelcome: document.getElementById('btn-dismiss-welcome'),

    // Search & Filter
    searchInput: document.getElementById('search-input'),
    searchClearBtn: document.getElementById('search-clear-btn'),
    filterPills: document.querySelectorAll('.filter-pill'),
    categoryFilterSelect: document.getElementById('category-filter-select'),

    // Summary Stats
    statOverdueCount: document.getElementById('stat-overdue-count'),
    statOverdueWrap: document.getElementById('stat-pill-overdue-wrap'),
    statAttentionCount: document.getElementById('stat-attention-count'),
    statUpcomingCount: document.getElementById('stat-upcoming-count'),
    statCompletedCount: document.getElementById('stat-completed-count'),
    statSidebarAttention: document.getElementById('stat-sidebar-attention'),
    statSidebarUpcoming: document.getElementById('stat-sidebar-upcoming'),
    navBadgeAttention: document.getElementById('nav-badge-attention'),
    navBadgeCompleted: document.getElementById('nav-badge-completed'),

    // Dashboard Urgency Sections
    groupOverdue: document.getElementById('group-overdue'),
    countOverdue: document.getElementById('count-overdue'),
    gridOverdue: document.getElementById('items-grid-overdue'),

    groupToday: document.getElementById('group-today'),
    countToday: document.getElementById('count-today'),
    gridToday: document.getElementById('items-grid-today'),

    groupThisWeek: document.getElementById('group-this-week'),
    countThisWeek: document.getElementById('count-this-week'),
    gridThisWeek: document.getElementById('items-grid-this-week'),

    groupComingUp: document.getElementById('group-coming-up'),
    countComingUp: document.getElementById('count-coming-up'),
    gridComingUp: document.getElementById('items-grid-coming-up'),

    groupNoDate: document.getElementById('group-nodate'),
    countNoDate: document.getElementById('count-nodate'),
    gridNoDate: document.getElementById('items-grid-nodate'),

    dashboardEmptyState: document.getElementById('dashboard-empty-state'),
    btnEmptyAddFocus: document.getElementById('btn-empty-add-focus'),

    // Timeline View
    timelineFlow: document.getElementById('timeline-flow'),
    timelineEmptyState: document.getElementById('timeline-empty-state'),

    // Upcoming View
    countHorizon7: document.getElementById('count-horizon-7'),
    gridHorizon7: document.getElementById('grid-horizon-7'),
    countHorizon30: document.getElementById('count-horizon-30'),
    gridHorizon30: document.getElementById('grid-horizon-30'),
    countHorizon90: document.getElementById('count-horizon-90'),
    gridHorizon90: document.getElementById('grid-horizon-90'),
    countHorizonLater: document.getElementById('count-horizon-later'),
    gridHorizonLater: document.getElementById('grid-horizon-later'),

    // Completed View
    completedItemsGrid: document.getElementById('completed-items-grid'),
    completedEmptyState: document.getElementById('completed-empty-state'),
    btnClearCompleted: document.getElementById('btn-clear-completed'),

    // Settings View
    themeChoiceBtns: document.querySelectorAll('.theme-choice-btn'),
    btnExportData: document.getElementById('btn-export-data'),
    importFileInput: document.getElementById('import-file-input'),
    btnSettingsLoadSamples: document.getElementById('btn-settings-load-samples'),
    btnTriggerClearAll: document.getElementById('btn-trigger-clear-all'),

    // Modals
    modalDatePrompt: document.getElementById('modal-date-prompt'),
    promptItemPreview: document.getElementById('prompt-item-preview'),
    promptOptBtns: document.querySelectorAll('.prompt-opt-btn'),
    promptCustomDate: document.getElementById('prompt-custom-date'),
    btnConfirmPromptCustom: document.getElementById('btn-confirm-prompt-custom'),
    btnCancelDatePrompt: document.getElementById('btn-cancel-date-prompt'),

    modalEditItem: document.getElementById('modal-edit-item'),
    editItemForm: document.getElementById('edit-item-form'),
    editItemId: document.getElementById('edit-item-id'),
    editTitle: document.getElementById('edit-title'),
    editCategory: document.getElementById('edit-category'),
    editRecurrence: document.getElementById('edit-recurrence'),
    editDate: document.getElementById('edit-date'),
    editTime: document.getElementById('edit-time'),
    editNotes: document.getElementById('edit-notes'),
    btnCloseEditModal: document.getElementById('btn-close-edit-modal'),
    btnCancelEdit: document.getElementById('btn-cancel-edit'),

    modalConfirm: document.getElementById('modal-confirm'),
    confirmModalTitle: document.getElementById('confirm-modal-title'),
    confirmModalMessage: document.getElementById('confirm-modal-message'),
    btnConfirmCancel: document.getElementById('btn-confirm-cancel'),
    btnConfirmProceed: document.getElementById('btn-confirm-proceed'),

    // Toast Container
    toastContainer: document.getElementById('toast-container')
  };

  // =========================================================================
  // DATE & TIME UTILITIES (Local Timezone Aware)
  // =========================================================================

  /**
   * Formats a Date object to local YYYY-MM-DD string without UTC shifting
   */
  function toLocalDateString(date) {
    if (!date || isNaN(date.getTime())) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Parses YYYY-MM-DD string to local Date object at 00:00:00
   */
  function parseLocalDate(dateStr) {
    if (!dateStr) return null;
    const parts = dateStr.split('-');
    if (parts.length !== 3) return null;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const d = new Date(year, month, day, 0, 0, 0, 0);
    return isNaN(d.getTime()) ? null : d;
  }

  /**
   * Returns today's date in local YYYY-MM-DD
   */
  function getTodayString() {
    return toLocalDateString(new Date());
  }

  /**
   * Calculates difference in days: (dueDate - today)
   * < 0  -> overdue
   * == 0 -> today
   * > 0  -> days left
   */
  function getDayDifference(dueDateStr) {
    if (!dueDateStr) return null;
    const targetDate = parseLocalDate(dueDateStr);
    const today = parseLocalDate(getTodayString());
    if (!targetDate || !today) return null;

    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.round((targetDate - today) / msPerDay);
  }

  /**
   * Formats a date string for display (e.g., "Oct 12, 2026")
   */
  function formatHumanDate(dateStr) {
    if (!dateStr) return 'No deadline';
    const date = parseLocalDate(dateStr);
    if (!date) return dateStr;
    const options = { month: 'short', day: 'numeric' };
    const currentYear = new Date().getFullYear();
    if (date.getFullYear() !== currentYear) {
      options.year = 'numeric';
    }
    return date.toLocaleDateString(undefined, options);
  }

  /**
   * Formats 24h time to 12h format (e.g. "16:00" -> "4:00 PM")
   */
  function formatHumanTime(timeStr) {
    if (!timeStr) return '';
    const parts = timeStr.split(':');
    if (parts.length < 2) return timeStr;
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1].padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
  }

  /**
   * Generates dynamic urgency text and CSS class for badges
   */
  function getUrgencyInfo(dueDateStr, isCompleted) {
    if (isCompleted) {
      return { text: 'Completed', className: 'completed', diff: null };
    }
    if (!dueDateStr) {
      return { text: 'No date', className: 'no-date', diff: null };
    }

    const diff = getDayDifference(dueDateStr);

    if (diff < 0) {
      const days = Math.abs(diff);
      return {
        text: `⚠️ Overdue by ${days} ${days === 1 ? 'day' : 'days'}`,
        className: 'overdue',
        diff
      };
    }
    if (diff === 0) {
      return { text: 'Due today', className: 'today', diff };
    }
    if (diff === 1) {
      return { text: 'Tomorrow', className: 'this-week', diff };
    }
    if (diff <= 7) {
      return { text: `${diff} days left`, className: 'this-week', diff };
    }
    if (diff <= 30) {
      return { text: `${diff} days left`, className: 'coming-up', diff };
    }
    if (diff <= 60) {
      return { text: '1 month left', className: 'coming-up', diff };
    }
    const months = Math.round(diff / 30.4);
    if (months < 12) {
      return { text: `${months} months left`, className: 'coming-up', diff };
    }
    const years = (diff / 365.25).toFixed(1);
    return { text: `${years.endsWith('.0') ? parseInt(years) : years} years left`, className: 'coming-up', diff };
  }

  // =========================================================================
  // NATURAL LANGUAGE DATE & CATEGORY PARSER
  // =========================================================================
  const MONTHS = {
    january: 0, jan: 0,
    february: 1, feb: 1,
    march: 2, mar: 2,
    april: 3, apr: 3,
    may: 4,
    june: 5, jun: 5,
    july: 6, jul: 6,
    august: 7, aug: 7,
    september: 8, sep: 8, sept: 8,
    october: 9, oct: 9,
    november: 10, nov: 10,
    december: 11, dec: 11
  };

  const DAYS_OF_WEEK = {
    sunday: 0, sun: 0,
    monday: 1, mon: 1,
    tuesday: 2, tue: 2, tues: 2,
    wednesday: 3, wed: 3,
    thursday: 4, thu: 4, thur: 4, thurs: 4,
    friday: 5, fri: 5,
    saturday: 6, sat: 6
  };

  // Ordered category detection rules (specific categories take precedence over general keywords)
  const CATEGORY_RULES = [
    { cat: 'warranties', keywords: ['warranty', 'warranties', 'guarantee', 'repair', 'ac service', 'car service', 'vehicle service', 'bike service', 'maintenance'] },
    { cat: 'applications', keywords: ['scholarship application', 'job application', 'visa application', 'application', 'apply', 'submit', 'submission', 'grant', 'admission'] },
    { cat: 'appointments', keywords: ['doctor', 'dentist', 'appointment', 'clinic', 'checkup', 'physician', 'vet', 'therapy', 'haircut', 'salon', 'meeting', 'consultation'] },
    { cat: 'subscriptions', keywords: ['netflix', 'spotify', 'amazon prime', 'prime', 'subscription', 'membership', 'gym', 'cancel netflix', 'cancel subscription', 'youtube premium', 'disney', 'hulu', 'apple tv'] },
    { cat: 'renewals', keywords: ['renew', 'renewal', 'expires', 'expire', 'expiration', 'reg renewal', 'certificate renewal', 'domain'] },
    { cat: 'documents', keywords: ['passport', 'license', 'dl', 'visa', 'id card', 'certificate', 'pan card', 'aadhaar', 'tax', 'ssn', 'deed', 'will', 'citizenship'] },
    { cat: 'education', keywords: ['scholarship', 'college', 'school', 'university', 'tuition', 'exam', 'assignment', 'homework', 'test', 'semester', 'course', 'grade', 'thesis', 'lecture'] },
    { cat: 'payments', keywords: ['pay', 'bill', 'electric', 'electricity', 'water', 'rent', 'credit card', 'emi', 'invoice', 'fine', 'loan', 'mortgage', 'due payment', 'challan', 'fee'] },
    { cat: 'events', keywords: ['flight', 'ticket', 'concert', 'wedding', 'conference', 'party', 'movie', 'show', 'booking', 'reservation', 'hotel', 'trip'] },
    { cat: 'personal', keywords: ['birthday', 'anniversary', 'family', 'call mom', 'call dad', 'call', 'gift', 'clean', 'home', 'groceries'] }
  ];

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Lightweight Natural Language Parser
   * Extracts date, time, category, and cleaned title
   */
  function parseNaturalLanguage(rawInput) {
    if (!rawInput || typeof rawInput !== 'string') {
      return { title: '', date: null, time: null, category: 'other' };
    }

    let text = rawInput.trim();
    let detectedDate = null;
    let detectedTime = null;
    let matchedDateSubstring = '';
    let matchedTimeSubstring = '';

    const today = new Date();
    const currentYear = today.getFullYear();

    // 1. Time extraction: e.g. "4 PM", "4:30 pm", "10:30 AM", "18:00", "at 4pm"
    const timeRegex = /(?:at\s+)?(\b\d{1,2}(?::\d{2})?\s*(?:am|pm)\b|\b\d{1,2}:\d{2}\b)/i;
    const timeMatch = text.match(timeRegex);
    if (timeMatch) {
      matchedTimeSubstring = timeMatch[0];
      const timeStr = timeMatch[1].toLowerCase().replace(/\s+/g, '');
      if (timeStr.includes('am') || timeStr.includes('pm')) {
        const isPM = timeStr.includes('pm');
        const numPart = timeStr.replace(/(am|pm)/, '');
        let [h, m] = numPart.split(':');
        h = parseInt(h, 10);
        m = m ? parseInt(m, 10) : 0;
        if (isPM && h < 12) h += 12;
        if (!isPM && h === 12) h = 0;
        detectedTime = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      } else if (timeStr.includes(':')) {
        const [h, m] = timeStr.split(':').map((n) => parseInt(n, 10));
        if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
          detectedTime = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        }
      }
    }

    // 2. Relative Keywords: "today", "tonight", "tomorrow", "next week", "next month"
    const lower = text.toLowerCase();
    
    if (/\btonight\b/i.test(lower)) {
      detectedDate = toLocalDateString(today);
      if (!detectedTime) detectedTime = '20:00';
      matchedDateSubstring = (lower.match(/\btonight\b/i) || [])[0] || '';
    } else if (/\btoday\b/i.test(lower)) {
      detectedDate = toLocalDateString(today);
      matchedDateSubstring = (lower.match(/\btoday\b/i) || [])[0] || '';
    } else if (/\btomorrow\b/i.test(lower)) {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      detectedDate = toLocalDateString(tomorrow);
      matchedDateSubstring = (lower.match(/\btomorrow\b/i) || [])[0] || '';
    } else if (/\bnext week\b/i.test(lower)) {
      const nw = new Date(today);
      nw.setDate(today.getDate() + 7);
      detectedDate = toLocalDateString(nw);
      matchedDateSubstring = (lower.match(/\bnext week\b/i) || [])[0] || '';
    } else if (/\bnext month\b/i.test(lower)) {
      const nm = new Date(today);
      nm.setMonth(today.getMonth() + 1);
      detectedDate = toLocalDateString(nm);
      matchedDateSubstring = (lower.match(/\bnext month\b/i) || [])[0] || '';
    }

    // 3. "in X days" / "in X weeks" / "in X months"
    if (!detectedDate) {
      const inXMatch = lower.match(/\bin\s+(\d+)\s+(day|days|week|weeks|month|months)\b/i);
      if (inXMatch) {
        matchedDateSubstring = inXMatch[0];
        const count = parseInt(inXMatch[1], 10);
        const unit = inXMatch[2].toLowerCase();
        const d = new Date(today);
        if (unit.startsWith('day')) {
          d.setDate(today.getDate() + count);
        } else if (unit.startsWith('week')) {
          d.setDate(today.getDate() + count * 7);
        } else if (unit.startsWith('month')) {
          d.setMonth(today.getMonth() + count);
        }
        detectedDate = toLocalDateString(d);
      }
    }

    // 4. Days of the week: "on Friday", "this Friday", "next Monday", "Friday"
    if (!detectedDate) {
      const dayNames = Object.keys(DAYS_OF_WEEK).join('|');
      const dayRegex = new RegExp(`\\b(?:on\\s+|this\\s+|next\\s+)?(${dayNames})\\b`, 'i');
      const dayMatch = lower.match(dayRegex);
      if (dayMatch) {
        matchedDateSubstring = dayMatch[0];
        const dayKey = (dayMatch[1] || '').toLowerCase();
        const targetDay = DAYS_OF_WEEK[dayKey];
        if (targetDay !== undefined) {
          const currentDay = today.getDay();
          let diff = targetDay - currentDay;
          if (diff <= 0) diff += 7; // next occurrence
          const d = new Date(today);
          d.setDate(today.getDate() + diff);
          detectedDate = toLocalDateString(d);
        }
      }
    }

    // 5. Specific month & day: "March 15 2027", "15 March 2027", "October 12", "Oct 12th"
    if (!detectedDate) {
      const monthNames = Object.keys(MONTHS).join('|');
      // e.g. "March 15, 2027" or "March 15th"
      const mdRegex = new RegExp(`\\b(?:by\\s+|before\\s+|on\\s+|due\\s+)?(${monthNames})\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:,?\\s+(\\d{4}))?\\b`, 'i');
      const dmRegex = new RegExp(`\\b(?:by\\s+|before\\s+|on\\s+|due\\s+)?(\\d{1,2})(?:st|nd|rd|th)?\\s+(${monthNames})(?:,?\\s+(\\d{4}))?\\b`, 'i');

      const mdMatch = lower.match(mdRegex);
      const dmMatch = lower.match(dmRegex);

      if (mdMatch) {
        matchedDateSubstring = mdMatch[0];
        const m = MONTHS[mdMatch[1].toLowerCase()];
        const dayNum = parseInt(mdMatch[2], 10);
        let y = mdMatch[3] ? parseInt(mdMatch[3], 10) : currentYear;
        // If year omitted and date already passed this year, assume next year
        if (!mdMatch[3]) {
          const testDate = new Date(currentYear, m, dayNum);
          if (toLocalDateString(testDate) < toLocalDateString(today)) {
            y += 1;
          }
        }
        detectedDate = toLocalDateString(new Date(y, m, dayNum));
      } else if (dmMatch) {
        matchedDateSubstring = dmMatch[0];
        const dayNum = parseInt(dmMatch[1], 10);
        const m = MONTHS[dmMatch[2].toLowerCase()];
        let y = dmMatch[3] ? parseInt(dmMatch[3], 10) : currentYear;
        if (!dmMatch[3]) {
          const testDate = new Date(currentYear, m, dayNum);
          if (toLocalDateString(testDate) < toLocalDateString(today)) {
            y += 1;
          }
        }
        detectedDate = toLocalDateString(new Date(y, m, dayNum));
      }
    }

    // 6. "in December", "in March" (Month only)
    if (!detectedDate) {
      const monthNames = Object.keys(MONTHS).join('|');
      const inMonthRegex = new RegExp(`\\b(?:in\\s+|before\\s+|by\\s+|during\\s+)(${monthNames})(?:\\s+(\\d{4}))?\\b`, 'i');
      const inMonthMatch = lower.match(inMonthRegex);
      if (inMonthMatch) {
        matchedDateSubstring = inMonthMatch[0];
        const m = MONTHS[inMonthMatch[1].toLowerCase()];
        let y = inMonthMatch[2] ? parseInt(inMonthMatch[2], 10) : currentYear;
        if (!inMonthMatch[2] && m < today.getMonth()) {
          y += 1;
        }
        // Set to 1st of that month
        detectedDate = toLocalDateString(new Date(y, m, 1));
      }
    }

    // 7. Standard numeric dates: "YYYY-MM-DD", "MM/DD/YYYY", "DD/MM/YYYY"
    if (!detectedDate) {
      const isoMatch = text.match(/\b(\d{4})-(\d{1,2})-(\d{1,2})\b/);
      const slashMatch = text.match(/\b(\d{1,2})\/(\d{1,2})\/(\d{4})\b/);
      if (isoMatch) {
        matchedDateSubstring = isoMatch[0];
        detectedDate = toLocalDateString(new Date(parseInt(isoMatch[1], 10), parseInt(isoMatch[2], 10) - 1, parseInt(isoMatch[3], 10)));
      } else if (slashMatch) {
        matchedDateSubstring = slashMatch[0];
        // Standard check: assume MM/DD/YYYY unless MM > 12
        let p1 = parseInt(slashMatch[1], 10);
        let p2 = parseInt(slashMatch[2], 10);
        let y = parseInt(slashMatch[3], 10);
        let m = p1 > 12 ? p2 - 1 : p1 - 1;
        let d = p1 > 12 ? p1 : p2;
        detectedDate = toLocalDateString(new Date(y, m, d));
      }
    }

    // 8. Category deduction from prioritized rules
    let detectedCategory = 'other';
    for (const rule of CATEGORY_RULES) {
      for (const kw of rule.keywords) {
        const regex = new RegExp(`\\b${escapeRegExp(kw)}\\b`, 'i');
        if (regex.test(lower)) {
          detectedCategory = rule.cat;
          break;
        }
      }
      if (detectedCategory !== 'other') break;
    }

    // 9. Clean Title: strip matched date, time, and connector prepositions
    let cleanedTitle = text;
    if (matchedTimeSubstring) {
      cleanedTitle = cleanedTitle.replace(new RegExp(escapeRegExp(matchedTimeSubstring), 'i'), '');
    }
    if (matchedDateSubstring) {
      cleanedTitle = cleanedTitle.replace(new RegExp(escapeRegExp(matchedDateSubstring), 'i'), '');
    }

    // Clean remaining trailing/leading prepositions or action markers: "by", "on", "before", "at", "due", "in", "expires", "expire"
    cleanedTitle = cleanedTitle
      .replace(/\b(by|before|on|due|at|until|expires|expire|in)\s*$/i, '')
      .replace(/^\s*(by|before|on|due|at|until|expires|expire|in)\s+/i, '')
      .replace(/\s{2,}/g, ' ')
      .trim();

    // Capitalize first character
    if (cleanedTitle.length > 0) {
      cleanedTitle = cleanedTitle.charAt(0).toUpperCase() + cleanedTitle.slice(1);
    } else {
      cleanedTitle = rawInput.trim();
    }

    return {
      title: cleanedTitle,
      date: detectedDate,
      time: detectedTime,
      category: detectedCategory
    };
  }

  // =========================================================================
  // PERSISTENCE (localStorage)
  // =========================================================================
  function loadState() {
    try {
      const storedItems = localStorage.getItem(STORAGE_KEY_ITEMS);
      if (storedItems) {
        state.items = JSON.parse(storedItems);
      } else {
        // First time opening: populate realistic sample responsibilities
        state.items = getInitialSampleData();
        saveState();
      }

      const storedTheme = localStorage.getItem(STORAGE_KEY_THEME);
      if (storedTheme) {
        state.theme = storedTheme;
      }

      const storedWelcome = localStorage.getItem(STORAGE_KEY_WELCOME);
      state.welcomeDismissed = storedWelcome === 'true';
    } catch (e) {
      console.error('Error loading data from localStorage:', e);
      state.items = getInitialSampleData();
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(state.items));
      localStorage.setItem(STORAGE_KEY_THEME, state.theme);
      localStorage.setItem(STORAGE_KEY_WELCOME, state.welcomeDismissed ? 'true' : 'false');
    } catch (e) {
      console.error('Error saving state to localStorage:', e);
      showToast('⚠️ Unable to save data locally. Check browser storage limits.');
    }
  }

  /**
   * Generates realistic demo responsibilities
   */
  function getInitialSampleData() {
    const today = new Date();
    const dTomorrow = new Date(today);
    dTomorrow.setDate(today.getDate() + 1);

    const dIn3Days = new Date(today);
    dIn3Days.setDate(today.getDate() + 3);

    const dIn14Days = new Date(today);
    dIn14Days.setDate(today.getDate() + 14);

    const dIn45Days = new Date(today);
    dIn45Days.setDate(today.getDate() + 45);

    const dPast2Days = new Date(today);
    dPast2Days.setDate(today.getDate() - 2);

    return [
      {
        id: 'sample-1',
        title: 'Submit scholarship application',
        category: 'applications',
        dueDate: toLocalDateString(dIn14Days),
        dueTime: '17:00',
        recurrence: 'none',
        notes: 'Include official transcripts and reference letters',
        completed: false,
        completedAt: null,
        createdAt: new Date().toISOString()
      },
      {
        id: 'sample-2',
        title: 'Doctor appointment',
        category: 'appointments',
        dueDate: toLocalDateString(dTomorrow),
        dueTime: '16:00',
        recurrence: 'none',
        notes: 'Annual routine health checkup at City Health Clinic',
        completed: false,
        completedAt: null,
        createdAt: new Date().toISOString()
      },
      {
        id: 'sample-3',
        title: 'Pay electricity bill',
        category: 'payments',
        dueDate: toLocalDateString(dIn3Days),
        dueTime: null,
        recurrence: 'monthly',
        notes: 'Auto-debit setup verification',
        completed: false,
        completedAt: null,
        createdAt: new Date().toISOString()
      },
      {
        id: 'sample-4',
        title: 'Laptop warranty expiration',
        category: 'warranties',
        dueDate: toLocalDateString(dIn45Days),
        dueTime: null,
        recurrence: 'none',
        notes: 'Check battery health before warranty ends',
        completed: false,
        completedAt: null,
        createdAt: new Date().toISOString()
      }
    ];
  }

  // =========================================================================
  // RECURRENCE CALCULATOR
  // =========================================================================
  function calculateNextRecurringDate(currentDueDateStr, recurrence) {
    if (!currentDueDateStr || recurrence === 'none') return null;
    const baseDate = parseLocalDate(currentDueDateStr) || new Date();
    const today = parseLocalDate(getTodayString());
    const nextDate = new Date(baseDate);

    // Function to add interval
    const step = (d) => {
      switch (recurrence) {
        case 'daily':
          d.setDate(d.getDate() + 1);
          break;
        case 'weekly':
          d.setDate(d.getDate() + 7);
          break;
        case 'monthly':
          d.setMonth(d.getMonth() + 1);
          break;
        case 'yearly':
          d.setFullYear(d.getFullYear() + 1);
          break;
      }
    };

    step(nextDate);

    // If the next calculated date is still in the past, advance until future/today
    while (nextDate < today) {
      step(nextDate);
    }

    return toLocalDateString(nextDate);
  }

  // =========================================================================
  // ACTIONS: ADD, EDIT, COMPLETE, UNDO, DELETE
  // =========================================================================

  /**
   * Handles user submission from Quick Add box
   */
  function handleQuickAddSubmit(e) {
    if (e) e.preventDefault();
    const rawText = DOM.quickAddInput.value.trim();
    if (!rawText) return;

    const parsed = parseNaturalLanguage(rawText);

    // If date was detected, create immediately
    if (parsed.date) {
      createNewItem({
        title: parsed.title,
        category: parsed.category,
        dueDate: parsed.date,
        dueTime: parsed.time,
        recurrence: 'none',
        notes: ''
      });
      DOM.quickAddInput.value = '';
      hideNlpPreview();
      showToast("Saved. We'll keep it on your radar.");
    } else {
      // No confident date identified -> prompt user gracefully
      state.pendingAdd = {
        title: parsed.title,
        category: parsed.category,
        dueTime: parsed.time,
        recurrence: 'none',
        notes: ''
      };
      openDatePromptModal(parsed.title);
    }
  }

  /**
   * Saves an item to state and persists
   */
  function createNewItem(itemData) {
    const newItem = {
      id: 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      title: itemData.title || 'Untitled',
      category: itemData.category || 'other',
      dueDate: itemData.dueDate || null,
      dueTime: itemData.dueTime || null,
      recurrence: itemData.recurrence || 'none',
      notes: itemData.notes || '',
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString()
    };

    state.items.unshift(newItem);
    saveState();
    renderAll();
    return newItem;
  }

  /**
   * Toggles item completion status
   */
  function toggleItemComplete(itemId) {
    const itemIndex = state.items.findIndex((item) => item.id === itemId);
    if (itemIndex === -1) return;

    const item = state.items[itemIndex];
    const willBeCompleted = !item.completed;

    item.completed = willBeCompleted;
    item.completedAt = willBeCompleted ? new Date().toISOString() : null;

    if (willBeCompleted) {
      state.lastCompletedItem = { ...item };

      // Check if recurring
      if (item.recurrence && item.recurrence !== 'none') {
        const nextDate = calculateNextRecurringDate(item.dueDate, item.recurrence);
        const recurringCopy = {
          title: item.title,
          category: item.category,
          dueDate: nextDate,
          dueTime: item.dueTime,
          recurrence: item.recurrence,
          notes: item.notes
        };
        createNewItem(recurringCopy);
        showToast(`Nice — that's taken care of. Next cycle scheduled for ${formatHumanDate(nextDate)}.`, () => {
          undoCompletion(item.id);
        });
      } else {
        showToast("Nice — that's taken care of.", () => {
          undoCompletion(item.id);
        });
      }
    } else {
      showToast('Item restored to active list.');
    }

    saveState();
    renderAll();
  }

  /**
   * Undo completing an item
   */
  function undoCompletion(itemId) {
    const item = state.items.find((i) => i.id === itemId);
    if (item && item.completed) {
      item.completed = false;
      item.completedAt = null;
      saveState();
      renderAll();
      showToast('Completion undone.');
    }
  }

  /**
   * Opens the edit modal for an item
   */
  function openEditModal(itemId) {
    const item = state.items.find((i) => i.id === itemId);
    if (!item) return;

    DOM.editItemId.value = item.id;
    DOM.editTitle.value = item.title;
    DOM.editCategory.value = item.category || 'other';
    DOM.editRecurrence.value = item.recurrence || 'none';
    DOM.editDate.value = item.dueDate || '';
    DOM.editTime.value = item.dueTime || '';
    DOM.editNotes.value = item.notes || '';

    DOM.modalEditItem.style.display = 'flex';
    DOM.editTitle.focus();
  }

  function handleSaveEdit(e) {
    e.preventDefault();
    const id = DOM.editItemId.value;
    const item = state.items.find((i) => i.id === id);
    if (!item) return;

    const newTitle = DOM.editTitle.value.trim();
    if (!newTitle) return;

    item.title = newTitle;
    item.category = DOM.editCategory.value;
    item.recurrence = DOM.editRecurrence.value;
    item.dueDate = DOM.editDate.value || null;
    item.dueTime = DOM.editTime.value || null;
    item.notes = DOM.editNotes.value.trim();

    closeModals();
    saveState();
    renderAll();
    showToast('Changes saved.');
  }

  /**
   * Prompts user before deleting an item
   */
  function promptDeleteItem(itemId) {
    const item = state.items.find((i) => i.id === itemId);
    if (!item) return;

    DOM.confirmModalTitle.textContent = 'Delete Responsibility?';
    DOM.confirmModalMessage.textContent = `Are you sure you want to delete "${item.title}"? This cannot be undone.`;
    DOM.btnConfirmProceed.onclick = () => {
      state.items = state.items.filter((i) => i.id !== itemId);
      saveState();
      renderAll();
      closeModals();
      showToast('Item deleted.');
    };
    DOM.modalConfirm.style.display = 'flex';
  }

  /**
   * Clears all completed items with confirmation
   */
  function promptClearCompleted() {
    DOM.confirmModalTitle.textContent = 'Clear Completed History?';
    DOM.confirmModalMessage.textContent = 'This will remove all items currently in your Completed list.';
    DOM.btnConfirmProceed.onclick = () => {
      state.items = state.items.filter((i) => !i.completed);
      saveState();
      renderAll();
      closeModals();
      showToast('Completed items cleared.');
    };
    DOM.modalConfirm.style.display = 'flex';
  }

  /**
   * Clears all data permanently
   */
  function promptClearAllData() {
    DOM.confirmModalTitle.textContent = 'Erase All Life Admin Data?';
    DOM.confirmModalMessage.textContent = 'This will permanently delete all your responsibilities, history, and custom settings. This action cannot be reversed.';
    DOM.btnConfirmProceed.onclick = () => {
      state.items = [];
      saveState();
      renderAll();
      closeModals();
      showToast('All records erased.');
    };
    DOM.modalConfirm.style.display = 'flex';
  }

  // =========================================================================
  // DATE PROMPT MODAL (Fallback when no date is recognized)
  // =========================================================================
  function openDatePromptModal(title) {
    DOM.promptItemPreview.textContent = `"${title}"`;
    DOM.promptCustomDate.value = '';
    DOM.modalDatePrompt.style.display = 'flex';
  }

  function handleDatePromptChoice(choice) {
    if (!state.pendingAdd) return;

    const today = new Date();
    let selectedDate = null;

    if (choice === 'today') {
      selectedDate = toLocalDateString(today);
    } else if (choice === 'tomorrow') {
      const tom = new Date(today);
      tom.setDate(today.getDate() + 1);
      selectedDate = toLocalDateString(tom);
    } else if (choice === 'this-week') {
      const tw = new Date(today);
      tw.setDate(today.getDate() + 5);
      selectedDate = toLocalDateString(tw);
    } else if (choice === 'no-date') {
      selectedDate = null;
    }

    state.pendingAdd.dueDate = selectedDate;
    createNewItem(state.pendingAdd);

    state.pendingAdd = null;
    DOM.quickAddInput.value = '';
    hideNlpPreview();
    closeModals();
    showToast("Saved. We'll keep it on your radar.");
  }

  function handleCustomDatePromptSave() {
    if (!state.pendingAdd) return;
    const customDate = DOM.promptCustomDate.value;
    state.pendingAdd.dueDate = customDate || null;
    createNewItem(state.pendingAdd);

    state.pendingAdd = null;
    DOM.quickAddInput.value = '';
    hideNlpPreview();
    closeModals();
    showToast("Saved. We'll keep it on your radar.");
  }

  function closeModals() {
    DOM.modalDatePrompt.style.display = 'none';
    DOM.modalEditItem.style.display = 'none';
    DOM.modalConfirm.style.display = 'none';
  }

  // =========================================================================
  // LIVE NLP PREVIEW IN QUICK-ADD INPUT
  // =========================================================================
  function updateLiveNlpPreview() {
    const text = DOM.quickAddInput.value.trim();
    if (!text) {
      hideNlpPreview();
      return;
    }

    const parsed = parseNaturalLanguage(text);

    if (parsed.date || parsed.category !== 'other' || parsed.time) {
      DOM.nlpLivePreview.style.display = 'block';

      if (parsed.date) {
        DOM.nlpPreviewDate.style.display = 'inline-flex';
        DOM.nlpPreviewDate.textContent = `📅 ${formatHumanDate(parsed.date)}`;
      } else {
        DOM.nlpPreviewDate.style.display = 'inline-flex';
        DOM.nlpPreviewDate.textContent = `📅 No date detected (will ask)`;
      }

      if (parsed.time) {
        DOM.nlpPreviewTime.style.display = 'inline-flex';
        DOM.nlpPreviewTime.textContent = `🕒 ${formatHumanTime(parsed.time)}`;
      } else {
        DOM.nlpPreviewTime.style.display = 'none';
      }

      const catInfo = CATEGORIES[parsed.category] || CATEGORIES.other;
      DOM.nlpPreviewCategory.textContent = `${catInfo.emoji} ${catInfo.label}`;
    } else {
      hideNlpPreview();
    }
  }

  function hideNlpPreview() {
    DOM.nlpLivePreview.style.display = 'none';
  }

  // =========================================================================
  // TOAST NOTIFICATION SYSTEM (With Undo)
  // =========================================================================
  let toastTimeout = null;

  function showToast(message, onUndo) {
    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }
    DOM.toastContainer.innerHTML = '';

    const toast = document.createElement('div');
    toast.className = 'toast';

    const msgSpan = document.createElement('span');
    msgSpan.className = 'toast-message';
    msgSpan.textContent = message;
    toast.appendChild(msgSpan);

    if (typeof onUndo === 'function') {
      const undoBtn = document.createElement('button');
      undoBtn.type = 'button';
      undoBtn.className = 'toast-undo-btn';
      undoBtn.textContent = 'Undo';
      undoBtn.onclick = () => {
        onUndo();
        toast.classList.add('toast-hiding');
        setTimeout(() => toast.remove(), 200);
      };
      toast.appendChild(undoBtn);
    }

    DOM.toastContainer.appendChild(toast);

    toastTimeout = setTimeout(() => {
      toast.classList.add('toast-hiding');
      setTimeout(() => toast.remove(), 200);
    }, 5000);
  }

  // =========================================================================
  // RENDERING ENGINE
  // =========================================================================

  /**
   * Builds an Item Card HTML Element
   */
  function createItemCardElement(item) {
    const card = document.createElement('div');
    const urgency = getUrgencyInfo(item.dueDate, item.completed);
    const cat = CATEGORIES[item.category] || CATEGORIES.other;

    card.className = `item-card ${item.completed ? 'is-completed' : ''} ${
      !item.completed && urgency.diff !== null
        ? urgency.diff < 0
          ? 'is-overdue'
          : urgency.diff === 0
          ? 'is-today'
          : ''
        : ''
    }`;
    card.setAttribute('data-id', item.id);

    // Top row
    const topRow = document.createElement('div');
    topRow.className = 'card-top-row';

    const catBadge = document.createElement('span');
    catBadge.className = 'category-tag';
    catBadge.textContent = `${cat.emoji} ${cat.label}`;

    const urgBadge = document.createElement('span');
    urgBadge.className = `urgency-badge ${urgency.className}`;
    urgBadge.textContent = urgency.text;

    topRow.appendChild(catBadge);
    topRow.appendChild(urgBadge);
    card.appendChild(topRow);

    // Title
    const titleEl = document.createElement('h4');
    titleEl.className = 'card-title';
    titleEl.textContent = item.title;
    card.appendChild(titleEl);

    // Meta details (Date, Time, Recurrence)
    const metaRow = document.createElement('div');
    metaRow.className = 'card-meta';

    if (item.dueDate) {
      const dateMeta = document.createElement('span');
      dateMeta.className = 'meta-item';
      dateMeta.innerHTML = `<i data-lucide="calendar"></i> <span>${formatHumanDate(item.dueDate)}</span>`;
      metaRow.appendChild(dateMeta);
    }

    if (item.dueTime) {
      const timeMeta = document.createElement('span');
      timeMeta.className = 'meta-item';
      timeMeta.innerHTML = `<i data-lucide="clock"></i> <span>${formatHumanTime(item.dueTime)}</span>`;
      metaRow.appendChild(timeMeta);
    }

    if (item.recurrence && item.recurrence !== 'none') {
      const recMeta = document.createElement('span');
      recMeta.className = 'recurrence-indicator';
      const label = item.recurrence.charAt(0).toUpperCase() + item.recurrence.slice(1);
      recMeta.innerHTML = `<i data-lucide="repeat"></i> <span>${label}</span>`;
      metaRow.appendChild(recMeta);
    }

    if (item.completed && item.completedAt) {
      const compMeta = document.createElement('span');
      compMeta.className = 'meta-item';
      const compDate = new Date(item.completedAt);
      compMeta.textContent = `Completed ${compDate.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric'
      })}`;
      metaRow.appendChild(compMeta);
    }

    card.appendChild(metaRow);

    // Notes
    if (item.notes && item.notes.trim()) {
      const notesEl = document.createElement('div');
      notesEl.className = 'card-notes';
      notesEl.textContent = item.notes;
      card.appendChild(notesEl);
    }

    // Bottom Action Row
    const bottomRow = document.createElement('div');
    bottomRow.className = 'card-bottom-row';

    // Complete / Restore button
    const completeBtn = document.createElement('button');
    completeBtn.type = 'button';
    completeBtn.className = `action-complete-btn ${item.completed ? 'is-done' : ''}`;
    completeBtn.innerHTML = `
      <span class="check-circle">
        ${item.completed ? '<i data-lucide="check"></i>' : ''}
      </span>
      <span>${item.completed ? 'Completed' : 'Done'}</span>
    `;
    completeBtn.onclick = () => toggleItemComplete(item.id);
    bottomRow.appendChild(completeBtn);

    // Edit and Delete icons
    const actionsRight = document.createElement('div');
    actionsRight.className = 'card-quick-actions';

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'card-icon-btn';
    editBtn.title = 'Edit item';
    editBtn.innerHTML = '<i data-lucide="edit-3"></i>';
    editBtn.onclick = () => openEditModal(item.id);
    actionsRight.appendChild(editBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'card-icon-btn btn-delete';
    deleteBtn.title = 'Delete item';
    deleteBtn.innerHTML = '<i data-lucide="trash-2"></i>';
    deleteBtn.onclick = () => promptDeleteItem(item.id);
    actionsRight.appendChild(deleteBtn);

    bottomRow.appendChild(actionsRight);
    card.appendChild(bottomRow);

    return card;
  }

  /**
   * Filters items according to current search, active pill, and category
   */
  function getFilteredItems() {
    const query = state.searchQuery.toLowerCase().trim();
    const filter = state.activeFilter;
    const cat = state.selectedCategory;

    return state.items.filter((item) => {
      // Completed items only appear on Completed view, unless searching/filtering
      if (item.completed) return false;

      // Category filter
      if (cat !== 'all' && item.category !== cat) return false;

      // Text search
      if (query) {
        const titleMatch = item.title.toLowerCase().includes(query);
        const notesMatch = item.notes && item.notes.toLowerCase().includes(query);
        const catMatch = (CATEGORIES[item.category]?.label || '').toLowerCase().includes(query);
        const dateMatch = item.dueDate && item.dueDate.includes(query);
        if (!titleMatch && !notesMatch && !catMatch && !dateMatch) {
          return false;
        }
      }

      // Urgency Pill Filter
      if (filter === 'all') return true;

      const diff = getDayDifference(item.dueDate);
      if (filter === 'overdue') return diff !== null && diff < 0;
      if (filter === 'today') return diff === 0;
      if (filter === 'this-week') return diff !== null && diff >= 0 && diff <= 7;
      if (filter === 'coming-up') return diff !== null && diff > 7;

      return true;
    });
  }

  /**
   * Render Dashboard Urgency Groups
   */
  function renderDashboard() {
    const filtered = getFilteredItems();

    const overdueItems = [];
    const todayItems = [];
    const thisWeekItems = [];
    const comingUpItems = [];
    const noDateItems = [];

    filtered.forEach((item) => {
      const diff = getDayDifference(item.dueDate);
      if (diff === null) {
        noDateItems.push(item);
      } else if (diff < 0) {
        overdueItems.push(item);
      } else if (diff === 0) {
        todayItems.push(item);
      } else if (diff <= 7) {
        thisWeekItems.push(item);
      } else {
        comingUpItems.push(item);
      }
    });

    // Helper to sort by dueDate ascending
    const sortByDate = (a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    };

    overdueItems.sort(sortByDate);
    todayItems.sort(sortByDate);
    thisWeekItems.sort(sortByDate);
    comingUpItems.sort(sortByDate);

    // Overdue Group
    if (overdueItems.length > 0) {
      DOM.groupOverdue.style.display = 'flex';
      DOM.countOverdue.textContent = overdueItems.length;
      DOM.gridOverdue.innerHTML = '';
      overdueItems.forEach((item) => DOM.gridOverdue.appendChild(createItemCardElement(item)));
    } else {
      DOM.groupOverdue.style.display = 'none';
      DOM.gridOverdue.innerHTML = '';
    }

    // Today Group
    DOM.countToday.textContent = todayItems.length;
    DOM.gridToday.innerHTML = '';
    todayItems.forEach((item) => DOM.gridToday.appendChild(createItemCardElement(item)));
    DOM.groupToday.style.display = todayItems.length > 0 || state.activeFilter === 'today' ? 'flex' : 'none';

    // This Week Group
    DOM.countThisWeek.textContent = thisWeekItems.length;
    DOM.gridThisWeek.innerHTML = '';
    thisWeekItems.forEach((item) => DOM.gridThisWeek.appendChild(createItemCardElement(item)));
    DOM.groupThisWeek.style.display =
      thisWeekItems.length > 0 || state.activeFilter === 'this-week' ? 'flex' : 'none';

    // Coming Up Group
    DOM.countComingUp.textContent = comingUpItems.length;
    DOM.gridComingUp.innerHTML = '';
    comingUpItems.forEach((item) => DOM.gridComingUp.appendChild(createItemCardElement(item)));
    DOM.groupComingUp.style.display =
      comingUpItems.length > 0 || state.activeFilter === 'coming-up' ? 'flex' : 'none';

    // No Date / Unscheduled Group
    if (noDateItems.length > 0 && state.activeFilter === 'all') {
      DOM.groupNoDate.style.display = 'flex';
      DOM.countNoDate.textContent = noDateItems.length;
      DOM.gridNoDate.innerHTML = '';
      noDateItems.forEach((item) => DOM.gridNoDate.appendChild(createItemCardElement(item)));
    } else {
      DOM.groupNoDate.style.display = 'none';
      DOM.gridNoDate.innerHTML = '';
    }

    // Global Empty State
    const totalRendered =
      overdueItems.length +
      todayItems.length +
      thisWeekItems.length +
      comingUpItems.length +
      noDateItems.length;

    if (totalRendered === 0) {
      DOM.dashboardEmptyState.style.display = 'flex';
    } else {
      DOM.dashboardEmptyState.style.display = 'none';
    }
  }

  /**
   * Render Timeline View (Chronological sequence)
   */
  function renderTimeline() {
    const datedItems = state.items.filter((item) => !item.completed && item.dueDate);
    datedItems.sort((a, b) => a.dueDate.localeCompare(b.dueDate));

    DOM.timelineFlow.innerHTML = '';

    if (datedItems.length === 0) {
      DOM.timelineEmptyState.style.display = 'flex';
      return;
    }
    DOM.timelineEmptyState.style.display = 'none';

    // Group items by unique date string
    const dateGroups = {};
    datedItems.forEach((item) => {
      if (!dateGroups[item.dueDate]) {
        dateGroups[item.dueDate] = [];
      }
      dateGroups[item.dueDate].push(item);
    });

    for (const [dateStr, items] of Object.entries(dateGroups)) {
      const node = document.createElement('div');
      node.className = 'timeline-node';

      const diff = getDayDifference(dateStr);
      let markerClass = 'marker-future';
      let dateLabel = formatHumanDate(dateStr);

      if (diff < 0) {
        markerClass = 'marker-overdue';
        dateLabel += ` (Overdue by ${Math.abs(diff)}d)`;
      } else if (diff === 0) {
        markerClass = 'marker-today';
        dateLabel = `TODAY — ${dateLabel}`;
      } else if (diff === 1) {
        markerClass = 'marker-thisweek';
        dateLabel = `TOMORROW — ${dateLabel}`;
      } else if (diff <= 7) {
        markerClass = 'marker-thisweek';
      }

      const marker = document.createElement('div');
      marker.className = `timeline-node-marker ${markerClass}`;
      node.appendChild(marker);

      const labelEl = document.createElement('div');
      labelEl.className = 'timeline-date-label';
      labelEl.textContent = dateLabel;
      node.appendChild(labelEl);

      const itemsWrap = document.createElement('div');
      itemsWrap.className = 'timeline-items';
      items.forEach((item) => itemsWrap.appendChild(createItemCardElement(item)));

      node.appendChild(itemsWrap);
      DOM.timelineFlow.appendChild(node);
    }
  }

  /**
   * Render Upcoming Horizon View
   */
  function renderUpcoming() {
    const horizon7 = [];
    const horizon30 = [];
    const horizon90 = [];
    const horizonLater = [];

    const activeItems = state.items.filter((item) => !item.completed && item.dueDate);
    activeItems.sort((a, b) => a.dueDate.localeCompare(b.dueDate));

    activeItems.forEach((item) => {
      const diff = getDayDifference(item.dueDate);
      if (diff >= 0 && diff <= 7) {
        horizon7.push(item);
      } else if (diff > 7 && diff <= 30) {
        horizon30.push(item);
      } else if (diff > 30 && diff <= 90) {
        horizon90.push(item);
      } else if (diff > 90) {
        horizonLater.push(item);
      }
    });

    // Populate grids
    DOM.countHorizon7.textContent = `${horizon7.length} items`;
    DOM.gridHorizon7.innerHTML = '';
    horizon7.forEach((item) => DOM.gridHorizon7.appendChild(createItemCardElement(item)));

    DOM.countHorizon30.textContent = `${horizon30.length} items`;
    DOM.gridHorizon30.innerHTML = '';
    horizon30.forEach((item) => DOM.gridHorizon30.appendChild(createItemCardElement(item)));

    DOM.countHorizon90.textContent = `${horizon90.length} items`;
    DOM.gridHorizon90.innerHTML = '';
    horizon90.forEach((item) => DOM.gridHorizon90.appendChild(createItemCardElement(item)));

    DOM.countHorizonLater.textContent = `${horizonLater.length} items`;
    DOM.gridHorizonLater.innerHTML = '';
    horizonLater.forEach((item) => DOM.gridHorizonLater.appendChild(createItemCardElement(item)));
  }

  /**
   * Render Completed View
   */
  function renderCompleted() {
    const completedItems = state.items.filter((item) => item.completed);
    completedItems.sort((a, b) => {
      const timeA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
      const timeB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
      return timeB - timeA;
    });

    DOM.completedItemsGrid.innerHTML = '';

    if (completedItems.length === 0) {
      DOM.completedEmptyState.style.display = 'flex';
      DOM.btnClearCompleted.style.display = 'none';
      return;
    }

    DOM.completedEmptyState.style.display = 'none';
    DOM.btnClearCompleted.style.display = 'inline-flex';
    completedItems.forEach((item) => DOM.completedItemsGrid.appendChild(createItemCardElement(item)));
  }

  /**
   * Update Summary Statistics Across App
   */
  function updateSummaryStats() {
    let overdueCount = 0;
    let attentionCount = 0; // Overdue + Today
    let upcomingCount = 0;
    let completedCount = 0;

    state.items.forEach((item) => {
      if (item.completed) {
        completedCount++;
        return;
      }
      const diff = getDayDifference(item.dueDate);
      if (diff !== null && diff < 0) {
        overdueCount++;
        attentionCount++;
      } else if (diff === 0) {
        attentionCount++;
      } else if (diff !== null && diff > 0) {
        upcomingCount++;
      }
    });

    // Overdue Pill
    if (overdueCount > 0) {
      DOM.statOverdueWrap.style.display = 'inline-flex';
      DOM.statOverdueCount.textContent = overdueCount;
    } else {
      DOM.statOverdueWrap.style.display = 'none';
    }

    DOM.statAttentionCount.textContent = attentionCount;
    DOM.statUpcomingCount.textContent = upcomingCount;
    DOM.statCompletedCount.textContent = completedCount;

    // Sidebar indicators
    DOM.statSidebarAttention.textContent = attentionCount;
    DOM.statSidebarUpcoming.textContent = upcomingCount;
    DOM.navBadgeAttention.textContent = attentionCount;
    DOM.navBadgeCompleted.textContent = completedCount;
  }

  /**
   * Updates Dynamic Header Greeting & Current Date
   */
  function updateGreetingAndDate() {
    const now = new Date();
    const hour = now.getHours();

    let greeting = 'Good morning 👋';
    if (hour >= 12 && hour < 17) {
      greeting = 'Good afternoon 👋';
    } else if (hour >= 17 || hour < 5) {
      greeting = 'Good evening 👋';
    }

    DOM.greetingHeading.textContent = greeting;

    const dateOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    DOM.headerTodayDate.textContent = now.toLocaleDateString(undefined, dateOptions);
  }

  const SVG_ICONS = {
    'layout-dashboard': '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>',
    'git-commit': '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><line x1="3" x2="9" y1="12" y2="12"/><line x1="15" x2="21" y1="12" y2="12"/></svg>',
    'calendar-range': '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M17 14h-6"/><path d="M13 18H7"/><path d="M7 14h.01"/><path d="M17 18h.01"/></svg>',
    'check-circle-2': '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
    'sliders-horizontal': '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/></svg>',
    'moon': '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>',
    'sun': '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>',
    'sparkles': '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>',
    'plus': '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
    'search': '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
    'x': '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
    'trash-2': '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>',
    'inbox': '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>',
    'palette': '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>',
    'laptop': '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/></svg>',
    'database': '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>',
    'download': '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>',
    'upload': '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>',
    'refresh-cw': '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>',
    'shield-check': '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>',
    'alert-triangle': '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>',
    'keyboard': '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h.001"/><path d="M10 8h.001"/><path d="M14 8h.001"/><path d="M18 8h.001"/><path d="M6 12h.001"/><path d="M18 12h.001"/><path d="M10 12h4"/><path d="M6 16h.001"/><path d="M10 16h4"/><path d="M18 16h.001"/></svg>',
    'calendar-clock': '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><circle cx="16" cy="16" r="6"/><polyline points="16 14 16 16 18 18"/></svg>',
    'calendar': '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>',
    'clock': '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    'repeat': '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>',
    'check': '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    'check-check': '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg>',
    'edit-3': '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>'
  };

  /**
   * Renders Lucide Icons or handles offline SVG fallbacks
   */
  function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    } else {
      document.querySelectorAll('[data-lucide]').forEach((el) => {
        const name = el.getAttribute('data-lucide');
        if (SVG_ICONS[name]) {
          el.innerHTML = SVG_ICONS[name];
        }
      });
    }
  }

  /**
   * Master Render Function
   */
  function renderAll() {
    updateSummaryStats();
    updateGreetingAndDate();

    if (state.currentView === 'dashboard') {
      renderDashboard();
    } else if (state.currentView === 'timeline') {
      renderTimeline();
    } else if (state.currentView === 'upcoming') {
      renderUpcoming();
    } else if (state.currentView === 'completed') {
      renderCompleted();
    }

    // Welcome banner visibility
    if (!state.welcomeDismissed && state.items.length <= 4) {
      DOM.welcomeBanner.style.display = 'flex';
    } else {
      DOM.welcomeBanner.style.display = 'none';
    }

    refreshIcons();
  }

  // =========================================================================
  // VIEW NAVIGATION
  // =========================================================================
  function switchView(viewName) {
    if (!['dashboard', 'timeline', 'upcoming', 'completed', 'settings'].includes(viewName)) return;

    state.currentView = viewName;

    // Update active class on sidebar items
    DOM.sidebarNavItems.forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-view') === viewName);
    });

    // Update active class on mobile bottom nav
    DOM.bottomNavItems.forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-view') === viewName);
    });

    // Toggle panels
    DOM.viewPanels.forEach((panel) => {
      const isTarget = panel.id === `view-${viewName}`;
      panel.classList.toggle('active', isTarget);
      panel.style.display = isTarget ? 'block' : 'none';
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    renderAll();
  }

  // =========================================================================
  // THEME MANAGEMENT
  // =========================================================================
  function applyTheme(themeChoice) {
    state.theme = themeChoice;
    let effectiveTheme = themeChoice;

    if (themeChoice === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      effectiveTheme = prefersDark ? 'dark' : 'light';
    }

    document.documentElement.setAttribute('data-theme', effectiveTheme);

    // Update button states in Settings
    DOM.themeChoiceBtns.forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-theme-choice') === themeChoice);
    });

    // Update toggle icons
    const iconName = effectiveTheme === 'dark' ? 'sun' : 'moon';
    DOM.themeIcon.setAttribute('data-lucide', iconName);
    DOM.mobileThemeIcon.setAttribute('data-lucide', iconName);

    saveState();
    refreshIcons();
  }

  function toggleThemeQuick() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  }

  // =========================================================================
  // DATA IMPORT & EXPORT
  // =========================================================================
  function exportDataJSON() {
    const exportPayload = {
      app: 'Life Admin',
      version: '1.0.0',
      tagline: "Life Admin — Put it somewhere you'll remember.",
      exportedAt: new Date().toISOString(),
      items: state.items
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `life-admin-backup-${getTodayString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Data exported successfully.');
  }

  function importDataJSON(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        let importedItems = [];

        if (Array.isArray(parsed)) {
          importedItems = parsed;
        } else if (parsed.items && Array.isArray(parsed.items)) {
          importedItems = parsed.items;
        } else {
          throw new Error('Unrecognized JSON structure');
        }

        // Validate items
        const sanitized = importedItems.map((it) => ({
          id: it.id || 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
          title: String(it.title || 'Untitled'),
          category: it.category && CATEGORIES[it.category] ? it.category : 'other',
          dueDate: it.dueDate || null,
          dueTime: it.dueTime || null,
          recurrence: it.recurrence || 'none',
          notes: String(it.notes || ''),
          completed: Boolean(it.completed),
          completedAt: it.completedAt || null,
          createdAt: it.createdAt || new Date().toISOString()
        }));

        state.items = sanitized;
        saveState();
        renderAll();
        showToast(`Imported ${sanitized.length} items successfully.`);
      } catch (err) {
        console.error('Import failed:', err);
        showToast('⚠️ Could not import file. Please select a valid Life Admin JSON backup.');
      } finally {
        event.target.value = '';
      }
    };
    reader.readAsText(file);
  }

  // =========================================================================
  // EVENT LISTENERS & SETUP
  // =========================================================================
  function setupEventListeners() {
    // Navigation items
    DOM.sidebarNavItems.forEach((btn) => {
      btn.addEventListener('click', () => switchView(btn.getAttribute('data-view')));
    });

    DOM.bottomNavItems.forEach((btn) => {
      btn.addEventListener('click', () => switchView(btn.getAttribute('data-view')));
    });

    // Theme toggles
    DOM.themeToggle.addEventListener('click', toggleThemeQuick);
    DOM.mobileThemeToggle.addEventListener('click', toggleThemeQuick);

    DOM.themeChoiceBtns.forEach((btn) => {
      btn.addEventListener('click', () => applyTheme(btn.getAttribute('data-theme-choice')));
    });

    // Quick Add
    DOM.quickAddForm.addEventListener('submit', handleQuickAddSubmit);
    DOM.quickAddInput.addEventListener('input', updateLiveNlpPreview);

    // Example Chips
    DOM.exampleChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        DOM.quickAddInput.value = chip.getAttribute('data-example');
        DOM.quickAddInput.focus();
        updateLiveNlpPreview();
      });
    });

    // Search Box
    DOM.searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      DOM.searchClearBtn.style.display = state.searchQuery ? 'flex' : 'none';
      renderDashboard();
    });

    DOM.searchClearBtn.addEventListener('click', () => {
      state.searchQuery = '';
      DOM.searchInput.value = '';
      DOM.searchClearBtn.style.display = 'none';
      DOM.searchInput.focus();
      renderDashboard();
    });

    // Urgency Filter Pills
    DOM.filterPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        DOM.filterPills.forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
        state.activeFilter = pill.getAttribute('data-filter');
        renderDashboard();
      });
    });

    // Category Dropdown
    DOM.categoryFilterSelect.addEventListener('change', (e) => {
      state.selectedCategory = e.target.value;
      renderDashboard();
    });

    // Welcome Banner
    DOM.btnDismissWelcome.addEventListener('click', () => {
      state.welcomeDismissed = true;
      saveState();
      DOM.welcomeBanner.style.display = 'none';
    });

    DOM.btnLoadSamples.addEventListener('click', () => {
      state.items = getInitialSampleData();
      saveState();
      renderAll();
      showToast('Sample items loaded.');
    });

    // Focus quick add from empty state
    DOM.btnEmptyAddFocus.addEventListener('click', () => {
      DOM.quickAddInput.focus();
    });

    // Clear completed history button
    DOM.btnClearCompleted.addEventListener('click', promptClearCompleted);

    // Settings actions
    DOM.btnExportData.addEventListener('click', exportDataJSON);
    DOM.importFileInput.addEventListener('change', importDataJSON);
    DOM.btnSettingsLoadSamples.addEventListener('click', () => {
      state.items = getInitialSampleData();
      saveState();
      renderAll();
      showToast('Sample items loaded.');
    });
    DOM.btnTriggerClearAll.addEventListener('click', promptClearAllData);

    // Date Prompt Modal options
    DOM.promptOptBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        handleDatePromptChoice(btn.getAttribute('data-choice'));
      });
    });

    DOM.btnConfirmPromptCustom.addEventListener('click', handleCustomDatePromptSave);
    DOM.btnCancelDatePrompt.addEventListener('click', closeModals);

    // Edit Modal
    DOM.editItemForm.addEventListener('submit', handleSaveEdit);
    DOM.btnCloseEditModal.addEventListener('click', closeModals);
    DOM.btnCancelEdit.addEventListener('click', closeModals);

    // Confirm Modal Cancel
    DOM.btnConfirmCancel.addEventListener('click', closeModals);

    // Close modals on Backdrop Click
    [DOM.modalDatePrompt, DOM.modalEditItem, DOM.modalConfirm].forEach((modal) => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModals();
        }
      });
    });

    // Global Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      // Escape closes modals or clears search
      if (e.key === 'Escape') {
        closeModals();
        if (state.searchQuery) {
          state.searchQuery = '';
          DOM.searchInput.value = '';
          DOM.searchClearBtn.style.display = 'none';
          renderDashboard();
        }
        return;
      }

      // If user is inside an input, textarea, or select, don't trigger global shortcuts
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
        return;
      }

      // '/' or 'n' focuses Quick Add
      if (e.key === '/' || e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        DOM.quickAddInput.focus();
        return;
      }

      // Number keys 1-5 switch views
      if (e.key === '1') switchView('dashboard');
      if (e.key === '2') switchView('timeline');
      if (e.key === '3') switchView('upcoming');
      if (e.key === '4') switchView('completed');
      if (e.key === '5') switchView('settings');
    });

    // Listen for System Theme preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (state.theme === 'system') {
        applyTheme('system');
      }
    });

    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch((err) => {
          console.log('SW registration note:', err);
        });
      });
    }
  }

  // =========================================================================
  // INITIALIZATION
  // =========================================================================
  function init() {
    loadState();
    applyTheme(state.theme);
    setupEventListeners();
    renderAll();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
