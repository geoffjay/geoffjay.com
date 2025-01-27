use yew::{function_component, html, Html};
use yew_router::prelude::{use_route, Link};

use crate::app::Route;
use crate::features::blog::POSTS;

#[function_component(Posts)]
pub fn posts() -> Html {
    let fmt = time::macros::format_description!("[month repr:short] [day], [year]");
    let year = use_route::<Route>()
        .map(|route| match route {
            Route::Year { year } => Some(year),
            _ => None,
        })
        .flatten();

    POSTS
        .iter()
        .filter(|(md, _)| option_env!("SHOW_UNPUBLISHED").is_some() || md.published)
        .filter(|(md, _)| {
            if let Some(year) = &year {
                md.date.year().to_string() == *year
            } else {
                true
            }
        })
        .map(|(metadata, _)| {
            html! {
              <div class="pb-6">
                <Link<Route> classes="text-inherit" to={Route::Post { slug: metadata.slug.into() }}>
                  <section class="section bg-gray-200 dark:bg-gray-800 mx-4 border-2 border-gray-300 dark:border-gray-600 hover:border-red dark:hover:border-red rounded-lg p-4 shadow-md hover:shadow-lg">
                    <h1 class="text-xl text-gray-700 dark:text-gray-300 font-display">
                      {metadata.title}
                    </h1>
                    <div class="pl-2">
                        <div class="text-md text-gray-500 dark:text-gray-300 italic">{metadata.subtitle}</div>
                        <div class="text-md text-gray-500 italic">
                            {"created on "}{&metadata.date.clone().format(&fmt).unwrap_or_default()}
                        </div>
                    </div>
                  </section>
                </Link<Route>>
              </div>
            }
        })
        .collect()
}

#[function_component(Home)]
pub fn home() -> Html {
    let year = use_route::<Route>()
        .map(|route| match route {
            Route::Year { year } => Some(year),
            _ => None,
        })
        .flatten();

    html! {
        <div class="container mb-8">
            <div class="text-xl pb-6">
                {if let Some(year) = year {
                    format!("Posts from {}", year)
                } else {
                    "All Posts".to_string()
                }}
            </div>
            <Posts />
        </div>
    }
}
