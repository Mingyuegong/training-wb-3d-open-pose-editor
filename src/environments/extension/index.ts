import { getCurrentTime } from '../../utils/time'
import { updateGradioImage } from './internal/gradio'

window.addEventListener('load', () => {
    const gradioAppElem = gradioApp()

    window.addEventListener(
        'message',
        (event) => {
            console.log(event.origin, event.data)
            if (event.data?.method === 'makeImages') {
                const image = event.data.body as Record<string, string>
                for (const [name, imgData] of Object.entries(image)) {
                    const fileName = name + '_' + getCurrentTime()
                    const imageElem = gradioAppElem.querySelector(
                        `#openpose3d_${name}_image`
                    )!
                    updateGradioImage(imageElem, imgData, fileName)
                }
            }
            // …
        },
        false
    )

    // const openpose3dWindow = window.open(
    //     'http://localhost:5173/open-pose-editor/'
    // )

    window.openpose3d = {
        makeImages: () => {
            console.log('makeImages')

            // openpose3dWindow?.postMessage('makeImages', 'http://localhost:5173')

            const iframe = gradioAppElem.querySelector(
                '#openpose3d_iframe'
            ) as HTMLIFrameElement
            console.log(iframe)

            iframe?.contentWindow?.postMessage(
                'makeImages',
                'http://localhost:5173'
            )
        },
        sendTxt2img: () => {},
        sendImg2img: () => {},
        downloadImage: (image: string | null, name: string) => {},
    }

    const isTabActive = () => {
        const tab = gradioApp().querySelector<HTMLElement>(
            '#tab_threedopenpose'
        )
        return tab && tab.style.display != 'none'
    }

    onUiLoaded(async () => {
        console.log('sd-webui-3d-open-pose-editor: onUiLoaded')
        // const { Main } = await import('./main')
        // window.openpose3dglobal = await Main()
    })

    onUiTabChange(() => {
        const editor = window.openpose3dglobal?.editor
        if (!editor) {
            return
        }
        if (isTabActive()) {
            editor.resume()
        } else {
            editor.pause()
        }
    })
})

export {}
