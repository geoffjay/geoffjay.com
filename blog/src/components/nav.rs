use std::collections::HashSet;
use yew::{classes, function_component, html, use_effect_with, use_state_eq, Callback, Html};
use yew_router::prelude::*;

use crate::app::Route;
use crate::components::animation::Animation;
use crate::components::avatar::Avatar;
use crate::components::theme::ThemeMenu;
use crate::features::blog::POSTS;

fn active_link_classes(current: &Route, link: &Route) -> Vec<String> {
    if current.clone() == link.clone() {
        vec![
            "bg-gray-300".to_string(),
            "dark:bg-gray-800".to_string(),
        ]
    } else {
        vec![
            "bg-transparent".to_string(),
            "dark:bg-transparent".to_string(),
        ]
    }
}

#[function_component(Nav)]
pub fn nav() -> Html {
    let current_route: Route = use_route().unwrap();

    let years: Vec<String> = POSTS
        .iter()
        .map(|(md, _)| md.date.year().to_string())
        .collect::<HashSet<String>>()
        .into_iter()
        .collect::<Vec<_>>();

    let navbar_active = use_state_eq(|| false);

    let toggle_navbar = {
        let navbar_active = navbar_active.clone();

        Callback::from(move |_| {
            navbar_active.set(!*navbar_active);
        })
    };

    let active_class = if !*navbar_active { "hidden" } else { "" };

    let icon_path = if *navbar_active {
        r#"
            M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414
            10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1
            1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z
        "#
        .to_string()
    } else {
        r#"
            M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1
            1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z
        "#
        .to_string()
    };

    let avatar_url = "https://avatars.githubusercontent.com/u/206354?s=400&v=4".to_string();

    let container_classes = vec![
        "flex-col",
        "md:flex",
        "md:flex-row",
        "md:min-h-screen",
        "shadow-navRight",
        // "md:shadow-navBottom",
        "z-10",
    ];

    let link_classes = vec![
        "block",
        "px-8",
        "py-4",
        "text-sm",
        "font-semibold",
        "text-gray-800",
        "hover:text-gray-800",
        "hover:bg-gray-300",
        "focus:text-gray-800",
        "focus:bg-gray-300",
        "focus:outline-none",
        "focus:shadow-outline",
        "border-transparent",
        "border-r-4",
        "hover:border-r-4",
        "hover:border-red",
        "dark:text-gray-300",
        "dark:hover:bg-gray-500",
        "dark:hover:text-white",
        "dark:focus:bg-gray-500",
        "dark:focus:text-white",
        "dark:border-transparent",
        "dark:border-r-4",
        "dark:hover:border-r-4",
        "dark:hover:border-red",
    ];

    use_effect_with(current_route.clone(), move |_| {
        navbar_active.set(false);
        || {}
    });

    html! {
        <div class={classes!(container_classes)}>
            <div class="flex flex-col w-full md:w-[200px] text-gray-700 bg-gray-200 dark:text-gray-200 dark:bg-gray-800 flex-shrink-0">
                <div class="flex-shrink-0 px-8 py-8 flex flex-row items-center justify-around">
                    <Link<Route>
                        classes={classes!(
                            "text-lg",
                            "font-semibold",
                            "tracking-widest",
                            "text-gray-800",
                            "uppercase",
                            "dark:text-white",
                            "focus:outline-none",
                            "focus:shadow-outline",
                        )}
                        to={Route::Home}
                    >
                        <Avatar url={avatar_url} initials={"gj"} />
                    </Link<Route>>
                    <button
                        class="rounded-lg md:hidden rounded-lg focus:outline-none focus:shadow-outline"
                        onclick={toggle_navbar}
                    >
                        <svg fill="currentColor" viewBox="0 0 20 20" class="w-6 h-6">
                            <path fill-rule="evenodd" d={icon_path} clip-rule="evenodd"></path>
                        </svg>
                    </button>
                </div>
                <nav
                    class={classes!(
                        "flex-grow",
                        "md:block",
                        "md:pb-0",
                        "md:overflow-y-auto",
                        active_class,
                    )}
                >
                    <Animation xyz="fade left stagger">
                        {years.iter().map(|year| {
                            let year_route = Route::Year { year: year.clone() };
                            html! {
                                <div class="xyz-nested">
                                    <Link<Route>
                                        classes={classes!(
                                            active_link_classes(&current_route, &year_route),
                                            link_classes.clone(),
                                        )}
                                        to={year_route}
                                    >
                                        {year}
                                    </Link<Route>>
                                </div>
                            }
                        }).collect::<Html>()}
                    </Animation>
                </nav>
                <div class="flex-grow">
                    <ThemeMenu />
                </div>
            </div>
        </div>
    }
}
