use time::macros::date;
use yew::Html;

mod post;
mod posts;

pub use post::Post;

pub struct Metadata {
    pub title: &'static str,
    pub date: time::Date,
    pub slug: &'static str,
    pub subtitle: &'static str,
    pub published: bool,
}

pub const POSTS: &[(Metadata, &dyn Fn(&Metadata) -> Html)] = &[(
    Metadata {
        title: "Rendering Markdown in a Component",
        date: date!(2023 - 5 - 7),
        slug: "rendering-markdown-in-a-component",
        subtitle: "A post demonstrating rendering all supported markdown features in a Yew component using pulldown_cmark",
        published: true,
    },
    &posts::post_1,
), (
    Metadata {
        title: "Using three.js in Yew",
        date: date!(2023 - 12 - 15),
        slug: "using-threejs-in-yew",
        subtitle: "A post demonstrating using three.js in a Yew component",
        published: true,
    },
    &posts::post_2,
), (
    Metadata {
        title: "Nginx as a Reverse Proxy for Fly",
        date: date!(2025 - 01 - 26),
        slug: "nginx-as-a-reverse-proxy-for-fly",
        subtitle: "Using Nginx as a reverse proxy for Fly.io apps",
        published: true,
    },
    &posts::post_3,
)];
