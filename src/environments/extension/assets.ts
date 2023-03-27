const handFBXFileUrl =
    '/file=extensions/sd-webui-3d-open-pose-editor/models/hand.fbx'
const footFBXFileUrl =
    '/file=extensions/sd-webui-3d-open-pose-editor/models/foot.fbx'
const PosesLibraryUrl =
    '/file=extensions/sd-webui-3d-open-pose-editor/src/poses/data.bin'

const files: Record<string, string> = {
    'models/hand.fbx': handFBXFileUrl,
    'models/foot.fbx': footFBXFileUrl,
    'src/poses/data.bin': PosesLibraryUrl,
}
export default files
