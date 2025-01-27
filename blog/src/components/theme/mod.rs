use yew::prelude::*;
use yew_icons::{Icon, IconId};
use yewdux::prelude::*;

use crate::components::animation::Animation;
use crate::store::{State, Theme};

#[derive(PartialEq, Properties, Clone)]
pub struct ThemeButtonProps {
    onclick: Callback<MouseEvent>,
}

#[function_component(ThemeButton)]
pub fn theme_button(props: &ThemeButtonProps) -> Html {
    let ThemeButtonProps { onclick } = props;
    let (state, _) = use_store::<State>();
    let icon_id = use_state(|| IconId::OcticonsSun16);

    let classes = vec![
        "inline-flex",
        "items-center",
        "justify-center",
        "rounded-md",
        "text-sm",
        "font-medium",
        "ring-offset-background",
        "transition-colors",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-ring",
        "focus-visible:ring-offset-2",
        "disabled:pointer-events-none",
        "disabled:opacity-50",
        "h-10",
        "px-2",
        "py-2",
        "bg-emerald-600",
        "text-slate-100",
        "hover:bg-emerald-600/90",
    ];

    {
        let icon_id = icon_id.clone();

        use_effect_with((), move |_| {
            let cb = match state.theme.clone() {
                Theme::Dark => Callback::from(move |_| icon_id.set(IconId::OcticonsMoon16)),
                Theme::Light => Callback::from(move |_| icon_id.set(IconId::OcticonsSun16)),
                Theme::System => Callback::from(move |_| icon_id.set(IconId::OcticonsTerminal16)),
            };

            cb.emit(())
        });
    }

    html! {
        <button class={classes!(classes)} {onclick}>
            <Icon icon_id={*icon_id} />
        </button>
    }
}

#[derive(PartialEq, Properties, Clone)]
pub struct ThemeMenuButtonProps {
    theme: Theme,
    onclick: Callback<Theme>,
}

#[function_component(ThemeMenuButton)]
pub fn theme_menu_button(props: &ThemeMenuButtonProps) -> Html {
    let ThemeMenuButtonProps { theme, onclick } = props;
    let icon_id = match theme.clone() {
        Theme::Dark => IconId::OcticonsMoon16,
        Theme::Light => IconId::OcticonsSun16,
        Theme::System => IconId::OcticonsTerminal16,
    };

    let handle_click = {
        let onclick = onclick.clone();
        let theme = theme.clone();

        Callback::from(move |_| {
            onclick.emit(theme.clone());
        })
    };

    let classes = vec![
        "inline-flex",
        "items-center",
        "justify-center",
        "rounded-md",
        "text-sm",
        "font-medium",
        "ring-offset-background",
        "transition-colors",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-ring",
        "focus-visible:ring-offset-2",
        "disabled:pointer-events-none",
        "disabled:opacity-50",
        "h-10",
        "px-2",
        "py-2",
        "bg-emerald-600",
        "text-slate-100",
        "hover:bg-emerald-600/90",
    ];

    html! {
        <li>
            <button class={classes!(classes)} onclick={handle_click}>
                <Icon icon_id={icon_id} />
            </button>
        </li>
    }
}

#[function_component(ThemeMenu)]
pub fn theme_menu() -> Html {
    let is_open = use_state(|| false);
    let (_, dispatch) = use_store::<State>();

    let handle_click = {
        let is_open = is_open.clone();
        Callback::from(move |_| is_open.set(!*is_open))
    };

    let close_cb = {
        let is_open = is_open.clone();
        Callback::from(move |_| is_open.set(false))
    };

    let handle_theme = dispatch.reduce_mut_callback_with(move |state, theme: Theme| {
        state.set_theme(theme);
        close_cb.emit(());
    });

    // FIXME: need to fix how the menu is revealed for fade out to work
    let xyz = if *is_open { "fade in" } else { "fade out" };

    html! {
        <>
            <ThemeButton onclick={handle_click} />
            if *is_open {
                <Animation xyz={xyz}>
                    <ul class="w-full flex flex-row">
                        <ThemeMenuButton
                            theme={Theme::Light}
                            onclick={handle_theme.clone()}
                        />
                        <ThemeMenuButton
                            theme={Theme::Dark}
                            onclick={handle_theme.clone()}
                        />
                        <ThemeMenuButton
                            theme={Theme::System}
                            onclick={handle_theme.clone()}
                        />
                    </ul>
                </Animation>
            }
        </>
    }
}
