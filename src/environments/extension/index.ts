import { type BodyEditor } from '../../editor'
;(function () {
    let editor: BodyEditor | undefined

    const isTabActive = () => {
        const tab = gradioApp().querySelector<HTMLElement>(
            '#tab_threedopenpose'
        )
        return tab && tab.style.display != 'none'
    }

    onUiLoaded(async () => {
        console.log('sd-webui-3d-open-pose-editor: onUiLoaded')
        const { Main } = await import('./main')
        editor = await Main()
    })

    onUiTabChange(() => {
        if (!editor) {
            return
        }
        if (isTabActive()) {
            editor.resume()
        } else {
            editor.pause()
        }
    })
})()
