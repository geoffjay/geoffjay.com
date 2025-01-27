extern crate yew;
extern crate yew_router;

mod app;
mod bindings;
mod components;
mod features;
mod store;

use app::App;

pub fn main() {
    wasm_logger::init(wasm_logger::Config::new(log::Level::Trace));
    yew::Renderer::<App>::new().render();
}
