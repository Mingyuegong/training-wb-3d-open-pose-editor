import { options } from '../../config'
import { download } from '../../utils/transfer'
import assets from './assets'
import { gradioAppElem, updateGradioImage } from './internal/gradio'

const consts = JSON.parse(
    gradioAppElem.querySelector('#openpose3d_consts')!.textContent!
)
Object.assign(assets, consts['assets'])

options['Width'] = 512
options['Height'] = 512
options['autoSize'] = false

function sendToControlNet(
    container: Element,
    poseImage: string | null,
    poseTarget: string,
    depthImage: string | null,
    depthTarget: string,
    normalImage: string | null,
    normalTarget: string,
    cannyImage: string | null,
    cannyTarget: string
) {
    let element: Element | null | undefined =
        container.querySelector('#controlnet')
    if (!element) {
        for (const spans of container.querySelectorAll<HTMLSpanElement>(
            '.cursor-pointer > span'
        )) {
            if (!spans.textContent?.includes('ControlNet')) {
                continue
            }
            if (spans.textContent?.includes('M2M')) {
                continue
            }
            element = spans.parentElement?.parentElement
        }
        if (!element) {
            console.error('ControlNet element not found')
            return
        }
    }
    const imageElems = element.querySelectorAll('div[data-testid="image"]')
    if (poseImage && poseTarget != '' && poseTarget != '-') {
        updateGradioImage(imageElems[Number(poseTarget)], poseImage, 'pose.png')
    }
    if (depthImage && depthTarget != '' && depthTarget != '-') {
        updateGradioImage(
            imageElems[Number(depthTarget)],
            depthImage,
            'depth.png'
        )
    }
    if (normalImage && normalTarget != '' && normalTarget != '-') {
        updateGradioImage(
            imageElems[Number(normalTarget)],
            normalImage,
            'normal.png'
        )
    }
    if (cannyImage && cannyTarget != '' && cannyTarget != '-') {
        updateGradioImage(
            imageElems[Number(cannyTarget)],
            cannyImage,
            'canny.png'
        )
    }
}

window.openpose3d = {
    makeImages: () => {
        window.openpose3dglobal?.helper?.MakeImages()
    },
    sendTxt2img: (
        poseImage: string | null,
        poseTarget: string,
        depthImage: string | null,
        depthTarget: string,
        normalImage: string | null,
        normalTarget: string,
        cannyImage: string | null,
        cannyTarget: string
    ) => {
        const container = gradioAppElem.querySelector(
            '#txt2img_script_container'
        )!
        sendToControlNet(
            container,
            poseImage,
            poseTarget,
            depthImage,
            depthTarget,
            normalImage,
            normalTarget,
            cannyImage,
            cannyTarget
        )
        switch_to_txt2img()
    },
    sendImg2img: (
        poseImage: string,
        poseTarget: string,
        depthImage: string,
        depthTarget: string,
        normalImage: string,
        normalTarget: string,
        cannyImage: string,
        cannyTarget: string
    ) => {
        const container = gradioAppElem.querySelector(
            '#img2img_script_container'
        )!
        sendToControlNet(
            container,
            poseImage,
            poseTarget,
            depthImage,
            depthTarget,
            normalImage,
            normalTarget,
            cannyImage,
            cannyTarget
        )
        switch_to_img2img()
    },
    downloadImage: (image: string | null, name: string) => {
        if (!image) {
            return
        }
        download(image, name)
    },
}
