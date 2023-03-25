export const gradioAppElem = gradioApp()

const waitForElementToBeRemoved = async (parent: Element, selector: string) => {
    return new Promise((resolve) => {
        const observer = new MutationObserver(() => {
            if (parent.querySelector(selector)) {
                return
            }
            observer.disconnect()
            resolve(undefined)
        })

        observer.observe(parent, {
            childList: true,
            subtree: true,
        })

        if (!parent.querySelector(selector)) {
            resolve(undefined)
        }
    })
}

export const updateGradioImage = async (
    element: Element,
    url: string,
    name: string
) => {
    const blob = await (await fetch(url)).blob()
    const file = new File([blob], name)
    const dt = new DataTransfer()
    dt.items.add(file)

    element
        .querySelector<HTMLButtonElement>("button[aria-label='Clear']")
        ?.click()
    await waitForElementToBeRemoved(element, "button[aria-label='Clear']")
    const input = element.querySelector<HTMLInputElement>("input[type='file']")!
    input.value = ''
    input.files = dt.files
    input.dispatchEvent(
        new Event('change', {
            bubbles: true,
            composed: true,
        })
    )
}
