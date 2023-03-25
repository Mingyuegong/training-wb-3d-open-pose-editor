import html
import json
import pathlib

import gradio as gr

try:
    root_path = pathlib.Path(__file__).resolve().parents[1]
except NameError:
    import inspect

    root_path = pathlib.Path(inspect.getfile(lambda: None)).resolve().parents[1]


def on_ui_tabs():
    with gr.Blocks(analytics_enabled=False) as blocks:
        create_ui()
    return [(blocks, "3D Openpose", "threedopenpose")]


def create_ui():
    try:
        from modules.shared import opts

        cn_max: int = opts.control_net_max_models_num
    except (ImportError, AttributeError):
        cn_max = 0

    consts = {
        "handFbxPath": str(root_path / "models" / "hand.fbx"),
        "footFbxPath": str(root_path / "models" / "foot.fbx"),
        "posesPath": str(root_path / "src" / "poses" / "data.bin"),
    }

    gr.HTML(
        f"""
        <div id="openpose3d_consts">{html.escape(json.dumps(consts))}</div>
        """,
        visible=False,
    )
    with gr.Row():
        with gr.Column(scale=3):
            gr.HTML(
                """
                <div id="openpose3d_main">
                    <div id="openpose3d_background"></div>
                    <canvas id="openpose3d_canvas" width="512" height="512"></canvas>
                    <div id="openpose3d_gui"></div>
                </div>
                """
            )
            gr.Markdown(
                "Original: [Online 3D Openpose Editor](https://zhuyu1997.github.io/open-pose-editor/)"
            )
        with gr.Column(scale=1):
            gr.Markdown("**1.** Edit pose of 3D model")
            gr.Markdown("**2.** Generate ControlNet images")
            make_image = gr.Button(
                value="Generate Skeleton/Depth/Normal/Canny Map", variant="primary"
            )
            gr.Markdown("**3.** Send to ControlNet")
            with gr.Row():
                send_t2i = gr.Button(value="Send to txt2img", variant="primary")
                send_i2i = gr.Button(value="Send to img2img", variant="primary")
            with gr.Row():
                cn_dropdown_list = [str(i) for i in range(cn_max)]
                cn_dropdown_list.insert(0, "-")
                with gr.Column(variant="panel"):
                    pose_image = gr.Image(label="Pose", elem_id="openpose3d_pose_image")
                    with gr.Row():
                        pose_target = gr.Dropdown(
                            label="ControlNet number",
                            choices=cn_dropdown_list,
                            value="0" if cn_max >= 1 else "-",
                        )
                        pose_download = gr.Button(value="Download")
                with gr.Column(variant="panel"):
                    depth_image = gr.Image(
                        label="Depth", elem_id="openpose3d_depth_image"
                    )
                    with gr.Row():
                        depth_target = gr.Dropdown(
                            label="ControlNet number",
                            choices=cn_dropdown_list,
                            value="1" if cn_max >= 2 else "-",
                        )
                        depth_download = gr.Button(value="Download")
                with gr.Column(variant="panel"):
                    normal_image = gr.Image(
                        label="Normal", elem_id="openpose3d_normal_image"
                    )
                    with gr.Row():
                        normal_target = gr.Dropdown(
                            label="ControlNet number",
                            choices=cn_dropdown_list,
                            value="2" if cn_max >= 3 else "-",
                        )
                        normal_download = gr.Button(value="Download")
                with gr.Column(variant="panel"):
                    canny_image = gr.Image(
                        label="Canny", elem_id="openpose3d_canny_image"
                    )
                    with gr.Row():
                        canny_target = gr.Dropdown(
                            label="ControlNet number",
                            choices=cn_dropdown_list,
                            value="3" if cn_max >= 4 else "-",
                        )
                        canny_download = gr.Button(value="Download")

    make_image.click(
        None,
        make_image,
        None,
        _js="window.openpose3d.makeImages",
    )
    send_cn_inputs = [
        pose_image,
        pose_target,
        depth_image,
        depth_target,
        normal_image,
        normal_target,
        canny_image,
        canny_target,
    ]
    send_t2i.click(
        None,
        send_cn_inputs,
        None,
        _js="window.openpose3d.sendTxt2img",
    )
    send_i2i.click(
        None,
        send_cn_inputs,
        None,
        _js="window.openpose3d.sendImg2img",
    )
    pose_download.click(
        None,
        pose_image,
        None,
        _js="(v) => window.openpose3d.downloadImage(v, 'pose.png')",
    )
    depth_download.click(
        None,
        depth_image,
        None,
        _js="(v) => window.openpose3d.downloadImage(v, 'depth.png')",
    )
    normal_download.click(
        None,
        normal_image,
        None,
        _js="(v) => window.openpose3d.downloadImage(v, 'normal.png')",
    )
    canny_download.click(
        None,
        canny_image,
        None,
        _js="(v) => window.openpose3d.downloadImage(v, 'canny.png')",
    )


def main():
    js_path = root_path / "javascript" / "index.js"
    css_path = root_path / "style.css"

    original_template_response = gr.routes.templates.TemplateResponse
    head = f"""
    <script>
        function gradioApp() {{
            const elems = document.getElementsByTagName('gradio-app')
            const gradioShadowRoot = elems.length == 0 ? null : elems[0].shadowRoot
            return gradioShadowRoot ? gradioShadowRoot : document
        }}
        function onUiLoaded(callback){{
            callback()
        }}
        function onUiTabChange(callback){{
        }}
    </script>
    <script type="module">
        document.addEventListener("DOMContentLoaded", function() {{import("/file={js_path}")}})
    </script>
    """

    def template_response(*args, **kwargs):
        res = original_template_response(*args, **kwargs)
        res.body = res.body.replace(b"</head>", f"{head}</head>".encode("utf8"))
        res.init_headers()
        return res

    gr.routes.templates.TemplateResponse = template_response

    with gr.Blocks(analytics_enabled=False, css=css_path.read_text()) as blocks:
        create_ui()
    blocks.launch()


try:
    from modules import script_callbacks

    script_callbacks.on_ui_tabs(on_ui_tabs)
except ImportError:
    main()
