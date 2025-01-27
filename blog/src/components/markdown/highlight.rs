use std::rc::Rc;
use web_sys::Element;
use yew::{prelude::*, virtual_dom::VNode};

// Credit to https://github.com/kcking/implfuture.dev for this code.

#[function_component]
pub fn HighlightCode(c: &super::ChildProps) -> Html {
    let code_ref = use_state_eq(|| NodeRef::default());
    let code_tag = c.children.iter().next().unwrap().clone();
    let code_tag = if let VNode::VTag(t) = code_tag {
        let mut t = (*t).clone();
        t.node_ref = (*code_ref).clone();
        VNode::VTag(Rc::new(t))
    } else {
        code_tag
    };

    use_effect_with(c.children.clone(), move |_| {
        let element = code_ref.cast::<Element>().unwrap();
        prism::highlightElement(element.clone());
        move || {
            element
                .closest(".codecontainer")
                .ok()
                .flatten()
                .map(|e| e.remove());
        }
    });

    html! {
        <div class="codecontainer">
            <pre class="overflow-auto m-4 p-6 bg-gray-300/5 rounded">
                {code_tag}
            </pre>
        </div>
    }
}

mod prism {
    use wasm_bindgen::prelude::*;

    #[wasm_bindgen]
    extern "C" {
        #[wasm_bindgen(js_namespace = Prism)]
        pub fn highlightElement(element: web_sys::Element);
    }
}
