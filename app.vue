<template>
  <div class="split-layout">
    
    <!-- LEFT PANEL -->
    <div class="left-panel">
      <div class="brand-section">
        <div class="logo-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
        </div>
        <h1>ClipSync</h1>
        <p>Share your clipboard across devices in real-time</p>
      </div>

      <div class="join-card">
        <label for="room-input">Room Code</label>
        <input 
          type="text" 
          id="room-input" 
          v-model.trim="roomInput" 
          @keydown.enter="joinRoom"
          placeholder="Enter a room name..."
          autocomplete="off"
          spellcheck="false"
          class="input-field"
        >
        <button class="btn-primary" @click="joinRoom" :disabled="!roomInput">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          Join Room
        </button>
      </div>

      <div class="recent-section" v-if="recentRooms.length">
        <h3>Recent Rooms</h3>
        <div class="recent-grid">
          <button 
            class="recent-chip" 
            v-for="r in recentRooms" 
            :key="r" 
            @click="roomInput = r; joinRoom()"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            {{ r }}
          </button>
        </div>
      </div>

      <div class="left-footer">
        Rooms are private
      </div>
    </div>

    <!-- RIGHT PANEL -->
    <div class="right-panel">
      <!-- Active Room Editor -->
      <div class="editor-container" v-if="view === 'room'">
        <div class="editor-header">
          <div class="header-left">
            <button class="back-btn" @click="leaveRoom" title="Leave room">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            </button>
            <div class="room-details">
              <div class="room-title-row">
                <span class="room-title">{{ currentRoom }}</span>
                <span class="status-badge" :style="{ opacity: connected ? 1 : 0.6 }">
                  <span class="status-dot"></span>
                  {{ connected ? 'LIVE' : 'CONNECTING...' }}
                </span>
              </div>
              <span class="room-subtitle">Real-time sync</span>
            </div>
          </div>
          <div class="header-actions">
            <button class="btn-action btn-copy" @click="copyToClipboard">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              Copy
            </button>
            <button class="btn-action btn-clear" @click="clearText">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              Clear
            </button>
          </div>
        </div>

        <div class="textarea-wrapper">
          <textarea 
            class="clip-textarea" 
            v-model="text"
            @input="onTextInput"
            placeholder="Start typing or paste something here...&#10;&#10;Everything you write instantly syncs to all connected devices in this room."
            spellcheck="false"
          ></textarea>
        </div>

        <div class="editor-footer">
          <span>{{ charCount.toLocaleString() }} characters</span>
          <span>{{ lastSync ? `Synced ${lastSyncAgo}` : '' }}</span>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state" v-else>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 16px; opacity: 0.5;">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        <h2>No Room Selected</h2>
        <p>Enter a room code on the left to join a secure, real-time clipboard session.</p>
      </div>
    </div>

    <!-- TOAST -->
    <div class="toast-container" v-if="toast.visible">
      <div class="toast" :class="toast.entering ? 'toast-in' : 'toast-out'">
        <svg v-if="toast.icon === 'check'" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
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
let typingTimeout = null
let isTyping = false
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
          // Ignore incoming updates if we are actively typing to prevent cursor jumps
          if (isTyping) return
          // Ignore echoes of our own updates
          if (payload.new.text === text.value) return

          // Apply remote change
          isRemoteUpdate = true
          text.value = payload.new.text || ''
          
          nextTick(() => {
            isRemoteUpdate = false
          })
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

  // Lock incoming updates while typing
  isTyping = true
  clearTimeout(typingTimeout)
  typingTimeout = setTimeout(() => {
    isTyping = false
  }, 1000)

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
