import { Modal } from "./global.js"

class InputNumber {
    static appearanceButtons = document.querySelectorAll('button[data-appearance]')

    static addMinusButtons() {
        this.appearanceButtons.forEach(element => {
            element.addEventListener('click', event => {
                const target = event.target
                const inputNumber = target.parentElement.parentElement.querySelector('input[type="number"]')

                if (target.getAttribute('data-appearance') === 'plus') {
                    inputNumber.value = Number(inputNumber.value) + 1
                }

                else if (target.getAttribute('data-appearance') === 'minus' && inputNumber.value > 1) {
                    inputNumber.value = Number(inputNumber.value) - 1
                }
            })
        })        
    }
}

InputNumber.addMinusButtons()


class Settings {

    /**
     * @param {Array} imgTags - for change imgtags img src in the darkmode or light mode
     */

    constructor(imgTags) {
        this._imgTags = imgTags
    }

    static toggleDarkMode() {
        document.querySelector('html').classList.toggle('dark')

        const imgTags = Array.from(document.querySelectorAll('img[data-img]'))
        const settings = new this(imgTags)

        if (document.querySelector('html').classList.contains('dark')) {
            localStorage.theme = 'dark'

            settings.changeHtmlImgMode('dark', 'svg')

        } 
        
        else {
            localStorage.theme = 'light'

            settings.changeHtmlImgMode('light', 'svg')
        }

        const html = document.querySelector('html')
        const checkTimeFocus = html.classList.contains('focus')
        const checkTimeShortBreak = html.classList.contains('short-break')
        const checkTimeFocusLongBreak = html.classList.contains('focus-longBreak')
        const checkTimeLongBreak = html.classList.contains('long-break')

        if (checkTimeFocus === true || checkTimeFocusLongBreak === true) { Settings.usePresentTenseStyles('focus') } 
        else if (checkTimeShortBreak === true) { Settings.usePresentTenseStyles('short-break') } 
        else if (checkTimeLongBreak === true) { Settings.usePresentTenseStyles('long-break') }
    }


    static saveTimeValuesFromSettings() {
        const focusLength = document.querySelector('#focus-time').value
        const shortBreakLength = document.querySelector('#break-time').value
        const longBreakLength =document.querySelector('#long-break-time').value

        const timeValues = {
            focus: Number(focusLength),
            shortBreak: Number(shortBreakLength),
            longBreak: Number(longBreakLength),
        }

        localStorage.setItem('timeValues', JSON.stringify(timeValues))
    }


    static usePresentTenseStyles(nowTime = 'focus') {
        const valueTimes = JSON.parse(localStorage.getItem('timeValues'))

        const minutHtmlElement = document.querySelector('#minut')
        
        const markText = document.querySelector('#mark span')
        const mark = document.querySelector('#mark')

        if (nowTime === 'focus') {
                
            mark.style.maxWidth = '136px'
            markText.innerHTML = 'Focus'

            if (document.querySelector('html.dark')) {
                mark.querySelector('img').setAttribute('src', './img/focus-darkMode.svg')
            }

            else {
                mark.querySelector('img').setAttribute('src', './img/focus.svg')
            }


            if (valueTimes.focus < 10) {
                minutHtmlElement.innerHTML = `0${valueTimes.focus}`
            } 
            else {
                minutHtmlElement.innerHTML = valueTimes.focus
            }

        } 

        else if (nowTime === 'short-break') {
            
            mark.style.maxWidth = '190px'
            markText.innerHTML = 'Short Break'

            if (document.querySelector('html.dark')) {
                mark.querySelector('img').setAttribute('src', './img/shortBreak/shortBreak-darkMode.svg')
            }

            else {
                mark.querySelector('img').setAttribute('src', './img/shortBreak/shortBreak.svg')
            }

            if (valueTimes.shortBreak < 10) {
                minutHtmlElement.innerHTML = `0${valueTimes.shortBreak}`
            } 
            else {
                minutHtmlElement.innerHTML = valueTimes.shortBreak
            }

        }

        else if (nowTime === 'long-break') {

            mark.style.maxWidth = '190px'
            markText.innerHTML = 'Long Break'

            if (document.querySelector('html.dark')) {
                mark.querySelector('img').setAttribute('src', './img/longBreak/longBreak-darkMode.svg')
            }

            else {
                mark.querySelector('img').setAttribute('src', './img/longBreak/longBreak.svg')
            }


            if (valueTimes.longBreak < 10) {
                minutHtmlElement.innerHTML = `0${valueTimes.longBreak}`
            } 
            else {
                minutHtmlElement.innerHTML = valueTimes.longBreak
            }
            
        } 
    }

    changeHtmlImgMode(mode = 'light', typeImg = 'svg', darkModeImgType = typeImg) {
        const imgTags = this._imgTags.filter(tag => {
            const tagSrc = tag.getAttribute('src').split('.').indexOf(typeImg)
            if (tagSrc !== 0) { return tag } 
        }) 

        switch (mode) {
            case 'dark':
                imgTags.forEach(tag => {
                    const imgDarkMode = tag.getAttribute('src').replace(`.${typeImg}`, '')
                    tag.setAttribute('src', `${imgDarkMode}-darkMode.${darkModeImgType}`)
                })
                break 
            
            case 'light': 
                imgTags.forEach((tag) => {
                    const imgLightMode = tag.getAttribute('src').replace(`-darkMode.${darkModeImgType}`, `.${typeImg}`)
                    tag.setAttribute('src', imgLightMode)   
                })
                break 
            
            default:
                alert('Sorry, something not right: in the changeHtmlImgMode method')
                break
        }
    }

}


const settingsModal = document.querySelector('#settings')
const modalSettings = new Modal(settingsModal)

export { modalSettings, Settings }