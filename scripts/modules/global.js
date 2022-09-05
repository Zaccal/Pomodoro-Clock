// And setInterval can get third argument true or false 
// If third argument is true than function start right away 
const originalSetInterval = window.setInterval;

window.setInterval = function (fn, delay, runImmediately) {
    if (runImmediately) fn()
    return originalSetInterval(fn, delay)
}


class Modal {

    constructor(modal) {
        this._modal = modal
    }

    openModal() {
        document.querySelector('body').style.overflow = 'hidden'

        // Show first modal background 
        this._modal.classList.remove('hidden') 
        setTimeout(() => this._modal.classList.add('bg-modal'), 50)


        // Show modal with content
        setTimeout(() => {
            this._modal.querySelector('div').classList.remove('opacity-5') 
            this._modal.querySelector('div').classList.remove('translate-y-[-110%]') 
        }, 55)
        
    }

    closeModal() {
        document.querySelector('body').style.overflow = 'auto'

        this._modal.querySelector('div').classList.add('translate-y-[-110%]')
        this._modal.querySelector('div').classList.add('opacity-5')

        this._modal.classList.remove('bg-modal')
        setTimeout(() => this._modal.classList.add('hidden'), 100)
    }

}

class Voice {
    
    /**
     * @param {string} pathFile - mp3 or mp4 file path 
     */

    constructor(pathFile, stopTimeVoice = 4000) {
        this._pathFile = pathFile
        this.stopTimeVoice = typeof stopTimeVoice === 'number' ? stopTimeVoice : 4000
        this._audio = new Audio()
    }

    set pathFile(path) {
        const mp3Search = path.split('.').includes('mp3')
        const m4Search = path.split('.').includes('mp4')

        if (mp3Search === true || m4Search === true && typeof path === 'string') {
            return this._path = path
        } 

        else {
            alert('Please path must be a format string and file must be mp3 or mp4')
        }
    }

    stopVoice() {
        this._audio.pause();
	    this._audio.currentTime = 0;
    }

    runVoice() {
        const mp3Search = this._pathFile.split('.').includes('mp3')
        const m4Search = this._pathFile.split('.').includes('mp4')

        if (mp3Search === true || m4Search === true && typeof this._pathFile === 'string') {
            this._audio.src = this._pathFile
            this._audio.play()

            setTimeout(() => { this.stopVoice() }, this.stopTimeVoice)
        }

        else {
            alert('Please path must be a format string and file must be mp3, mp4')
        }
    }
}


const setNotification = () => {
    let notification

    const html = document.querySelector('html')
    const checkFocusTime = html.classList.contains('focus')
    const checkShortBreak = html.classList.contains('short-break')
    const checkLongBreak = html.classList.contains('long-break')

    if (checkFocusTime === true) {
        notification = new Notification('Now time is focus !', {
            tag: 'ache-mail',
            body: `Time focus now is ${document.querySelector('#minut').innerHTML}`,
        })
    } 
    
    else if (checkShortBreak === true) {
        notification = new Notification('Now time is short break !', {
            tag: 'ache-mail',
            body: `Time short break now is ${document.querySelector('#minut').innerHTML}`,
        })
    } 
    
    else if (checkLongBreak === true) {
        notification = new Notification('Now time is long break !', {
            tag: 'ache-mail',
            body: `Time long break now is ${document.querySelector('#minut').innerHTML}`,
        })
    }
}

const notificationFn = () => {

    if (!('Notification' in window)) {
        alert('Sorry, your browser does not support notification')
    }

    else if (Notification.permission === 'granted') { setNotification() }

    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(permission => {
            if (!('permission' in Notification)) {
                NodeIterator.permission = permission
            }

            if (permission === 'granted') {
                setNotification()
            }
        })
    }

}

export { Modal, Voice, notificationFn }