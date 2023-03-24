import * as dat from 'dat.gui'
import datCss from 'dat.gui/build/dat.gui.css?inline'
import { gradioAppElem } from './internal/gradio'

export const canvasElement =
    gradioAppElem.querySelector<HTMLCanvasElement>('#openpose3d_canvas')!
export const statsElement = undefined

export function createDatGui() {
    const gui = new dat.GUI({
        autoPlace: false,
    })
    const guiElem = gradioAppElem.getElementById('openpose3d_gui')!
    const shadowRoot = guiElem.attachShadow({
        mode: 'open',
    })

    const styleElem = document.createElement('style')
    styleElem.innerHTML = datCss

    shadowRoot.appendChild(styleElem)
    shadowRoot.appendChild(gui.domElement)
    gui.domElement.classList.add('a')
    return gui
}
