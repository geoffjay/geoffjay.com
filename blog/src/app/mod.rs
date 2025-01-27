use yew::prelude::*;
use yew_router::prelude::*;

use crate::bindings;
use crate::components::{footer::Footer, nav::Nav};
use crate::features::{blog::Post, home::Home};
use crate::store::State;

#[derive(Clone, Routable, PartialEq)]
pub enum Route {
    #[at("/")]
    Home,
    #[at("/:year")]
    Year { year: String },
    #[at("/posts/:slug")]
    Post { slug: String },
    #[not_found]
    #[at("/404")]
    NotFound,
}

fn switch(routes: Route) -> Html {
    match routes.clone() {
        Route::Home => html! {<Home />},
        Route::Year { year: _ } => html! {<Home />},
        Route::Post { slug } => html! {<Post slug={slug} />},
        Route::NotFound => html! {<h1>{"404"}</h1>},
    }
}

#[function_component(App)]
pub fn app() -> Html {
    let mut state = State::default();
    let main_classes = vec![
        "flex",
        "flex-col",
        "flex-0",
        "grow",
        "px-8",
        "pt-8",
        "pb-2",
        "w-full",
        "text-gray-700",
        "bg-gray-100",
        "dark:text-gray-200",
        "dark:bg-gray-700",
        "justify-between",
    ];

    bindings::highlight();

    use_effect(move || state.load_theme());

    html! {
        <HashRouter>
            <div class="flex flex-col md:flex-row min-h-screen w-full bg-gray-100">
                <Nav />
                <div class={classes!(main_classes)}>
                    <main class="h-full grow flex flex-col">
                        <Switch<Route> render={switch} />
                    </main>
                    <Footer />
                </div>
            </div>
        </HashRouter>
    }
}
