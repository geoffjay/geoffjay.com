use std::borrow::Borrow;
use yew::{function_component, html, Children, Html, Properties};
use yew_router::hooks::use_location;

pub mod highlight;

use highlight::HighlightCode;

macro_rules! blog_style {
    () => {
        yew::mdx_style!(
            h1: MyH1,
            h2: MyH2,
            h3: MyH3,
            h4: MyH4,
            h5: MyH5,
            h6: MyH6,
            a: MyLink,
            blockquote: MyBlockquote,
            pre: HighlightCode,
            p: MyP,
            li: MyLi,
            ul: MyUl,
            ol: MyOl,
            code: MyCode,
            em: MyEm,
            strong: MyStrong,
            s: MyStrikethrough,
            hr: MyHr,
            table: MyTable,
            thead: MyThead,
            tr: MyTr,
            td: MyTd,
        );
    };
}

pub(crate) use blog_style;

#[derive(PartialEq, Properties)]
pub struct ChildProps {
    #[prop_or_default]
    pub children: Children,
}

#[derive(PartialEq, Properties)]
pub struct LinkChildProps {
    #[prop_or_default]
    pub children: Children,
    pub href: String,
}

const HEADER_LINK_LEN: usize = 20;

#[function_component]
pub fn MyH1(c: &ChildProps) -> Html {
    let location = use_location().unwrap();
    let path = location.path();
    let mut tag = String::new();

    for c in c.children.iter() {
        match c {
            yew::virtual_dom::VNode::VText(t) => {
                tag += &t.text.to_string();
            }
            _ => (),
        };
    }

    tag = tag.replace(" ", "-").to_lowercase();
    tag.truncate(HEADER_LINK_LEN);

    html! {
      <h1 id={tag.clone()} class="text-6xl py-8">
        <a class="text-inherit" href={format!("{path}#{tag}")}>
          {c.children.clone()}
        </a>
      </h1>
    }
}

#[function_component]
pub fn MyH2(c: &ChildProps) -> Html {
    let location = use_location().unwrap();
    let path = location.path();
    let mut tag = String::new();

    for c in c.children.iter() {
        match c {
            yew::virtual_dom::VNode::VText(t) => {
                tag += &t.text.to_string();
            }
            _ => (),
        };
    }

    tag = tag.replace(" ", "-").to_lowercase();
    tag.truncate(HEADER_LINK_LEN);

    html! {
      <h2 id={tag.clone()} class="text-5xl py-6">
        <a class="text-inherit" href={format!("{path}#{tag}")}>
          {c.children.clone()}
        </a>
      </h2>
    }
}

#[function_component]
pub fn MyH3(c: &ChildProps) -> Html {
    let location = use_location().unwrap();
    let path = location.path();
    let tag = children_to_slug(c.children.iter());

    html! {
      <h3 id={tag.clone()} class="text-4xl py-6">
        <a class="text-inherit" href={format!("{path}#{tag}")}>
          {c.children.clone()}
        </a>
      </h3>
    }
}

#[function_component]
pub fn MyH4(c: &ChildProps) -> Html {
    let location = use_location().unwrap();
    let path = location.path();
    let tag = children_to_slug(c.children.iter());

    html! {
      <h4 id={tag.clone()} class="text-3xl py-4">
        <a class="text-inherit" href={format!("{path}#{tag}")}>
          {c.children.clone()}
        </a>
      </h4>
    }
}

#[function_component]
pub fn MyH5(c: &ChildProps) -> Html {
    let location = use_location().unwrap();
    let path = location.path();
    let tag = children_to_slug(c.children.iter());

    html! {
      <h5 id={tag.clone()} class="text-2xl py-4">
        <a class="text-inherit" href={format!("{path}#{tag}")}>
          {c.children.clone()}
        </a>
      </h5>
    }
}

