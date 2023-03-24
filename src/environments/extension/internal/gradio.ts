export const gradioAppElem = gradioApp()

export const updateGradioImage = async (
    element: Element,
    url: string,
    name: string
) => {
    const blob = await (await fetch(url)).blob()
    const file = new File([blob], name)
    const dt = new DataTransfer()
    dt.items.add(file)

    const input = element.querySelector<HTMLInputElement>("input[type='file']")!
    element
        .querySelector<HTMLButtonElement>("button[aria-label='Clear']")
        ?.click()
    input.value = ''
    input.files = dt.files
    input.dispatchEvent(
        new Event('change', {
            bubbles: true,
            composed: true,
        })
    )
}
