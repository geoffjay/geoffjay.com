use yew::{include_mdx, Html};

use crate::components::markdown::highlight::HighlightCode;
use crate::components::markdown::*;
use crate::features::blog::Metadata;

blog_style!();

pub fn post_1(_: &Metadata) -> Html {
    include_mdx!("src/features/blog/posts/2023-05-07_rendering_markdown_in_a_component.mdx")
}

pub fn post_2(_: &Metadata) -> Html {
    include_mdx!("src/features/blog/posts/2023-12-15_using_threejs_in_yew.mdx")
}

pub fn post_3(_: &Metadata) -> Html {
    include_mdx!("src/features/blog/posts/2025-01-26_nginx_as_a_reverse_proxy_for_fly.mdx")
}
