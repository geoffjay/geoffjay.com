use yew::{function_component, html, Html, Properties};
use yew_router::components::Redirect;

use crate::app::Route;
use crate::features::blog::POSTS;

#[derive(Properties, PartialEq)]
pub struct PostProps {
    pub slug: String,
}

#[function_component(Post)]
pub fn post(props: &PostProps) -> Html {
    let slug = props.slug.clone();
    let post_content = POSTS
        .iter()
        .find(|(meta, _)| &slug == &meta.slug)
        .map(|(meta, post)| post(meta))
        .unwrap_or(html! { <Redirect<Route> to={Route::NotFound} /> });
    html! {
      <div class="w-full md:max-w-4xl p-2">
        {post_content}
      </div>
    }
}