#[function_component]
pub fn MyH6(c: &ChildProps) -> Html {
    let location = use_location().unwrap();
    let path = location.path();
    let tag = children_to_slug(c.children.iter());

    html! {
      <h6 id={tag.clone()} class="text-xl py-4">
        <a class="text-inherit" href={format!("{path}#{tag}")}>
          {c.children.clone()}
        </a>
      </h6>
    }
}

fn children_to_slug(c: impl IntoIterator<Item = Html>) -> String {
    let mut out = children_to_string(c);
    out.truncate(HEADER_LINK_LEN);
    out
}

fn children_to_string<H: Borrow<Html>>(c: impl IntoIterator<Item = H>) -> String {
    let mut out = String::new();

    for c in c.into_iter() {
        match c.borrow() {
            yew::virtual_dom::VNode::VText(t) => {
                out += &t.text.to_string();
            }
            _ => (),
        };
    }

    out = out.replace(" ", "-").to_lowercase();
    out
}

#[function_component]
pub fn MyLink(c: &LinkChildProps) -> Html {
    let href = c.href.clone();

    html! {
      <a class="text-blue hover:text-lightblue hover:underline" href={href.clone()}>
        {c.children.clone()}
      </a>
    }
}

#[function_component]
pub fn MyPre(c: &ChildProps) -> Html {
    html! {
      <pre class="overflow-auto m-4 p-6 bg-gray-300/5 rounded">
          <HighlightCode>{c.children.clone()}</HighlightCode>
      </pre>
    }
}

#[function_component]
pub fn MyBlockquote(c: &ChildProps) -> Html {
    html! {
      <blockquote class="text-black/70 dark:text-white/50 border-l-4 border-red px-4 m-4 italic">
        {c.children.clone()}
      </blockquote>
    }
}

#[function_component]
pub fn MyP(c: &ChildProps) -> Html {
    html! {
      <p class="text-base/7 py-2">
        {c.children.clone()}
      </p>
    }
}

#[function_component]
pub fn MyOl(c: &ChildProps) -> Html {
    html! {
      <div class="list-decimal my-4 px-6">{c.children.clone()}</div>
    }
}

#[function_component]
pub fn MyUl(c: &ChildProps) -> Html {
    html! {
      <div class="list-disc my-4 px-6">{c.children.clone()}</div>
    }
}

#[function_component]
pub fn MyLi(c: &ChildProps) -> Html {
    html! {
      <li>{c.children.clone()}</li>
    }
}

#[function_component]
pub fn MyCode(c: &ChildProps) -> Html {
    html! {
      <code class="border border-gray-500 rounded-sm bg-gray-300 text-gray-800 text-xs p-1">
        {c.children.clone()}
      </code>
    }
}

#[function_component]
pub fn MyEm(c: &ChildProps) -> Html {
    html! {
      <span class="italic">{c.children.clone()}</span>
    }
}

#[function_component]
pub fn MyStrong(c: &ChildProps) -> Html {
    html! {
      <span class="font-bold">{c.children.clone()}</span>
    }
}

#[function_component]
pub fn MyStrikethrough(c: &ChildProps) -> Html {
    html! {
      <span class="line-through">{c.children.clone()}</span>
    }
}

#[function_component]
pub fn MyHr() -> Html {
    html! {
      <hr class="border-gray-500 border-1 my-8" />
    }
}

#[function_component]
pub fn MyTable(c: &ChildProps) -> Html {
    html! {
      <table class="min-w-full divide-y divide-gray-200 border border-collapse border-gray-500">
        {c.children.clone()}
      </table>
    }
}

#[function_component]
pub fn MyThead(c: &ChildProps) -> Html {
    html! {
      <thead scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-500">
        {c.children.clone()}
      </thead>
    }
}

#[function_component]
pub fn MyTr(c: &ChildProps) -> Html {
    html! {
      <tr class="bg-gray-200">
        {c.children.clone()}
      </tr>
    }
}

#[function_component]
pub fn MyTd(c: &ChildProps) -> Html {
    html! {
      <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500 border border-gray-500">
        {c.children.clone()}
      </td>
    }
}
