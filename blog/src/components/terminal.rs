use yew::{function_component, html, Children, Html, Properties};

#[derive(PartialEq, Properties)]
pub struct TerminalProps {
    #[prop_or_default]
    pub children: Children,

    #[prop_or_default]
    pub command: String,
}

#[function_component(Terminal)]
pub fn terminal(props: &TerminalProps) -> Html {
    let TerminalProps { children, command } = props;
    let prompt = "~/projects # ".to_string();

    html! {
        <div class="mx-auto">
            <div class="w-full shadow-2xl subpixel-antialiased rounded h-64 bg-gray-700 border-gray-800 mx-auto">
                <div
                    id="terminal-header"
                    class="flex items-center h-6 rounded-t bg-gray-800 border-b border-gray-800 text-center text-gray-200"
                >
                    <div
                        id="closebtn"
                        class="flex ml-2 items-center text-center border-red bg-red shadow-inner rounded-full w-3 h-3"
                    >
                    </div>
                    <div
                        id="minbtn"
                        class="ml-2 border-yellow bg-yellow shadow-inner rounded-full w-3 h-3"
                    >
                    </div>
                    <div
                        id="maxbtn"
                        class="ml-2 border-green bg-green shadow-inner rounded-full w-3 h-3"
                    >
                    </div>
                    <div id="terminal-title" class="mx-auto pr-16">
                        // <p class="text-center text-sm">{"Terminal"}</p>
                    </div>
                </div>
                <div id="console" class="p-2 h-auto text-green font-mono text-xs bg-gray-700">
                    // <p class="pb-1">{"Last login: Wed Sep 25 09:11:04 on ttys002"}</p>
                    <p class="pb-1">{prompt.clone()}{command}</p>
                    {children.clone()}
                    <p class="pb-1">{prompt.clone()}</p>
                </div>
            </div>
        </div>
    }
}
