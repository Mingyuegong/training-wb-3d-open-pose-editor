(function() {
  let e;
  const n = () => {
    const o = gradioApp().querySelector(
      "#tab_threedopenpose"
    );
    return o && o.style.display != "none";
  };
  onUiLoaded(async () => {
    console.log("sd-webui-3d-open-pose-editor: onUiLoaded");
    const { Main: o } = await import("./lazy/main.js");
    e = await o();
  }), onUiTabChange(() => {
    e && (n() ? e.resume() : e.pause());
  });
})();
