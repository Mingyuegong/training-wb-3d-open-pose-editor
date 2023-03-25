;(function () {
    const isTabActive = () => {
        const tab = gradioApp().querySelector<HTMLElement>(
            '#tab_threedopenpose'
        )
        return tab && tab.style.display != 'none'
    }

    onUiLoaded(async () => {
        console.log('sd-webui-3d-open-pose-editor: onUiLoaded')
        const { Main } = await import('./main')
        window.openpose3dglobal = await Main()
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
})()

export {}
