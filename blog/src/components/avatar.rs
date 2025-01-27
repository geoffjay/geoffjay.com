use yew::{function_component, html, Html, Properties};

#[derive(Properties, PartialEq)]
pub struct AvatarProps {
    pub url: String,
    pub initials: String,
}

#[function_component(Avatar)]
pub fn avatar(props: &AvatarProps) -> Html {
    html! {
        <div class="w-24 h-24 relative">
            <div class="group w-full h-full rounded-full overflow-hidden shadow-lg text-center bg-purple table cursor-pointer">
                <span class="hidden group-hover:table-cell text-white font-bold align-middle">
                    { props.initials.clone() }
                </span>
                <img
                    src={props.url.clone()}
                    alt="avatar"
                    class="object-cover object-center w-full h-full visible group-hover:hidden"
                />
            </div>
        </div>
    }
}
