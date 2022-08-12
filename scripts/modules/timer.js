import { Settings } from "./settings.js"
import { Voice, notificationFn } from "./global.js"

const enumeratorSecondHtmlElement = document.querySelector('#second')
const enumeratorMinutHtmlElement = document.querySelector('#minut')

let interval,
    second = 60

export default class Timer {
    static focusTime
    static shortBreakTime 
    static longBreakTime 


    static getNowTime() {
        this.focusTime = JSON.parse(localStorage.getItem('timeValues')).focus
        this.shortBreakTime = JSON.parse(localStorage.getItem('timeValues')).shortBreak
        this.longBreakTime = JSON.parse(localStorage.getItem('timeValues')).longBreak
    }
    
    static start(timeMinut) {
        clearInterval(interval)

        this.createStopTimerBtn()

        if (second !== 0) {
            timeMinut -= 1

            if (timeMinut < 10) {
                enumeratorMinutHtmlElement.innerHTML = `0${timeMinut}`
            } else {
                enumeratorMinutHtmlElement.innerHTML = timeMinut
            }
        } 

        const titlePage = document.querySelector('title')
        
        /** Interval */
        interval = setInterval(() => {
            let minutsTab

            if (timeMinut < 10) {
                minutsTab = `0${timeMinut}`
            } else {
                minutsTab = timeMinut + ''
            }

            if (second !== 0) {

                second -= 1

                if (second < 10) {
                    enumeratorSecondHtmlElement.innerHTML = `0${second}`
                    titlePage.innerHTML = `Pomodoro: ${minutsTab}:0${second}` 
                } else {
                    enumeratorSecondHtmlElement.innerHTML = second
                    titlePage.innerHTML = `Pomodoro: ${minutsTab}:${second}` 
                }

            } 
            
            else if (timeMinut !== 0) {

                /** Update the second time*/
                second = 59 
                if (second < 10) {
                    enumeratorSecondHtmlElement.innerHTML = `0${second}`
                    titlePage.innerHTML = `Pomodoro: ${minutsTab}:0${second}` 
                } 
                else {
                    enumeratorSecondHtmlElement.innerHTML = second
                    titlePage.innerHTML = `Pomodoro: ${minutsTab}:${second}` 
                }

                /** Minut updates*/
                timeMinut -= 1
                
                if (timeMinut < 10) {
                    enumeratorMinutHtmlElement.innerHTML = `0${timeMinut}`
                    titlePage.innerHTML = `Pomodoro: 0${minutsTab}:0${second}` 
                } 
                else {
                    enumeratorMinutHtmlElement.innerHTML = timeMinut
                    titlePage.innerHTML = `Pomodoro: ${minutsTab}:${second}` 
                }

            } 

            else {
                this.autoResumeTimer()
                this.getVoiceAfterWorkSession()
                this.getNotificationAfterWork()
                titlePage.innerHTML = 'Pomodoro Clock V.0.1.0'
                clearInterval(interval)
            }

        }, 1000, true)
    }

    static createStopTimerBtn() {
        document.querySelector('#start').classList.add('none-btn')
        document.querySelector('#stop').classList.remove('none-btn')
    
        document.querySelector('#stop').addEventListener('click', () => {
            clearInterval(interval)
            this.returnAllBack()
        })

    }

    static returnAllBack() {
        document.querySelector('title').innerHTML = 'Pomodoro Clock V.0.1.0'

        document.querySelector('#start').classList.remove('none-btn')
        document.querySelector('#stop').classList.add('none-btn')

        second = 60
        enumeratorSecondHtmlElement.innerHTML = '00'

        const html = document.querySelector('html')
        const checkTimeFocus = html.classList.contains('focus')
        const checkTimeShortBreak = html.classList.contains('short-break')
        const checkTimeFocusLongBreak = html.classList.contains('focus-longBreak')
        const checkTimeLongBreak = html.classList.contains('long-break')

        if (checkTimeFocus === true || checkTimeFocusLongBreak === true) { Settings.usePresentTenseStyles('focus') }
        else if (checkTimeShortBreak === true) { Settings.usePresentTenseStyles('short-break') }
        else if (checkTimeLongBreak === true) { Settings.usePresentTenseStyles('long-break') }
    }

