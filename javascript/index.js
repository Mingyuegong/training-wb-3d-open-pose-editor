(function() {
  const n = () => {
    const o = gradioApp().querySelector(
      "#tab_threedopenpose"
    );
    return o && o.style.display != "none";
  };
  onUiLoaded(async () => {
    console.log("sd-webui-3d-open-pose-editor: onUiLoaded");
    const { Main: o } = await import("./lazy/main.js?c7969a7a");
    window.openpose3dglobal = await o();
  }), onUiTabChange(() => {
    var e;
    const o = (e = window.openpose3dglobal) == null ? void 0 : e.editor;
    o && (n() ? o.resume() : o.pause());
  });
})();
