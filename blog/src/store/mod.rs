use gloo_storage::{LocalStorage, Storage};
use serde::{Deserialize, Deserializer, Serialize};
use yewdux::store::Store;

#[derive(Clone, Debug, Default, PartialEq, Eq, Serialize)]
pub enum Theme {
    #[default]
    Light,
    Dark,
    System,
}

impl<'de> Deserialize<'de> for Theme {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        let s = String::deserialize(deserializer)?;
        Ok(match s.as_str() {
            "light" => Theme::Light,
            "dark" => Theme::Dark,
            "system" => Theme::System,
            _ => Theme::System,
        })
    }
}

#[derive(Clone, Debug, Default, PartialEq, Eq, Serialize, Deserialize, Store)]
pub struct State {
    pub theme: Theme,
}

impl State {
    pub fn set_theme(&mut self, theme: Theme) {
        self.theme = theme.clone();

        let value = match theme {
            Theme::Dark => "dark".to_string(),
            Theme::Light => "light".to_string(),
            Theme::System => "system".to_string(),
        };

        if theme == Theme::System {
            LocalStorage::delete("theme");
        } else {
            LocalStorage::set("theme", value).ok();

            let body = web_sys::window()
                .unwrap()
                .document()
                .unwrap()
                .body()
                .unwrap();
            let class_list = body.class_list();

            if theme == Theme::Dark {
                class_list.add_1("dark").unwrap();
            } else {
                class_list.remove_1("dark").unwrap();
            }
        }
    }

    pub fn is_dark(&self) -> bool {
        self.theme == Theme::Dark
    }

    pub fn load_theme(&mut self) {
        let value: Option<String> = LocalStorage::get("theme").unwrap_or_else(|_| None);
        let theme: Theme = match value.as_deref() {
            Some("dark") => Theme::Dark,
            Some("light") => Theme::Light,
            _ => {
                let media = web_sys::window()
                    .unwrap()
                    .match_media("(prefers-color-scheme: dark)")
                    .unwrap()
                    .unwrap();

                if media.matches() {
                    Theme::Dark
                } else {
                    Theme::Light
                }
            }
        };

        self.set_theme(theme);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn set_theme() {
        let mut state = State::default();
        assert_eq!(state.theme, Theme::Light);
        state.set_theme(Theme::Dark);
        assert_eq!(state.theme, Theme::Dark);
        state.set_theme(Theme::System);
        assert_eq!(state.theme, Theme::System);
    }

    #[test]
    fn is_dark() {
        let mut state = State::default();
        assert!(!state.is_dark());
        state.set_theme(Theme::Dark);
        assert!(state.is_dark());
    }

    #[test]
    fn load_theme() {
        let mut state = State::default();
        state.load_theme();
        assert_eq!(state.theme, Theme::Light);
        state.set_theme(Theme::Dark);
        state.load_theme();
        assert_eq!(state.theme, Theme::Dark);
        state.set_theme(Theme::System);
        state.load_theme();
        assert_eq!(state.theme, Theme::System);
    }
}
