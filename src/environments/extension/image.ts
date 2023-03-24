import { gradioAppElem, updateGradioImage } from './internal/gradio'

export function SetScreenShot(id: string, url: string, name: string) {
    const imageElem = gradioAppElem.querySelector(`#openpose3d_${id}_image`)!
    updateGradioImage(imageElem, url, name)
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function onMakeImages() {
    gradioAppElem
        .querySelector('#openpose3d_tabs')!
        .querySelectorAll('button')[1]
        .click()
}

export function setBackgroundImage(dataUrl: string | null) {
    const div = gradioAppElem.getElementById('openpose3d_background')

    if (div) {
        if (!dataUrl) div.style.backgroundImage = 'none'
        else div.style.backgroundImage = `url(${dataUrl})`
    }
}
