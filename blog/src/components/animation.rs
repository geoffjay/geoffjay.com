use yew::{function_component, html, Children, Html, Properties};

#[derive(PartialEq, Properties, Clone)]
pub struct AnimationWrapperProps {
    #[prop_or(false)]
    pub xyz: bool,
    #[prop_or_default]
    pub children: Children,
}

#[function_component(AnimationWrapper)]
pub fn animation_wrapper(props: &AnimationWrapperProps) -> Html {
    let AnimationWrapperProps { xyz, children } = props.clone();

    let node = if xyz {
        html! {
            <div xyz="">{ for children.iter() }</div>
        }
    } else {
        html! {
            <div>{ for children.iter() }</div>
        }
    };

    node
}

#[derive(PartialEq, Properties, Clone)]
pub struct AnimationProps {
    pub xyz: String,
    #[prop_or_default]
    pub children: Children,
}

#[function_component(Animation)]
pub fn animation(props: &AnimationProps) -> Html {
    let AnimationProps { xyz, children } = props.clone();

    let node = if !xyz.is_empty() {
        html! {
            <div class="xyz-in" xyz={xyz}>{ for children.iter() }</div>
        }
    } else {
        html! {
            <div class="xyz-in">{ for children.iter() }</div>
        }
    };

    node
}
