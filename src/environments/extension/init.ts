import { options } from '../../config'
import { download } from '../../utils/transfer'
import assets from './assets'
import { gradioAppElem, updateGradioImage } from './internal/gradio'

const consts = JSON.parse(
    gradioAppElem.querySelector('#openpose3d_consts')!.textContent!
)
assets['models/hand.fbx'] = '/file=' + consts.handFbxPath
assets['models/foot.fbx'] = '/file=' + consts.footFbxPath
assets['src/poses/data.bin'] = '/file=' + consts.posesPath

options['Width'] = 512
options['Height'] = 512
options['autoSize'] = false

function sendToControlNet(
    element: Element,
    poseImage: string | null,
    poseTarget: string,
    depthImage: string | null,
    depthTarget: string,
    normalImage: string | null,
    normalTarget: string,
    cannyImage: string | null,
    cannyTarget: string
) {
    const imageElems = element.querySelectorAll('div[data-testid="image"]')
    if (poseImage && poseTarget != '-') {
        updateGradioImage(imageElems[Number(poseTarget)], poseImage, 'pose.png')
    }
    if (depthImage && depthTarget != '-') {
        updateGradioImage(
            imageElems[Number(depthTarget)],
            depthImage,
            'depth.png'
        )
    }
    if (normalImage && normalTarget != '-') {
        updateGradioImage(
            imageElems[Number(normalTarget)],
            normalImage,
            'normal.png'
        )
    }
    if (cannyImage && cannyTarget != '-') {
        updateGradioImage(
            imageElems[Number(cannyTarget)],
            cannyImage,
            'canny.png'
        )
    }
}

window.openpose3d = {
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
        const cnElem = gradioAppElem.querySelector(
            '#txt2img_script_container #controlnet'
        )!
        sendToControlNet(
            cnElem,
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
        const cnElem = gradioAppElem.querySelector(
            '#img2img_script_container #controlnet'
        )!
        sendToControlNet(
            cnElem,
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