    static autoResumeTimer() {
        this.returnAllBack()

        const switchAutoRusumeTimer = document.querySelector('#autoResume').checked

        if (switchAutoRusumeTimer === false) { 
            clearInterval(interval) 
            this.returnAllBack()
            this.nextTime()
        } 

        else if (switchAutoRusumeTimer === true) { this.nextTime(true) }
    }

    static nextTime(value, next = 'next') {
        /**
         * @param {boolean} value - true or false, true: auto play time, false: it does not run timer
         * @param {string} next - next or pass, it path how to be way after work session:
         * value 'next' way: focus -> short-break ->  focus -> long-break and repeat
         * value 'pass' way: focus -> short-break -> long-break and repeat
         */

        clearInterval(interval)
        this.returnAllBack()
        this.getNowTime()

        const html = document.querySelector('html')

        const checkTimeFocus = html.classList.contains('focus')
        const checkTimeShortBreak = html.classList.contains('short-break')
        const checkTimeFocusLongBreak = html.classList.contains('focus-longBreak')
        const checkTimeLongBreak = html.classList.contains('long-break')

        second = 60

        /** It changes focus on the short-break */
        /** If in the html tag has class focus, it gives now time is focus after it change on the short-break */
        if (checkTimeFocus === true) {
            Settings.usePresentTenseStyles('short-break')

            /** Chnage pomodoro status */
            html.classList.remove('focus')
            html.classList.add('short-break')

            // Somewhere me need change now time on a other but don't want to turn on timer
            if (value === true) {
                setTimeout(() => { this.start(this.shortBreakTime) }, 3000)
            }
        } 
        
        // focus-longBreak is time focus but after work it change time on the long break
        // next is default parameter but if 'next' is some other value than pass it session. 
        // `next = 'pass'` it do be focus -> short-break -> long-break,  
        else if (checkTimeShortBreak === true && next === 'next') {
            Settings.usePresentTenseStyles('focus')

            /** Chnage pomodoro status */
            html.classList.remove('short-break')
            html.classList.remove('focus')
            html.classList.add('focus-longBreak')


            if (value === true) {
                setTimeout(() => { this.start(this.focusTime) }, 3000)
            }
        }  
        
        else if (next === 'pass' && checkTimeShortBreak === true) {
            Settings.usePresentTenseStyles('long-break')

            html.classList.remove('short-break')
            html.classList.add('long-break')
        }

        else if (checkTimeFocusLongBreak === true && next === 'next') {
            Settings.usePresentTenseStyles('long-break')

            /** Change pomodoro status */
            html.classList.remove('focus-longBreak')
            html.classList.add('long-break')

            if (value === true) {
                setTimeout(() => { this.start(this.longBreakTime) }, 3000)
            }
        } 

        else if (checkTimeLongBreak === true) {
            Settings.usePresentTenseStyles('focus')

            /** Change pomodoro status */
            html.classList.remove('long-break')
            html.classList.add('focus')

            if (value === true) {
                setTimeout(() => { this.start(this.focusTime) })
            }
        }

    }

    static getVoiceAfterWorkSession() {
        const pathAlarmCloclFile = '../../audio/alarm-clock.mp3'
        
        const voice = new Voice(pathAlarmCloclFile)
        
        const switchSound = document.querySelector('#sound').checked

        if (switchSound === true) {
            voice.getVoiceAlarmClock()
        }
    }

    static getNotificationAfterWork() {
        const notificationOption = document.querySelector('#notification').checked
        const voice = new Voice('../../audio/alarm-clock.mp3', '../../audio/notice.mp3')

        if (notificationOption === true) { 
            notificationFn()
            voice.getVoiceNotification()
        }
    }
}