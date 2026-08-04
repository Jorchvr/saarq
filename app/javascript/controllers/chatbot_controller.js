import { Controller } from "@hotwired/stimulus"

const WA_LINK = "https://wa.me/528112145530"

const QUICK_REPLIES = [
  { label: "Propiedades en venta", key: "ventas" },
  { label: "Propiedades en renta", key: "rentas" },
  { label: "¿Cómo los contacto?", key: "contacto" },
  { label: "¿Qué zonas manejan?", key: "zonas" },
]

const RESPONSES = {
  ventas: "Tenemos excelentes casas, departamentos y terrenos en venta en Monterrey y área metropolitana 🏠. ¿Te gustaría que un asesor te ayude a encontrar la opción ideal?",
  rentas: "Contamos con propiedades en renta en diversas zonas de Nuevo León 🗝️. Podemos ayudarte a encontrar la opción que se ajuste a tu presupuesto.",
  contacto: "Puedes contactarnos directamente:\n📱 WhatsApp: +52 811 214 5530\n📧 Email: info@saarqbienesraices.com\n\n¡Respondemos rápidamente!",
  zonas: "Manejamos propiedades en San Pedro, Santa Catarina, Monterrey, García, General Escobedo y más municipios del área metropolitana de Monterrey 📍.",
}

export default class extends Controller {
  static targets = ["window", "messages", "input", "badge", "openIcon", "closeIcon"]

  connect() {
    this._open = false
    this._greeted = false
  }

  toggle() {
    this._open ? this._closeChat() : this._openChat()
  }

  _openChat() {
    this._open = true
    this.windowTarget.classList.remove("hidden")
    requestAnimationFrame(() => {
      this.windowTarget.style.opacity = "1"
      this.windowTarget.style.transform = "scale(1) translateY(0)"
    })
    if (this.hasBadgeTarget) this.badgeTarget.classList.add("hidden")
    if (!this._greeted) {
      this._greeted = true
      setTimeout(() => this._addBotMessage("¡Hola! 👋 Soy el asistente de SAARQ Bienes Raíces. ¿En qué te puedo ayudar hoy?"), 300)
      setTimeout(() => this._addQuickReplies(), 900)
    }
  }

  _closeChat() {
    this._open = false
    this.windowTarget.style.opacity = "0"
    this.windowTarget.style.transform = "scale(0.95) translateY(8px)"
    setTimeout(() => this.windowTarget.classList.add("hidden"), 180)
  }

  quickReply(event) {
    const key = event.currentTarget.dataset.key
    const label = event.currentTarget.dataset.label
    const qr = this.messagesTarget.querySelector(".chatbot-quick-replies")
    if (qr) qr.remove()
    this._addUserMessage(label)
    this._showTyping()
    setTimeout(() => {
      this._hideTyping()
      this._addBotMessage(RESPONSES[key] || "Para más información, contáctanos directamente.")
      setTimeout(() => this._addWhatsAppButton(), 400)
      setTimeout(() => this._addBotMessage("¿Hay algo más en lo que te pueda ayudar?"), 800)
      setTimeout(() => this._addQuickReplies(), 1300)
    }, 1200)
  }

  send(event) {
    event.preventDefault()
    const text = this.inputTarget.value.trim()
    if (!text) return
    this.inputTarget.value = ""
    this._addUserMessage(text)
    this._showTyping()
    setTimeout(() => {
      this._hideTyping()
      this._addBotMessage("Gracias por tu mensaje. Un asesor de SAARQ se pondrá en contacto contigo a la brevedad 😊")
      setTimeout(() => this._addWhatsAppButton(), 400)
      setTimeout(() => this._addBotMessage("¿Hay algo más en lo que te pueda ayudar?"), 800)
      setTimeout(() => this._addQuickReplies(), 1300)
    }, 1400)
  }

  _addBotMessage(text) {
    const div = document.createElement("div")
    div.className = "flex items-end gap-2"
    div.innerHTML = `
      <div class="w-7 h-7 rounded-full bg-olive-100 flex items-center justify-center shrink-0">
        <svg class="w-3.5 h-3.5 text-olive-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        </svg>
      </div>
      <div class="bg-gray-100 text-gray-800 text-sm px-4 py-2.5 rounded-2xl rounded-bl-none max-w-[75%] whitespace-pre-line leading-relaxed">${this._escape(text)}</div>
    `
    this.messagesTarget.appendChild(div)
    this._scroll()
  }

  _addUserMessage(text) {
    const div = document.createElement("div")
    div.className = "flex items-end justify-end gap-2"
    div.innerHTML = `
      <div class="bg-olive-600 text-white text-sm px-4 py-2.5 rounded-2xl rounded-br-none max-w-[75%] whitespace-pre-line leading-relaxed">${this._escape(text)}</div>
    `
    this.messagesTarget.appendChild(div)
    this._scroll()
  }

  _addQuickReplies() {
    const container = document.createElement("div")
    container.className = "chatbot-quick-replies flex flex-wrap gap-2 pl-9"
    QUICK_REPLIES.forEach(({ label, key }) => {
      const btn = document.createElement("button")
      btn.type = "button"
      btn.className = "text-xs bg-white border border-olive-200 text-olive-700 hover:bg-olive-50 px-3 py-1.5 rounded-full transition-colors font-medium"
      btn.textContent = label
      btn.dataset.key = key
      btn.dataset.label = label
      btn.dataset.action = "click->chatbot#quickReply"
      container.appendChild(btn)
    })
    this.messagesTarget.appendChild(container)
    this._scroll()
  }

  _addWhatsAppButton() {
    const div = document.createElement("div")
    div.className = "flex items-end gap-2"
    div.innerHTML = `
      <div class="w-7 h-7 shrink-0"></div>
      <a href="${WA_LINK}" target="_blank" rel="noopener"
         class="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white text-sm font-bold px-4 py-2.5 rounded-2xl rounded-bl-none transition-colors">
        <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Escribir por WhatsApp
      </a>
    `
    this.messagesTarget.appendChild(div)
    this._scroll()
  }

  _showTyping() {
    const div = document.createElement("div")
    div.id = "chatbot-typing"
    div.className = "flex items-end gap-2"
    div.innerHTML = `
      <div class="w-7 h-7 rounded-full bg-olive-100 flex items-center justify-center shrink-0">
        <svg class="w-3.5 h-3.5 text-olive-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        </svg>
      </div>
      <div class="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-none flex gap-1 items-center">
        <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay:0ms"></span>
        <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay:150ms"></span>
        <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay:300ms"></span>
      </div>
    `
    this.messagesTarget.appendChild(div)
    this._scroll()
  }

  _hideTyping() {
    document.getElementById("chatbot-typing")?.remove()
  }

  _scroll() {
    this.messagesTarget.scrollTop = this.messagesTarget.scrollHeight
  }

  _escape(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  }
}
