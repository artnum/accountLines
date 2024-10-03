/**
 * @class DND
 * @description Class to handle drag and drop functionality
 * 
 * Drag and drop don't work using drop API. It works randomly in Chrome, works
 * ok in Firefox.
 */
globalThis.DNDGlobalEventsInstalled = false
globalThis.DNDInProgress = false
globalThis.DNDStartTimeout = null
export default class DND {
    constructor(node) {        
        if (!globalThis.DNDGlobalEventsInstalled) {
            window.addEventListener('mousemove', event => {
                if (!window.DNDInProgress) { return }
                getSelection().removeAllRanges()
                let node = event.target
                for (; node; node = node.parentNode) {
                    if (node.dataset?.dndDropzone === "true") {
                        break
                    }
                }
                if (!node) {
                    window.requestAnimationFrame(() => { window.document.documentElement.style.cursor = 'no-drop' })
                } else {
                    window.requestAnimationFrame(() => { window.document.documentElement.style.cursor = 'grabbing' })
                }
                const dest = event.target
                event.target.dispatchEvent(new CustomEvent('dnd-over', { detail: { destination: dest, source: window.DNDInProgress, x: event.clientX, y: event.clientY }, bubbles: true, cancelable: true }))
            }, {capture: true})
            window.addEventListener('keydown', event => {
                if (!globalThis.DNDInProgress) { return }
                if (event.key === 'Escape') {
                    this.cancel()
                }
            })
            window.addEventListener('mouseup', event => {
                if (!globalThis.DNDInProgress) { return }
                for (let node = event.target; node; node = node.parentNode) {
                    /* if target is not within a dropzone, cancel the operation */
                    if (node.dataset.dndDropzone !== "true") { return this.cancel() }
                }
                this.drop()
            })
            globalThis.DNDGlobalEventsInstalled = true
        }

        if (!node.dataset.dnd) {
            node.addEventListener('mousedown', event => {
                if (globalThis.DNDStartTimeout) { return }
                /* disable DnD if action is on a child node with data-no-dnd,
                 * this is useful for parts where user can select text
                 */
                for (node = event.target; node !== event.currentTarget; node = node.parentNode) {
                    if (node.dataset.noDnd === "true") { return }
                }
                const target = event.currentTarget
                globalThis.DNDStartTimeout = setTimeout(() => {
                    this.start(target)
                    globalThis.DNDStartTimeout = null
                }, 100)
            })
            node.addEventListener('mouseup', event => {
                if (window.DNDStartTimeout) { clearTimeout(globalThis.DNDStartTimeout) }
                globalThis.DNDStartTimeout = null
                this.drop()
            })
        }
        node.dataset.dnd = true
    }

    start(target) {
        globalThis.DNDInProgress = target
        target.dispatchEvent(new CustomEvent('dnd-start', {}))
        window.requestAnimationFrame(() => { window.document.documentElement.style.cursor = 'grabbing' })
    }

    cancel() {
        if (!globalThis.DNDInProgress) { return }
        globalThis.DNDInProgress.dispatchEvent(new CustomEvent('dnd-cancel', {detail: { source: globalThis.DNDInProgress}, bubbles: true, cancelable: true}))
        globalThis.DNDInProgress.dispatchEvent(new CustomEvent('dnd-end', {detail: { source: globalThis.DNDInProgress}, bubbles: true, cancelable: true}))
        globalThis.DNDInProgress = false
        window.requestAnimationFrame(() => { window.document.documentElement.style.cursor = '' })
    }

    drop() {
        if (!globalThis.DNDInProgress) { return }
        globalThis.DNDInProgress.dispatchEvent(new CustomEvent('dnd-drop', {detail: { source: globalThis.DNDInProgress}, bubbles: true, cancelable: true}))
        globalThis.DNDInProgress.dispatchEvent(new CustomEvent('dnd-end', {detail: { source: globalThis.DNDInProgress}, bubbles: true, cancelable: true}))
        globalThis.DNDInProgress = false
        window.requestAnimationFrame(() => { window.document.documentElement.style.cursor = '' })

    }

}