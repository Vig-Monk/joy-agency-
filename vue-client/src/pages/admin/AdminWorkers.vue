<template>
  <div class="admin-root">
    <AdminNav />

    <div class="admin-content">
      <div class="page-header">
        <div>
          <p class="page-label">Management</p>
          <h1>Workers</h1>
        </div>
        <button class="btn-add" @click="openAdd">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M1 7h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Add Worker
        </button>
      </div>

      <div v-if="loading" class="state-loading">
        <div v-for="n in 4" :key="n" class="skeleton-row"></div>
      </div>
      <div v-else-if="error" class="state-msg state-error">{{ error }}</div>
      <div v-else-if="!workers.length" class="state-msg">No workers added yet.</div>

      <!-- Desktop table -->
      <div v-else class="table-wrap">
        <table class="workers-table">
          <thead>
            <tr>
              <th>Worker</th>
              <th>Category</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="worker in workers" :key="worker.id">
              <td class="td-worker">
                <div class="avatar">
                  <img v-if="worker.photo_url" :src="worker.photo_url" :alt="worker.name" />
                  <div v-else class="avatar-init">{{ worker.name.charAt(0) }}</div>
                </div>
                <span class="worker-name">{{ worker.name }}</span>
              </td>
              <td><span class="tag tag-cat">{{ worker.category }}</span></td>
              <td class="td-location">{{ worker.location || '—' }}</td>
              <td>
                <button
                  :class="['status-pill', worker.is_available ? 'pill-available' : 'pill-booked']"
                  @click="toggleAvail(worker)"
                >
                  <span class="pill-dot"></span>
                  {{ worker.is_available ? 'Available' : 'Booked' }}
                </button>
              </td>
              <td class="td-actions">
                <button class="btn-icon btn-edit" @click="openEdit(worker)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Edit
                </button>
                <button class="btn-icon btn-del" @click="confirmDelete(worker)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile cards -->
      <div v-if="!loading && !error && workers.length" class="mobile-cards">
        <div v-for="worker in workers" :key="'m-' + worker.id" class="mobile-card">
          <div class="mc-top">
            <div class="avatar avatar-lg">
              <img v-if="worker.photo_url" :src="worker.photo_url" :alt="worker.name" />
              <div v-else class="avatar-init">{{ worker.name.charAt(0) }}</div>
            </div>
            <div class="mc-info">
              <div class="worker-name">{{ worker.name }}</div>
              <span class="tag tag-cat">{{ worker.category }}</span>
              <div class="mc-location" v-if="worker.location">📍 {{ worker.location }}</div>
            </div>
            <button
              :class="['status-pill', 'ml-auto', worker.is_available ? 'pill-available' : 'pill-booked']"
              @click="toggleAvail(worker)"
            >
              <span class="pill-dot"></span>
              {{ worker.is_available ? 'Available' : 'Booked' }}
            </button>
          </div>
          <div class="mc-actions">
            <button class="btn-icon btn-edit" @click="openEdit(worker)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Edit
            </button>
            <button class="btn-icon btn-del" @click="confirmDelete(worker)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add / Edit Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="overlay" @click.self="closeModal">
        <div class="modal">
          <div class="modal-header">
            <h2>{{ editingWorker ? 'Edit Worker' : 'Add Worker' }}</h2>
            <button class="modal-close" @click="closeModal">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <form @submit.prevent="saveWorker" class="modal-form" novalidate>

            <!-- Photo picker -->
            <div class="mfield">
              <label>Photo</label>
              <div
                class="photo-picker"
                :class="{ 'has-photo': photoPreview || form.photo_url, uploading }"
                @click="triggerFilePick"
              >
                <img
                  v-if="photoPreview || form.photo_url"
                  :src="photoPreview || form.photo_url"
                  class="photo-preview"
                  alt="Worker photo"
                />
                <div v-if="uploading" class="upload-overlay">
                  <div class="upload-spinner"></div>
                  <span>Uploading… {{ uploadProgress }}%</span>
                </div>
                <div v-else-if="!photoPreview && !form.photo_url" class="photo-placeholder">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="3"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span>Tap to choose photo</span>
                  <small>From your phone gallery</small>
                </div>
                <div v-else-if="!uploading" class="photo-change-hint">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                  Change photo
                </div>
              </div>

              <input
                ref="fileInputRef"
                type="file"
                accept="image/*"
                style="display:none"
                @change="onFileSelected"
              />
              <p v-if="uploadError" class="field-error">{{ uploadError }}</p>
              <button
                v-if="form.photo_url || photoPreview"
                type="button"
                class="remove-photo-btn"
                @click.stop="removePhoto"
              >Remove photo</button>
            </div>

            <div class="mfield">
              <label>Full Name <span class="req">*</span></label>
              <input v-model="form.name" placeholder="e.g. Jane Wanjiru" required />
            </div>
            <div class="mfield">
              <label>Category <span class="req">*</span></label>
              <select v-model="form.category" required>
                <option value="">Select category</option>
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
            <div class="mfield">
              <label>Location</label>
              <input v-model="form.location" placeholder="e.g. Westlands, Nairobi" />
            </div>
            <div class="mfield">
              <label>Bio</label>
              <textarea v-model="form.bio" rows="3" placeholder="Brief description of experience and skills…" />
            </div>
            <label class="check-label">
              <input type="checkbox" v-model="form.is_available" />
              <span>Mark as available for placement</span>
            </label>
            <div v-if="formError" class="form-error">{{ formError }}</div>
            <div class="modal-footer">
              <button type="button" class="btn-cancel" @click="closeModal">Cancel</button>
              <button type="submit" class="btn-save" :disabled="saving || uploading">
                {{ saving ? 'Saving…' : 'Save Worker' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Delete confirm -->
    <Teleport to="body">
      <div v-if="deleteTarget" class="overlay" @click.self="deleteTarget = null">
        <div class="modal modal-sm">
          <div class="modal-header">
            <h2>Remove worker?</h2>
          </div>
          <p class="confirm-text">
            This will permanently delete <strong>{{ deleteTarget.name }}</strong> and cannot be undone.
          </p>
          <div class="modal-footer">
            <button class="btn-cancel" @click="deleteTarget = null">Cancel</button>
            <button class="btn-danger" @click="doDelete" :disabled="deleting">
              {{ deleting ? 'Deleting…' : 'Yes, Delete' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminNav from '../../components/AdminNav.vue'
import { getWorkers, createWorker, updateWorker, deleteWorker, toggleAvailability } from '../../services/api.js'

// ── Cloudinary config ──────────────────────────────────────
const CLOUDINARY_CLOUD_NAME    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME    || ''
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || ''
// ──────────────────────────────────────────────────────────

const workers       = ref([])
const loading       = ref(true)
const error         = ref(null)
const showModal     = ref(false)
const editingWorker = ref(null)
const saving        = ref(false)
const formError     = ref(null)
const deleteTarget  = ref(null)
const deleting      = ref(false)

const fileInputRef   = ref(null)
const photoPreview   = ref(null)
const uploading      = ref(false)
const uploadProgress = ref(0)
const uploadError    = ref(null)

const categories = ['Nanny', 'Cleaner', 'Cook', 'Caretaker', 'Gardener', 'Driver', 'Security', 'Other']
const emptyForm  = () => ({ name: '', category: '', location: '', photo_url: '', bio: '', is_available: true })
const form       = ref(emptyForm())

async function loadWorkers() {
  loading.value = true; error.value = null
  try   { workers.value = await getWorkers() }
  catch (err) { error.value = err.message }
  finally { loading.value = false }
}

function openAdd() {
  editingWorker.value = null; form.value = emptyForm()
  photoPreview.value = null; uploadError.value = null; formError.value = null
  showModal.value = true
}

function openEdit(w) {
  editingWorker.value = w; form.value = { ...w }
  photoPreview.value = null; uploadError.value = null; formError.value = null
  showModal.value = true
}

function closeModal() {
  showModal.value = false; editingWorker.value = null; photoPreview.value = null
}

async function saveWorker() {
  if (uploading.value) return
  saving.value = true; formError.value = null
  try {
    if (editingWorker.value) {
      const updated = await updateWorker(editingWorker.value.id, form.value)
      const idx = workers.value.findIndex(w => w.id === updated.id)
      if (idx !== -1) workers.value[idx] = updated
    } else {
      workers.value.unshift(await createWorker(form.value))
    }
    closeModal()
  } catch (err) { formError.value = err.message }
  finally { saving.value = false }
}

async function toggleAvail(worker) {
  try {
    const updated = await toggleAvailability(worker.id, !worker.is_available)
    const idx = workers.value.findIndex(w => w.id === updated.id)
    if (idx !== -1) workers.value[idx] = updated
  } catch (err) { alert('Failed: ' + err.message) }
}

function confirmDelete(worker) { deleteTarget.value = worker }

async function doDelete() {
  deleting.value = true
  try {
    await deleteWorker(deleteTarget.value.id)
    workers.value = workers.value.filter(w => w.id !== deleteTarget.value.id)
    deleteTarget.value = null
  } catch (err) { alert('Failed: ' + err.message) }
  finally { deleting.value = false }
}

function triggerFilePick() {
  if (!uploading.value) fileInputRef.value?.click()
}

function removePhoto() {
  form.value.photo_url = ''; photoPreview.value = null; uploadError.value = null
  if (fileInputRef.value) fileInputRef.value.value = ''
}

async function onFileSelected(event) {
  const file = event.target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) { uploadError.value = 'Please select an image file.'; return }
  if (file.size > 8 * 1024 * 1024)    { uploadError.value = 'Image must be smaller than 8 MB.'; return }

  photoPreview.value   = URL.createObjectURL(file)
  uploadError.value    = null
  uploading.value      = true
  uploadProgress.value = 0

  try {
    form.value.photo_url = await uploadToCloudinary(file)
  } catch {
    uploadError.value    = 'Upload failed. Check your internet and try again.'
    photoPreview.value   = null
    form.value.photo_url = ''
  } finally {
    uploading.value = false
    if (fileInputRef.value) fileInputRef.value.value = ''
  }
}

function uploadToCloudinary(file) {
  return new Promise((resolve, reject) => {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
    fd.append('folder', 'joy-agency/workers')
    // ✅ NO transformation param — unsigned presets reject it and return 400
    // Images are auto-optimised by Cloudinary on delivery

    const xhr = new XMLHttpRequest()

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable)
        uploadProgress.value = Math.round((e.loaded / e.total) * 100)
    }

    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText)
        resolve(data.secure_url)
      } else {
        // Parse Cloudinary's error message so it's useful during debugging
        try {
          const err = JSON.parse(xhr.responseText)
          reject(new Error(err?.error?.message || `Upload failed (${xhr.status})`))
        } catch {
          reject(new Error(`Upload failed (${xhr.status})`))
        }
      }
    }

    xhr.onerror = () => reject(new Error('Network error — check your connection'))

    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`)
    xhr.send(fd)
  })
}

onMounted(loadWorkers)
</script>

<style scoped>
.admin-root { min-height: 100vh; background: #0f1117; color: #e8eaf0; font-family: 'DM Sans', sans-serif; }
.admin-content { padding: 24px 20px 60px; max-width: 960px; margin: 0 auto; }

.page-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 24px; gap: 12px; }
.page-label { font-size: 0.7rem; font-weight: 600; letter-spacing: 1.2px; text-transform: uppercase; color: rgba(232,234,240,0.35); margin-bottom: 4px; }
.page-header h1 { font-size: 1.5rem; font-weight: 700; color: #f0f2f7; margin: 0; }

.btn-add { display: flex; align-items: center; gap: 7px; background: #1BBFBF; color: #0f1117; border: none; padding: 9px 18px; border-radius: 9px; font-size: 0.875rem; font-weight: 700; cursor: pointer; flex-shrink: 0; font-family: 'DM Sans', sans-serif; transition: background 0.15s, transform 0.15s; }
.btn-add:hover { background: #17aaaa; transform: translateY(-1px); }

.state-loading { display: flex; flex-direction: column; gap: 8px; }
.skeleton-row { height: 56px; border-radius: 10px; background: linear-gradient(90deg,#181c25 25%,#1e2330 50%,#181c25 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
.state-msg { text-align: center; padding: 48px 20px; color: rgba(232,234,240,0.4); font-size: 0.95rem; }
.state-error { color: #E91E8C; }

.table-wrap { background: #181c25; border-radius: 14px; overflow: hidden; border: 1px solid rgba(255,255,255,0.06); }
.workers-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; table-layout: fixed; }
.workers-table th { text-align: left; padding: 13px 16px; background: #1a1e28; color: rgba(232,234,240,0.4); font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; border-bottom: 1px solid rgba(255,255,255,0.06); white-space: nowrap; }
.workers-table th:nth-child(1){width:34%} .workers-table th:nth-child(2){width:16%} .workers-table th:nth-child(3){width:18%} .workers-table th:nth-child(4){width:16%} .workers-table th:nth-child(5){width:16%}
.workers-table td { padding: 14px 16px; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle; color: #c8ccda; font-size: 0.88rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.workers-table tr:last-child td { border-bottom: none; }
.workers-table tr:hover td { background: rgba(255,255,255,0.02); }

.td-worker { display: flex; align-items: center; gap: 10px; }
.avatar { width: 34px; height: 34px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: rgba(27,191,191,0.12); }
.avatar-lg { width: 44px; height: 44px; }
.avatar img { width: 100%; height: 100%; object-fit: cover; }
.avatar-init { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #1BBFBF; font-size: 0.85rem; }
.worker-name { font-weight: 600; color: #e8eaf0; }
.tag { display: inline-block; padding: 3px 9px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
.tag-cat { background: rgba(247,148,29,0.12); color: #F7941D; }
.td-location { color: rgba(200,204,218,0.55) !important; font-size: 0.83rem !important; }

.status-pill { display: inline-flex; align-items: center; gap: 5px; padding: 5px 11px; border-radius: 20px; border: none; font-size: 0.78rem; font-weight: 700; cursor: pointer; transition: all 0.15s; white-space: nowrap; font-family: 'DM Sans', sans-serif; }
.pill-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.pill-available { background: rgba(27,191,191,0.12); color: #1BBFBF; }
.pill-available .pill-dot { background: #1BBFBF; }
.pill-available:hover { background: #1BBFBF; color: #0f1117; }
.pill-available:hover .pill-dot { background: #0f1117; }
.pill-booked { background: rgba(233,30,140,0.12); color: #E91E8C; }
.pill-booked .pill-dot { background: #E91E8C; }
.pill-booked:hover { background: #E91E8C; color: #fff; }
.pill-booked:hover .pill-dot { background: #fff; }

.td-actions { display: flex; gap: 6px; }
.btn-icon { display: inline-flex; align-items: center; gap: 5px; padding: 5px 10px; border-radius: 7px; border: none; font-size: 0.78rem; font-weight: 600; cursor: pointer; transition: all 0.15s; white-space: nowrap; font-family: 'DM Sans', sans-serif; }
.btn-edit { background: rgba(255,255,255,0.06); color: rgba(232,234,240,0.7); }
.btn-edit:hover { background: rgba(255,255,255,0.12); color: #fff; }
.btn-del { background: rgba(233,30,140,0.08); color: rgba(233,30,140,0.7); }
.btn-del:hover { background: rgba(233,30,140,0.18); color: #E91E8C; }
.ml-auto { margin-left: auto; }

.mobile-cards { display: none; flex-direction: column; gap: 10px; }
.mobile-card { background: #181c25; border-radius: 14px; padding: 14px 16px; border: 1px solid rgba(255,255,255,0.06); }
.mc-top { display: flex; align-items: center; gap: 12px; }
.mc-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.mc-location { font-size: 0.75rem; color: rgba(200,204,218,0.45); margin-top: 1px; }
.mc-actions { display: flex; gap: 8px; margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.05); }
.mc-actions .btn-icon { flex: 1; justify-content: center; padding: 8px; }

.overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 200; padding: 16px; }
.modal { background: #181c25; border-radius: 18px; width: 100%; max-width: 440px; max-height: 92vh; overflow-y: auto; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 24px 64px rgba(0,0,0,0.6); }
.modal-sm { max-width: 340px; }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 22px 0; }
.modal-header h2 { font-size: 1.1rem; font-weight: 700; color: #f0f2f7; margin: 0; }
.modal-close { background: rgba(255,255,255,0.06); border: none; color: rgba(232,234,240,0.5); width: 30px; height: 30px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.15s; }
.modal-close:hover { background: rgba(255,255,255,0.1); color: #fff; }
.modal-form { padding: 18px 22px 4px; display: flex; flex-direction: column; gap: 14px; }
.mfield { display: flex; flex-direction: column; gap: 6px; }
.mfield label { font-size: 0.78rem; font-weight: 600; color: rgba(232,234,240,0.5); letter-spacing: 0.3px; }
.req { color: #E91E8C; margin-left: 2px; }
.mfield input, .mfield select, .mfield textarea { background: #242938; border: 1.5px solid rgba(255,255,255,0.08); border-radius: 9px; padding: 10px 13px; font-size: 0.92rem; color: #e8eaf0; outline: none; font-family: 'DM Sans', sans-serif; resize: vertical; transition: border-color 0.15s, box-shadow 0.15s; }
.mfield input::placeholder, .mfield textarea::placeholder { color: rgba(232,234,240,0.25); }
.mfield input:focus, .mfield select:focus, .mfield textarea:focus { border-color: #1BBFBF; box-shadow: 0 0 0 3px rgba(27,191,191,0.1); }
.mfield select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='rgba(232,234,240,0.35)' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px; }
.mfield select option { background: #242938; }

/* ── Photo picker ── */
.photo-picker { width: 100%; aspect-ratio: 3/4; max-height: 240px; border-radius: 12px; border: 2px dashed rgba(255,255,255,0.1); background: #242938; cursor: pointer; position: relative; overflow: hidden; transition: border-color 0.2s, background 0.2s; display: flex; align-items: center; justify-content: center; }
.photo-picker:hover { border-color: #1BBFBF; background: #1e2535; }
.photo-picker.has-photo { border-style: solid; border-color: rgba(255,255,255,0.08); }
.photo-picker.uploading { cursor: wait; }
.photo-preview { width: 100%; height: 100%; object-fit: cover; object-position: top; display: block; }
.photo-placeholder { display: flex; flex-direction: column; align-items: center; gap: 8px; color: rgba(232,234,240,0.3); text-align: center; padding: 1rem; pointer-events: none; }
.photo-placeholder span { font-size: 0.9rem; font-weight: 600; color: rgba(232,234,240,0.5); }
.photo-placeholder small { font-size: 0.75rem; color: rgba(232,234,240,0.25); }
.photo-change-hint { position: absolute; inset: 0; background: rgba(0,0,0,0); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; color: rgba(255,255,255,0); font-size: 0.82rem; font-weight: 600; transition: background 0.2s, color 0.2s; }
.photo-picker:hover .photo-change-hint { background: rgba(0,0,0,0.5); color: #fff; }
.upload-overlay { position: absolute; inset: 0; background: rgba(15,17,23,0.85); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; color: #f0f2f7; font-size: 0.85rem; font-weight: 600; }
.upload-spinner { width: 36px; height: 36px; border: 3px solid rgba(27,191,191,0.2); border-top-color: #1BBFBF; border-radius: 50%; animation: spin 0.75s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.field-error { font-size: 0.78rem; color: #E91E8C; margin: 0; }
.remove-photo-btn { background: none; border: none; color: rgba(233,30,140,0.7); font-size: 0.78rem; font-weight: 600; cursor: pointer; padding: 0; font-family: 'DM Sans', sans-serif; text-align: left; transition: color 0.15s; }
.remove-photo-btn:hover { color: #E91E8C; }

.check-label { display: flex; align-items: center; gap: 9px; font-size: 0.88rem; color: rgba(232,234,240,0.65); cursor: pointer; }
.check-label input { accent-color: #1BBFBF; width: 16px; height: 16px; }
.form-error { color: #E91E8C; font-size: 0.82rem; }
.confirm-text { padding: 12px 22px; color: rgba(232,234,240,0.6); font-size: 0.9rem; line-height: 1.5; }
.confirm-text strong { color: #f0f2f7; }
.modal-footer { display: flex; gap: 8px; justify-content: flex-end; padding: 16px 22px 20px; border-top: 1px solid rgba(255,255,255,0.05); margin-top: 4px; }
.btn-cancel { background: rgba(255,255,255,0.06); color: rgba(232,234,240,0.6); border: none; padding: 9px 18px; border-radius: 9px; font-size: 0.88rem; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; }
.btn-cancel:hover { background: rgba(255,255,255,0.1); }
.btn-save { background: #1BBFBF; color: #0f1117; border: none; padding: 9px 22px; border-radius: 9px; font-size: 0.88rem; font-weight: 700; cursor: pointer; transition: background 0.15s; font-family: 'DM Sans', sans-serif; }
.btn-save:hover:not(:disabled) { background: #17aaaa; }
.btn-save:disabled { opacity: 0.55; cursor: not-allowed; }
.btn-danger { background: rgba(233,30,140,0.15); color: #E91E8C; border: 1px solid rgba(233,30,140,0.25); padding: 9px 22px; border-radius: 9px; font-size: 0.88rem; font-weight: 700; cursor: pointer; transition: all 0.15s; font-family: 'DM Sans', sans-serif; }
.btn-danger:hover:not(:disabled) { background: #E91E8C; color: #fff; border-color: #E91E8C; }
.btn-danger:disabled { opacity: 0.5; cursor: not-allowed; }

@media (max-width: 640px) {
  .table-wrap { display: none; }
  .mobile-cards { display: flex; }
  .admin-content { padding: 16px 14px 60px; }
  .page-header h1 { font-size: 1.25rem; }
  .photo-picker { max-height: 200px; }
}
</style>
