use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    // this should be in js-sys but is not. see https://github.com/rustwasm/wasm-bindgen/issues/2865
    pub fn import(s: &str) -> js_sys::Promise;

    pub type Window;

    #[wasm_bindgen(method, getter, js_name = "wasmBindgenSnippetsPath")]
    pub fn wasm_bindgen_snippets_path(this: &Window) -> String;
}

#[wasm_bindgen(module = "/js/prism.js")]
extern "C" {
    #[wasm_bindgen]
    pub fn highlight();
}
