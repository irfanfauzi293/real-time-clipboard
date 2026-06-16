<template>
  <!-- Ambient background -->
  <div class="ambient-bg" aria-hidden="true">
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>
  </div>

  <div class="app-wrapper">
    <!-- ============================================ -->
    <!-- LANDING VIEW                                 -->
    <!-- ============================================ -->
    <template v-if="view === 'landing'">
      <div class="center-layout">
        <div class="landing-card view-enter">

          <!-- Brand -->
          <div style="text-align: center; margin-bottom: 44px;">
            <div style="display: inline-flex; align-items: center; justify-content: center; width: 56px; height: 56px; border-radius: 16px; background: linear-gradient(135deg, var(--accent-purple), #6366f1); margin-bottom: 20px; box-shadow: 0 8px 32px rgba(139, 92, 246, 0.25);">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                <rect x="9" y="3" width="6" height="4" rx="2"/>
              </svg>
            </div>
            <h1 style="font-size: 28px; font-weight: 800; letter-spacing: -0.03em; color: var(--text-primary);">ClipSync</h1>
            <p style="margin-top: 8px; font-size: 14px; color: var(--text-tertiary); font-weight: 400;">Share your clipboard across devices in real-time</p>
          </div>

          <!-- Join Card -->
          <div class="card" style="padding: 28px;">
            <label for="room-input" style="display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-tertiary); margin-bottom: 10px;">Room Code</label>
            <input
              id="room-input"
              v-model.trim="roomInput"
              @keydown.enter="joinRoom"
              type="text"
              placeholder="Enter a room name…"
              autocomplete="off"
              spellcheck="false"
              class="input-field"
              style="margin-bottom: 16px;"
            />
            <button
              id="join-btn"
              @click="joinRoom"
              :disabled="!roomInput"
              class="btn btn-primary"
              style="width: 100%; font-size: 14px;"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              Join Room
            </button>

            <div style="margin-top: 18px; display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--text-muted);">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
              <span>Rooms are private — only people with the code can join</span>
            </div>
          </div>

          <!-- Recent Rooms -->
          <div v-if="recentRooms.length" style="margin-top: 28px;">
            <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); margin-bottom: 10px; padding-left: 2px;">Recent rooms</p>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              <button
                v-for="r in recentRooms"
                :key="r"
                @click="roomInput = r; joinRoom()"
                class="room-chip"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12l2 2 4-4"/></svg>
                {{ r }}
              </button>
            </div>
          </div>

        </div>
      </div>
    </template>

    <!-- ============================================ -->
    <!-- MAIN CLIPBOARD VIEW                          -->
    <!-- ============================================ -->
    <template v-else-if="view === 'room'">
      <div class="room-layout view-enter">

        <!-- Header -->
        <header style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <button id="back-btn" @click="leaveRoom" class="btn btn-icon" title="Leave room">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"/>
                <polyline points="12 19 5 12 12 5"/>
              </svg>
            </button>
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <h2 style="font-size: 15px; font-weight: 700; color: var(--text-primary); letter-spacing: -0.01em;">{{ currentRoom }}</h2>
                <span class="status-badge" :class="connected ? 'live' : 'offline'">
                  <span class="status-dot" :class="connected ? 'live' : 'offline'"></span>
                  {{ connected ? 'Live' : 'Connecting…' }}
                </span>
              </div>
              <p style="font-size: 11px; color: var(--text-tertiary); margin-top: 2px;">Real-time sync via Supabase</p>
            </div>
          </div>

          <div class="header-actions" style="display: flex; align-items: center; gap: 8px;">
            <button id="copy-btn" @click="copyToClipboard" class="btn btn-ghost">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
              </svg>
              Copy
            </button>
            <button id="clear-btn" @click="clearText" class="btn btn-ghost danger">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
              </svg>
              Clear
            </button>
          </div>
        </header>

        <!-- Textarea Card -->
        <div class="textarea-card">
          <textarea
            id="clip-area"
            v-model="text"
            @input="onTextInput"
            placeholder="Start typing or paste something here…&#10;&#10;Everything you write syncs instantly to all connected devices in this room."
            spellcheck="false"
            class="clip-textarea"
            style="flex: 1;"
          ></textarea>
          <div class="card-footer">
            <span>{{ charCount.toLocaleString() }} characters</span>
            <span v-if="lastSync">Synced {{ lastSyncAgo }}</span>
          </div>
        </div>

      </div>
    </template>

    <!-- ============================================ -->
    <!-- TOAST                                        -->
    <!-- ============================================ -->
    <div class="toast-container" v-if="toast.visible">
      <div class="toast" :class="toast.entering ? 'toast-in' : 'toast-out'">
        <svg v-if="toast.icon === 'check'" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent-emerald)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span>{{ toast.message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { createClient } from '@supabase/supabase-js'

const config = useRuntimeConfig()
const sb = createClient(config.public.supabaseUrl, config.public.supabaseKey)

const view = ref('landing')
const roomInput = ref('')
const currentRoom = ref('')
const text = ref('')
const connected = ref(false)
const lastSync = ref(null)
const recentRooms = ref([])

const toast = ref({ visible: false, message: '', icon: 'check', entering: true })
let toastTimer = null

// Supabase state
let channel = null
let isRemoteUpdate = false
let debounceTimer = null
const DEBOUNCE_MS = 400

// --- Computed ---
const charCount = computed(() => text.value.length)
const lastSyncAgo = computed(() => {
  if (!lastSync.value) return ''
  const s = Math.round((Date.now() - lastSync.value) / 1000)
  if (s < 5) return 'just now'
  if (s < 60) return `${s}s ago`
  return `${Math.floor(s / 60)}m ago`
})

// --- Toast ---
function showToast(message, icon = 'check') {
  clearTimeout(toastTimer)
  toast.value = { visible: true, message, icon, entering: true }
  toastTimer = setTimeout(() => {
    toast.value.entering = false
    setTimeout(() => { toast.value.visible = false }, 300)
  }, 2200)
}

// --- Recent Rooms ---
function loadRecent() {
  try {
    if (import.meta.client) {
      const stored = localStorage.getItem('clipsync_recent')
      if (stored) recentRooms.value = JSON.parse(stored).slice(0, 5)
    }
  } catch {}
}

function saveRecent(room) {
  const list = [room, ...recentRooms.value.filter(r => r !== room)].slice(0, 5)
  recentRooms.value = list
  if (import.meta.client) {
    localStorage.setItem('clipsync_recent', JSON.stringify(list))
  }
}

// --- Supabase Realtime ---
async function subscribeToRoom(roomId) {
  try {
    // Upsert: create room if it doesn't exist, or fetch existing
    const { data, error } = await sb
      .from('rooms')
      .upsert({ id: roomId }, { onConflict: 'id', ignoreDuplicates: true })
      .select()
      .single()

    if (error && error.code !== '23505') {
      // If upsert fails (not a duplicate), try just fetching
      const { data: existing } = await sb.from('rooms').select().eq('id', roomId).single()
      if (existing) {
        text.value = existing.text || ''
      }
    } else if (data) {
      text.value = data.text || ''
    }

    lastSync.value = Date.now()

    // Subscribe to realtime changes on this room
    channel = sb
      .channel(`room-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rooms',
          filter: `id=eq.${roomId}`,
        },
        (payload) => {
          // Only apply if this is a remote change
          isRemoteUpdate = true
          text.value = payload.new.text || ''
          isRemoteUpdate = false
          lastSync.value = Date.now()
        }
      )
      .subscribe((status) => {
        connected.value = (status === 'SUBSCRIBED')
      })
  } catch (err) {
    console.error('Connection error:', err)
    showToast('Connection failed: ' + err.message, 'error')
    connected.value = false
  }
}

function unsubscribeFromRoom() {
  if (channel && sb) {
    sb.removeChannel(channel)
    channel = null
  }
  connected.value = false
}

async function pushUpdate(newText) {
  if (!sb) return
  const { error } = await sb
    .from('rooms')
    .update({ text: newText, updated_at: new Date().toISOString() })
    .eq('id', currentRoom.value)

  if (!error) {
    lastSync.value = Date.now()
  }
}

// --- Actions ---
function joinRoom() {
  if (!roomInput.value) return
  currentRoom.value = roomInput.value
  saveRecent(currentRoom.value)
  view.value = 'room'
  nextTick(() => subscribeToRoom(currentRoom.value))
}

function leaveRoom() {
  unsubscribeFromRoom()
  clearTimeout(debounceTimer)
  text.value = ''
  currentRoom.value = ''
  view.value = 'landing'
}

function onTextInput() {
  if (isRemoteUpdate) return
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    pushUpdate(text.value)
  }, DEBOUNCE_MS)
}

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(text.value)
    showToast('Copied to clipboard')
  } catch {
    showToast('Copy failed — check permissions')
  }
}

async function clearText() {
  text.value = ''
  await pushUpdate('')
  showToast('Clipboard cleared')
}

// --- Lifecycle ---
let syncDisplayInterval
onMounted(() => {
  loadRecent()
  syncDisplayInterval = setInterval(() => { 
    if (lastSync.value) {
        lastSync.value = new Date(lastSync.value).getTime() 
    }
  }, 5000)
})

onUnmounted(() => {
  clearInterval(syncDisplayInterval)
  unsubscribeFromRoom()
})
</script>
