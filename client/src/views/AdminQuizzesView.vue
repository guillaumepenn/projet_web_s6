<template>
  <div class="admin-page">

    <!-- Page Header -->
    <section class="page-header">
      <div class="container">
        <div class="admin-header-content">
          <div>
            <div class="admin-badge">Admin Panel</div>
            <h1>Quiz Management</h1>
            <p>View, edit and delete quizzes</p>
          </div>
          <button class="btn btn-primary add-btn" @click="openCreateModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            New Quiz
          </button>
        </div>
      </div>
    </section>

    <!-- Stats Bar -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-bar">
          <div class="stat-item">
            <span class="stat-value">{{ quizzes.length }}</span>
            <span class="stat-label">Total Quizzes</span>
          </div>
          <div class="stat-separator"></div>
          <div class="stat-item" v-for="domain in domainStats" :key="domain.name">
            <span class="stat-value">{{ domain.count }}</span>
            <span class="stat-label">{{ domain.name }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Filter Bar -->
    <section class="filter-section">
      <div class="container">
        <div class="filter-bar">
          <div class="filter-group">
            <label>Field:</label>
            <select v-model="filterDomain" class="filter-select">
              <option value="all">All fields</option>
              <option v-for="d in domains" :key="d" :value="d.toLowerCase()">{{ d }}</option>
            </select>
          </div>
          <div class="search-group">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input type="text" v-model="filterSearch" class="search-input" placeholder="Search a quiz...">
          </div>
        </div>
      </div>
    </section>

    <!-- Quizzes Table -->
    <section class="table-section">
      <div class="container">
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th><button class="sort-btn" :class="{ active: sortField === 'id' }" @click="toggleSort('id')"># <span class="sort-arrow">{{ sortField === 'id' ? (sortDir === 'asc' ? '↑' : '↓') : '' }}</span></button></th>
                <th><button class="sort-btn" :class="{ active: sortField === 'title' }" @click="toggleSort('title')">Title <span class="sort-arrow">{{ sortField === 'title' ? (sortDir === 'asc' ? '↑' : '↓') : '' }}</span></button></th>
                <th><button class="sort-btn" :class="{ active: sortField === 'domain' }" @click="toggleSort('domain')">Field <span class="sort-arrow">{{ sortField === 'domain' ? (sortDir === 'asc' ? '↑' : '↓') : '' }}</span></button></th>
                <th><button class="sort-btn" :class="{ active: sortField === 'questions' }" @click="toggleSort('questions')">Questions <span class="sort-arrow">{{ sortField === 'questions' ? (sortDir === 'asc' ? '↑' : '↓') : '' }}</span></button></th>
                <th>Related Lesson</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="quiz in filteredAndSorted" :key="quiz.id" class="table-row">
                <td class="id-cell">{{ quiz.id }}</td>
                <td><strong>{{ quiz.title }}</strong></td>
                <td>
                  <span :class="['domain-badge', quiz.domain]">{{ quiz.domain }}</span>
                </td>
                <td>
                  <span class="question-count">{{ quiz.questions.length }}</span>
                </td>
                <td class="lesson-cell">
                  <span v-if="quiz.relatedLesson" class="lesson-badge">Lesson #{{ quiz.relatedLesson }}</span>
                  <span v-else class="no-lesson">—</span>
                </td>
                <td>
                  <div class="action-group">
                    <button class="action-btn preview-btn" @click="openPreview(quiz)" title="Preview">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                      Preview
                    </button>
                    <button class="action-btn edit-btn" @click="openEditModal(quiz)" title="Edit">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                      Edit
                    </button>
                    <button class="action-btn delete-btn" @click="confirmDelete(quiz)" title="Delete">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredAndSorted.length === 0">
                <td colspan="6" class="empty-row">No quiz matches your search.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="table-footer">
          <p class="results-count"><span>{{ filteredAndSorted.length }}</span> quiz(zes) displayed</p>
        </div>
      </div>
    </section>

    <!-- ============================================================
         MODAL: PREVIEW
    ============================================================ -->
    <div v-if="previewQuiz" class="modal-overlay" @click.self="previewQuiz = null">
      <div class="modal-container modal-large">
        <button class="close-btn" @click="previewQuiz = null">&times;</button>
        <div class="modal-header">
          <span :class="['domain-badge', previewQuiz.domain]">{{ previewQuiz.domain }}</span>
          <h2>{{ previewQuiz.title }}</h2>
          <p class="modal-subtitle">{{ previewQuiz.questions.length }} question(s) · Lesson #{{ previewQuiz.relatedLesson || '—' }}</p>
        </div>
        <div class="preview-questions">
          <div v-for="(q, i) in previewQuiz.questions" :key="q.id" class="preview-question">
            <div class="preview-q-header">
              <span class="preview-q-num">Q{{ i + 1 }}</span>
              <p class="preview-q-text">{{ q.question }}</p>
            </div>
            <ul class="preview-answers">
              <li v-for="ans in q.answers" :key="ans.id" :class="{ correct: ans.id === q.correctAnswer }">
                <span class="ans-letter">{{ ans.id.toUpperCase() }}</span>
                {{ ans.text }}
                <span v-if="ans.id === q.correctAnswer" class="correct-badge">✓ Correct</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="previewQuiz = null">Close</button>
          <button class="btn btn-primary" @click="openEditModal(previewQuiz); previewQuiz = null">Edit this quiz</button>
        </div>
      </div>
    </div>

    <!-- ============================================================
         MODAL: EDIT / CREATE
    ============================================================ -->
    <div v-if="editModal.open" class="modal-overlay" @click.self="closeEditModal">
      <div class="modal-container modal-large">
        <button class="close-btn" @click="closeEditModal">&times;</button>
        <div class="modal-header">
          <h2>{{ editModal.isNew ? 'Create a Quiz' : 'Edit Quiz' }}</h2>
          <p class="modal-subtitle">{{ editModal.isNew ? 'Fill in the information to add a new quiz' : `Editing: ${editModal.original?.title}` }}</p>
        </div>

        <div class="edit-form">
          <!-- Basic info -->
          <div class="form-row">
            <div class="form-group">
              <label>Title *</label>
              <input type="text" v-model="editModal.data.title" placeholder="Quiz title" class="form-input">
            </div>
            <div class="form-group">
              <label>Field *</label>
              <select v-model="editModal.data.domain" class="form-input">
                <option value="">— Select a field —</option>
                <option v-for="d in domains" :key="d" :value="d.toLowerCase()">{{ d }}</option>
              </select>
            </div>
            <div class="form-group form-group-sm">
              <label>Related Lesson</label>
              <input type="number" v-model.number="editModal.data.relatedLesson" placeholder="e.g. 1" class="form-input" min="1">
            </div>
          </div>

          <!-- Questions -->
          <div class="questions-editor">
            <div class="questions-editor-header">
              <h3>Questions ({{ editModal.data.questions.length }})</h3>
              <button class="btn btn-sm btn-outline" @click="addQuestion">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                Add a question
              </button>
            </div>

            <div v-for="(q, qi) in editModal.data.questions" :key="qi" class="question-editor-card">
              <div class="q-card-header">
                <span class="q-card-num">Q{{ qi + 1 }}</span>
                <input type="text" v-model="q.question" placeholder="Question text..." class="form-input q-input">
                <button class="icon-btn danger-icon" @click="removeQuestion(qi)" title="Delete question" :disabled="editModal.data.questions.length <= 1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>

              <div class="answers-editor">
                <div v-for="(ans, ai) in q.answers" :key="ans.id" class="answer-editor-row">
                  <label :class="['radio-correct', { selected: q.correctAnswer === ans.id }]" :title="'Mark as correct answer'">
                    <input type="radio" :name="`correct-${qi}`" :value="ans.id" v-model="q.correctAnswer">
                    <span class="radio-dot"></span>
                  </label>
                  <span class="ans-letter-label">{{ ans.id.toUpperCase() }}</span>
                  <input type="text" v-model="ans.text" :placeholder="`Answer ${ans.id.toUpperCase()}...`" class="form-input ans-input">
                  <button class="icon-btn danger-icon" @click="removeAnswer(qi, ai)" :disabled="q.answers.length <= 2" title="Delete answer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                </div>
                <button class="btn btn-xs btn-outline" @click="addAnswer(qi)" :disabled="q.answers.length >= 5">
                  + Add an answer
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn btn-secondary" @click="closeEditModal">Cancel</button>
          <button class="btn btn-primary" @click="saveQuiz">
            {{ editModal.isNew ? 'Create' : 'Save changes' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ============================================================
         MODAL: DELETE CONFIRMATION
    ============================================================ -->
    <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
      <div class="modal-container modal-small">
        <div class="delete-modal-content">
          <div class="delete-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </div>
          <h2>Delete this quiz?</h2>
          <p>You are about to permanently delete <strong>« {{ deleteTarget.title }} »</strong>. This action cannot be undone.</p>
          <div class="modal-actions">
            <button class="btn btn-secondary" @click="deleteTarget = null">Cancel</button>
            <button class="btn btn-danger" @click="executeDelete">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast notification -->
    <transition name="toast">
      <div v-if="toast.visible" :class="['toast', toast.type]">{{ toast.message }}</div>
    </transition>

  </div>
</template>

<script>
export default { name: 'AdminQuizzes' }
</script>

<script setup>
import { ref, computed, reactive } from 'vue';
import { quizzesData } from '../assets/data.js';

// ── Reactive quiz list (clone of imported data so edits stay local) ──
const quizzes = ref(quizzesData.map(q => JSON.parse(JSON.stringify(q))));

// ── Filters ──
const filterDomain = ref('all');
const filterSearch = ref('');

// ── Sort ──
const sortField = ref('id');
const sortDir = ref('asc');

const toggleSort = (field) => {
  if (sortField.value === field) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = field;
    sortDir.value = 'asc';
  }
};

const domains = ['Astronomy', 'Biology', 'Chemistry', 'Physics', 'Geology'];

const domainStats = computed(() =>
  domains.map(d => ({
    name: d,
    count: quizzes.value.filter(q => q.domain === d.toLowerCase()).length
  })).filter(d => d.count > 0)
);

// ── Filtered & sorted list ──
const filteredAndSorted = computed(() => {
  let list = quizzes.value.filter(q => {
    const matchDomain = filterDomain.value === 'all' || q.domain === filterDomain.value;
    const matchSearch = q.title.toLowerCase().includes(filterSearch.value.toLowerCase());
    return matchDomain && matchSearch;
  });

  list = [...list].sort((a, b) => {
    let av = sortField.value === 'questions' ? a.questions.length : a[sortField.value];
    let bv = sortField.value === 'questions' ? b.questions.length : b[sortField.value];
    const mod = sortDir.value === 'asc' ? 1 : -1;
    if (av < bv) return -1 * mod;
    if (av > bv) return 1 * mod;
    return 0;
  });

  return list;
});

// ── Preview ──
const previewQuiz = ref(null);
const openPreview = (quiz) => { previewQuiz.value = JSON.parse(JSON.stringify(quiz)); };

// ── Toast ──
const toast = reactive({ visible: false, message: '', type: 'success' });
const showToast = (message, type = 'success') => {
  toast.message = message;
  toast.type = type;
  toast.visible = true;
  setTimeout(() => { toast.visible = false; }, 3000);
};

// ── Delete ──
const deleteTarget = ref(null);
const confirmDelete = (quiz) => { deleteTarget.value = quiz; };
const executeDelete = () => {
  quizzes.value = quizzes.value.filter(q => q.id !== deleteTarget.value.id);
  showToast(`Quiz « ${deleteTarget.value.title} » deleted.`, 'error');
  deleteTarget.value = null;
};

// ── Edit / Create modal ──
const editModal = reactive({
  open: false,
  isNew: false,
  original: null,
  data: {}
});

const blankQuiz = () => ({
  id: Math.max(...quizzes.value.map(q => q.id), 0) + 1,
  title: '',
  domain: '',
  relatedLesson: null,
  questions: [
    {
      id: 'q1',
      question: '',
      answers: [
        { id: 'a', text: '' },
        { id: 'b', text: '' }
      ],
      correctAnswer: 'a'
    }
  ]
});

const openCreateModal = () => {
  editModal.isNew = true;
  editModal.original = null;
  editModal.data = blankQuiz();
  editModal.open = true;
};

const openEditModal = (quiz) => {
  editModal.isNew = false;
  editModal.original = quiz;
  editModal.data = JSON.parse(JSON.stringify(quiz));
  editModal.open = true;
};

const closeEditModal = () => { editModal.open = false; };

// Question helpers
const addQuestion = () => {
  const n = editModal.data.questions.length + 1;
  editModal.data.questions.push({
    id: `q${n}`,
    question: '',
    answers: [{ id: 'a', text: '' }, { id: 'b', text: '' }],
    correctAnswer: 'a'
  });
};

const removeQuestion = (qi) => {
  if (editModal.data.questions.length > 1) editModal.data.questions.splice(qi, 1);
};

const answerIds = ['a', 'b', 'c', 'd', 'e'];
const addAnswer = (qi) => {
  const q = editModal.data.questions[qi];
  if (q.answers.length < 5) {
    q.answers.push({ id: answerIds[q.answers.length], text: '' });
  }
};

const removeAnswer = (qi, ai) => {
  const q = editModal.data.questions[qi];
  if (q.answers.length > 2) {
    const removed = q.answers.splice(ai, 1)[0];
    // Reassign letters
    q.answers.forEach((a, i) => { a.id = answerIds[i]; });
    if (q.correctAnswer === removed.id) q.correctAnswer = q.answers[0].id;
  }
};

// Validation & save
const saveQuiz = () => {
  const d = editModal.data;
  if (!d.title.trim()) { showToast('Please enter a title.', 'error'); return; }
  if (!d.domain) { showToast('Please select a field.', 'error'); return; }
  for (const [i, q] of d.questions.entries()) {
    if (!q.question.trim()) { showToast(`Question ${i + 1}: please fill in the text.`, 'error'); return; }
    for (const a of q.answers) {
      if (!a.text.trim()) { showToast(`Q${i + 1}: all answer fields must be filled in.`, 'error'); return; }
    }
  }

  if (editModal.isNew) {
    quizzes.value.push(JSON.parse(JSON.stringify(d)));
    showToast(`Quiz « ${d.title} » created!`);
  } else {
    const idx = quizzes.value.findIndex(q => q.id === editModal.original.id);
    if (idx !== -1) quizzes.value[idx] = JSON.parse(JSON.stringify(d));
    showToast(`Quiz « ${d.title} » updated.`);
  }
  closeEditModal();
};
</script>

<style scoped>
@import '../assets/styles.css';

/* ── Page header ── */
.admin-header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}
.admin-badge {
  display: inline-block;
  background: rgba(255,255,255,0.2);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
  margin-bottom: 0.5rem;
}
.add-btn {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  white-space: nowrap;
}

/* ── Stats ── */
.stats-section { background: #fff; border-bottom: 1px solid var(--color-gray-200); }
.stats-bar {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 1rem 0;
  overflow-x: auto;
}
.stat-item { text-align: center; padding: 0.4rem 1.5rem; }
.stat-value { display: block; font-size: 1.4rem; font-weight: 700; color: var(--color-primary); }
.stat-label { font-size: 0.78rem; color: var(--color-gray-500); text-transform: capitalize; }
.stat-separator { width: 1px; height: 2.5rem; background: var(--color-gray-200); flex-shrink: 0; }

/* ── Filter ── */
.filter-section { background: #fff; padding: 1rem 0; border-bottom: 1px solid var(--color-gray-200); }
.filter-bar { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
.search-group { position: relative; flex: 1; min-width: 200px; }
.search-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--color-gray-400); }
.search-input { padding-left: 2.2rem !important; }

/* ── Table ── */
.table-section { padding: 2rem 0; }
.id-cell { color: var(--color-gray-400); font-size: 0.85rem; }
.question-count {
  background: var(--color-gray-100);
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-gray-600);
}
.lesson-badge {
  background: #eef2ff;
  color: #4f46e5;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
}
.no-lesson { color: var(--color-gray-300); }

/* ── Action buttons ── */
.action-group { display: flex; gap: 0.4rem; }
.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.35rem 0.65rem;
  border-radius: var(--radius-md);
  font-size: 0.78rem;
  font-weight: 600;
  transition: all var(--transition-fast);
  border: 1px solid transparent;
}
.preview-btn { background: var(--color-gray-100); color: var(--color-gray-600); border-color: var(--color-gray-200); }
.preview-btn:hover { background: var(--color-gray-200); }
.edit-btn { background: #eff6ff; color: #2563eb; border-color: #bfdbfe; }
.edit-btn:hover { background: #dbeafe; }
.delete-btn { background: #fef2f2; color: var(--color-danger); border-color: #fecaca; }
.delete-btn:hover { background: #fee2e2; }

/* ── Modals ── */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex; align-items: center; justify-content: center;
  z-index: 500;
  padding: 1rem;
  backdrop-filter: blur(3px);
}
.modal-container {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 25px 50px rgba(0,0,0,0.25);
}
.modal-large { max-width: 760px; }
.modal-small { max-width: 420px; }
.close-btn {
  position: absolute; top: 1rem; right: 1.2rem;
  background: none; border: none;
  font-size: 1.6rem; color: var(--color-gray-400);
  cursor: pointer; line-height: 1;
  transition: color var(--transition-fast);
}
.close-btn:hover { color: var(--color-gray-800); }
.modal-header { padding: 1.8rem 2rem 1rem; border-bottom: 1px solid var(--color-gray-100); }
.modal-header h2 { font-size: 1.3rem; margin-top: 0.4rem; }
.modal-subtitle { color: var(--color-gray-500); font-size: 0.9rem; margin-top: 0.25rem; }
.modal-actions {
  display: flex; gap: 0.75rem; justify-content: flex-end;
  padding: 1.2rem 2rem 1.8rem;
  border-top: 1px solid var(--color-gray-100);
}

/* ── Preview ── */
.preview-questions { padding: 1.2rem 2rem; display: flex; flex-direction: column; gap: 1.2rem; }
.preview-question { background: var(--color-gray-50); border-radius: 10px; padding: 1rem 1.2rem; }
.preview-q-header { display: flex; gap: 0.7rem; align-items: flex-start; margin-bottom: 0.75rem; }
.preview-q-num {
  background: var(--color-primary); color: #fff;
  font-size: 0.7rem; font-weight: 700; padding: 0.2rem 0.5rem;
  border-radius: 999px; flex-shrink: 0; margin-top: 2px;
}
.preview-q-text { font-weight: 600; color: var(--color-gray-800); }
.preview-answers { list-style: none; display: flex; flex-direction: column; gap: 0.4rem; padding: 0; }
.preview-answers li {
  display: flex; align-items: center; gap: 0.6rem;
  padding: 0.45rem 0.8rem; border-radius: 8px;
  background: #fff; border: 1px solid var(--color-gray-200);
  font-size: 0.88rem;
}
.preview-answers li.correct { background: #f0fdf4; border-color: #86efac; color: #166534; font-weight: 600; }
.ans-letter {
  width: 22px; height: 22px; border-radius: 50%;
  background: var(--color-gray-100); color: var(--color-gray-600);
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 0.72rem; font-weight: 700; flex-shrink: 0;
}
.preview-answers li.correct .ans-letter { background: #22c55e; color: #fff; }
.correct-badge { margin-left: auto; font-size: 0.75rem; color: #16a34a; font-weight: 700; }

/* ── Edit form ── */
.edit-form { padding: 1.5rem 2rem; display: flex; flex-direction: column; gap: 1.5rem; }
.form-row { display: flex; gap: 1rem; flex-wrap: wrap; }
.form-group { display: flex; flex-direction: column; gap: 0.4rem; flex: 1; min-width: 150px; }
.form-group label { font-size: 0.82rem; font-weight: 600; color: var(--color-gray-600); }
.form-group-sm { max-width: 140px; flex: 0 0 140px; }
.form-input {
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--color-gray-200);
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: inherit;
  transition: border-color var(--transition-fast);
  width: 100%;
}
.form-input:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 3px rgba(30,90,126,0.12); }

/* ── Questions editor ── */
.questions-editor { display: flex; flex-direction: column; gap: 1rem; }
.questions-editor-header { display: flex; align-items: center; justify-content: space-between; }
.questions-editor-header h3 { font-size: 1rem; color: var(--color-gray-700); }
.question-editor-card {
  border: 1px solid var(--color-gray-200);
  border-radius: 10px; padding: 1rem;
  background: var(--color-gray-50);
  display: flex; flex-direction: column; gap: 0.8rem;
}
.q-card-header { display: flex; align-items: center; gap: 0.7rem; }
.q-card-num {
  background: var(--color-primary); color: #fff;
  font-size: 0.72rem; font-weight: 700;
  padding: 0.2rem 0.55rem; border-radius: 999px;
  flex-shrink: 0;
}
.q-input { flex: 1; }
.answers-editor { display: flex; flex-direction: column; gap: 0.5rem; padding-left: 2rem; }
.answer-editor-row { display: flex; align-items: center; gap: 0.6rem; }
.ans-letter-label {
  font-size: 0.8rem; font-weight: 700; color: var(--color-gray-500);
  width: 20px; text-align: center; flex-shrink: 0;
}
.ans-input { flex: 1; }
.radio-correct { cursor: pointer; display: flex; align-items: center; }
.radio-correct input { display: none; }
.radio-dot {
  width: 18px; height: 18px; border-radius: 50%;
  border: 2px solid var(--color-gray-300);
  display: flex; align-items: center; justify-content: center;
  transition: all var(--transition-fast);
}
.radio-correct.selected .radio-dot { border-color: var(--color-accent); background: var(--color-accent); }
.radio-correct.selected .radio-dot::after {
  content: ''; width: 7px; height: 7px;
  border-radius: 50%; background: #fff;
}
.icon-btn {
  background: none; border: none;
  padding: 0.25rem; cursor: pointer;
  border-radius: 6px;
  display: flex; align-items: center;
  transition: background var(--transition-fast);
}
.danger-icon { color: var(--color-danger); }
.danger-icon:hover:not(:disabled) { background: #fee2e2; }
.danger-icon:disabled { opacity: 0.3; cursor: not-allowed; }

/* ── Buttons ── */
.btn-sm { padding: 0.4rem 0.8rem; font-size: 0.82rem; }
.btn-xs { padding: 0.3rem 0.65rem; font-size: 0.78rem; margin-top: 0.3rem; align-self: flex-start; }
.btn-outline {
  background: #fff;
  border: 1px solid var(--color-gray-300);
  color: var(--color-gray-600);
  border-radius: 8px;
  font-weight: 600;
  display: inline-flex; align-items: center; gap: 0.3rem;
  transition: all var(--transition-fast);
}
.btn-outline:hover { border-color: var(--color-primary); color: var(--color-primary); }
.btn-danger {
  background: var(--color-danger);
  color: #fff; padding: 0.6rem 1.4rem;
  border-radius: 8px; font-weight: 700;
  transition: background var(--transition-fast);
}
.btn-danger:hover { background: #c0392b; }

/* ── Delete modal ── */
.delete-modal-content { padding: 2.5rem 2rem; text-align: center; }
.delete-icon-wrapper {
  width: 64px; height: 64px; border-radius: 50%;
  background: #fef2f2; color: var(--color-danger);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 1.2rem;
}
.delete-modal-content h2 { font-size: 1.2rem; margin-bottom: 0.6rem; }
.delete-modal-content p { color: var(--color-gray-500); font-size: 0.9rem; margin-bottom: 1.5rem; }

/* ── Toast ── */
.toast {
  position: fixed; bottom: 2rem; right: 2rem;
  padding: 0.8rem 1.4rem;
  border-radius: 10px;
  font-weight: 600; font-size: 0.9rem;
  box-shadow: var(--shadow-lg);
  z-index: 9999;
  color: #fff;
}
.toast.success { background: var(--color-accent); }
.toast.error { background: var(--color-danger); }
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(1rem); }
</style>