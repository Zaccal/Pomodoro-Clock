import { modalSettings, Settings } from "./modules/settings.js"
import Timer from "./modules/timer.js"

const btnForOpenSetting = document.querySelector('#open-settings')

btnForOpenSetting.addEventListener('click', () => modalSettings.openModal() )


const imgTags = Array.from(document.querySelectorAll('img[data-img]'))

const switchDarkModeHTML = document.querySelector('.check-point[type=checkbox]').checked

const settings = new Settings(imgTags)

if (localStorage.theme === 'dark' && switchDarkModeHTML === true || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
    settings.changeHtmlImgMode('dark', 'svg')
} 

else {
    document.documentElement.classList.remove('dark')
    settings.changeHtmlImgMode('light', 'svg')
}


const switchDarkMode = document.querySelector('#dark-mode-btn')

switchDarkMode.addEventListener('click', () => { Settings.toggleDarkMode() })


document.querySelectorAll('input[type="number"]').forEach(input => {
    const timeValues = JSON.parse(localStorage.getItem('timeValues'))

    if (input.value === '') {
        document.querySelector('#focus-time').value = timeValues.focus 
        document.querySelector('#break-time').value = timeValues.shortBreak
        document.querySelector('#long-break-time').value = timeValues.longBreak
    }
})

const checkInputNumberValue = () => {
    document.querySelectorAll('#settings input[type="number"]').forEach(input => {

        if ( Number(input.value) !== 0 && 
            Number(input.value) > 0 && 
            (Number(input.value) ^ 0) === Number(input.value) === true)  
        { 
            modalSettings.closeModal()
            Settings.saveTimeValuesFromSettings()
            
            const checkClassNone = Array.from(document.querySelector('#start').classList).includes('none-btn')

            if (checkClassNone === false) {
                const html = document.querySelector('html')
                const checkTimeFocus = html.classList.contains('focus')
                const checkTimeShortBreak = html.classList.contains('short-break')
                const checkTimeFocusLongBreak = html.classList.contains('focus-longBreak')
                const checkTimeLongBreak = html.classList.contains('long-break')

                if (checkTimeFocus === true || checkTimeFocusLongBreak === true) { Settings.usePresentTenseStyles('focus') }
                else if (checkTimeShortBreak === true) { Settings.usePresentTenseStyles('short-break') }
                else if (checkTimeLongBreak === true) { Settings.usePresentTenseStyles('long-break') }
            }
        } 
    
        else {
            // When user reapte put value in a input it checks and, run itself.
            document.querySelector('#close-settings').addEventListener('click', checkInputNumberValue)

            throw new Error('value input is setting is not valid')
        }
    })
}

// ! important first must be `Settings.saveTimeValuesFromSettings()`
// ! after that can be Settings.usePresentTenseStyles('focus')
// ? Because method usePresentTenseStyles use dates from localStorage saveTimeValuesFromSettings
// ? saveTimeValuesFromSettings their creates
Settings.saveTimeValuesFromSettings() // it creates in the localStorage object 
Settings.usePresentTenseStyles('focus') // it use time from localStorage object

const btnForCloseSetting = document.querySelector('#close-settings')

btnForCloseSetting.addEventListener('click', checkInputNumberValue)


const btnForStartTimer = document.querySelector('#start')

btnForStartTimer.addEventListener('click', () => {
    const focusValue = JSON.parse(localStorage.getItem('timeValues')).focus
    const shortBreakValue = JSON.parse(localStorage.getItem('timeValues')).shortBreak 
    const longBreakValue = JSON.parse(localStorage.getItem('timeValues')).longBreak 

    const html = document.querySelector('html')
    const checkTimeFocus = html.classList.contains('focus')
    const checkTimeShortBreak = html.classList.contains('short-break')
    const checkTimeFocusLongBreak = html.classList.contains('focus-longBreak')
    const checkTimeLongBreak = html.classList.contains('long-break')

    if (checkTimeFocus === true) { Timer.start(focusValue) }
    else if (checkTimeShortBreak === true) { Timer.start(shortBreakValue) }
    else if (checkTimeFocusLongBreak === true) { Timer.start(focusValue) }
    else if (checkTimeLongBreak === true) { Timer.start(longBreakValue) }
})

const btnForNextTime = document.querySelector('#next')

btnForNextTime.addEventListener('click', () => { Timer.nextTime(false, 'pass') })