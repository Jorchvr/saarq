import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["thumb", "lightbox", "lightboxImg", "counter", "prev", "next", "spinner"]

  connect() {
    this.current = 0
    this.urls = this.thumbTargets.map(t => t.dataset.full)
    this._onKey = this._onKey.bind(this)
    this._startX = null
  }

  open(event) {
    const idx = parseInt(event.currentTarget.dataset.index)
    this.current = idx
    this._show()
  }

  close() {
    this.lightboxTarget.style.opacity = "0"
    setTimeout(() => {
      this.lightboxTarget.classList.add("hidden")
      this.lightboxTarget.style.opacity = ""
    }, 150)
    document.removeEventListener("keydown", this._onKey)
    document.body.style.overflow = ""
  }

  prev() {
    this.current = (this.current - 1 + this.urls.length) % this.urls.length
    this._show()
  }

  next() {
    this.current = (this.current + 1) % this.urls.length
    this._show()
  }

  backdropClick(event) {
    if (event.target === this.lightboxTarget) this.close()
  }

  touchstart(event) {
    this._startX = event.touches[0].clientX
  }

  touchend(event) {
    if (this._startX === null) return
    const dx = event.changedTouches[0].clientX - this._startX
    if (Math.abs(dx) > 50) dx < 0 ? this.next() : this.prev()
    this._startX = null
  }

  _show() {
    const url = this.urls[this.current]

    this.lightboxImgTarget.style.opacity = "0"
    if (this.hasSpinnerTarget) this.spinnerTarget.classList.remove("hidden")

    const img = new Image()
    img.onload = () => {
      this.lightboxImgTarget.src = url
      this.lightboxImgTarget.style.opacity = "1"
      if (this.hasSpinnerTarget) this.spinnerTarget.classList.add("hidden")
    }
    img.onerror = () => {
      this.lightboxImgTarget.src = url
      this.lightboxImgTarget.style.opacity = "1"
      if (this.hasSpinnerTarget) this.spinnerTarget.classList.add("hidden")
    }
    img.src = url

    this.counterTarget.textContent = `${this.current + 1} / ${this.urls.length}`
    if (this.hasPrevTarget) this.prevTarget.classList.toggle("hidden", this.urls.length <= 1)
    if (this.hasNextTarget) this.nextTarget.classList.toggle("hidden", this.urls.length <= 1)
    this.lightboxTarget.classList.remove("hidden")
    document.addEventListener("keydown", this._onKey)
    document.body.style.overflow = "hidden"
  }

  _onKey(e) {
    if (e.key === "Escape")     this.close()
    if (e.key === "ArrowLeft")  this.prev()
    if (e.key === "ArrowRight") this.next()
  }
}
