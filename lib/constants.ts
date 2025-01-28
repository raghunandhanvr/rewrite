import { Globe2, User, Wand2, Sliders } from 'lucide-react'

export const PARAPHRASE_STYLES = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "academic", label: "Academic" },
  { value: "creative", label: "Creative" },
  { value: "simplified", label: "Simplified" },
  { value: "funny", label: "Funny" },
  { value: "sarcastic", label: "Sarcastic" },
  { value: "sad", label: "Sad" },
] as const

export const GENDERS = [
  { value: "neutral", label: "Neutral" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
] as const

export const CHANGE_INTENSITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
] as const

export const COUNTRIES = [
  { value: "in", label: "🇮🇳 India" },
  { value: "ae", label: "🇦🇪 United Arab Emirates" },
  { value: "ar", label: "🇦🇷 Argentina" },
  { value: "at", label: "🇦🇹 Austria" },
  { value: "au", label: "🇦🇺 Australia" },
  { value: "be", label: "🇧🇪 Belgium" },
  { value: "bg", label: "🇧🇬 Bulgaria" },
  { value: "br", label: "🇧🇷 Brazil" },
  { value: "ca", label: "🇨🇦 Canada" },
  { value: "ch", label: "🇨🇭 Switzerland" },
  { value: "cl", label: "🇨🇱 Chile" },
  { value: "co", label: "🇨🇴 Colombia" },
  { value: "cz", label: "🇨🇿 Czech Republic" },
  { value: "de", label: "🇩🇪 Germany" },
  { value: "dk", label: "🇩🇰 Denmark" },
  { value: "eg", label: "🇪🇬 Egypt" },
  { value: "es", label: "🇪🇸 Spain" },
  { value: "fi", label: "🇫🇮 Finland" },
  { value: "fr", label: "🇫🇷 France" },
  { value: "gh", label: "🇬🇭 Ghana" },
  { value: "gr", label: "🇬🇷 Greece" },
  { value: "hu", label: "🇭🇺 Hungary" },
  { value: "id", label: "🇮🇩 Indonesia" },
  { value: "ir", label: "🇮🇷 Iran" },
  { value: "iq", label: "🇮🇶 Iraq" },
  { value: "it", label: "🇮🇹 Italy" },
  { value: "jp", label: "🇯🇵 Japan" },
  { value: "ke", label: "🇰🇪 Kenya" },
  { value: "kr", label: "🇰🇷 South Korea" },
  { value: "mx", label: "🇲🇽 Mexico" },
  { value: "my", label: "🇲🇾 Malaysia" },
  { value: "ng", label: "🇳🇬 Nigeria" },
  { value: "nl", label: "🇳🇱 Netherlands" },
  { value: "no", label: "🇳🇴 Norway" },
  { value: "nz", label: "🇳🇿 New Zealand" },
  { value: "ph", label: "🇵🇭 Philippines" },
  { value: "pk", label: "🇵🇰 Pakistan" },
  { value: "pl", label: "🇵🇱 Poland" },
  { value: "ro", label: "🇷🇴 Romania" },
  { value: "ru", label: "🇷🇺 Russia" },
  { value: "sa", label: "🇸🇦 Saudi Arabia" },
  { value: "se", label: "🇸🇪 Sweden" },
  { value: "sg", label: "🇸🇬 Singapore" },
  { value: "si", label: "🇸🇮 Slovenia" },
  { value: "sk", label: "🇸🇰 Slovakia" },
  { value: "th", label: "🇹🇭 Thailand" },
  { value: "tr", label: "🇹🇷 Turkey" },
  { value: "tz", label: "🇹🇿 Tanzania" },
  { value: "ua", label: "🇺🇦 Ukraine" },
  { value: "us", label: "🇺🇸 United States" },
  { value: "vn", label: "🇻🇳 Vietnam" },
  { value: "za", label: "🇿🇦 South Africa" },
  { value: "zw", label: "🇿🇼 Zimbabwe" },
] as const;


export const DROPDOWN_INFO = {
  style: "Choose the writing style for paraphrasing",
  gender: "Select the gender perspective for the paraphrased text",
  country: "Pick a country to adapt the language and expressions",
  intensity: "Set how much the original text should be changed",
}

export const DROPDOWN_ICONS = {
  style: Wand2,
  gender: User,
  country: Globe2,
  intensity: Sliders,
}
