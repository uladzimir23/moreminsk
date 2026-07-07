import { routing } from "@/i18n/routing";
import { LocaleRedirect } from "../_components/LocaleRedirect";

export default function FaqRedirect() {
  return <LocaleRedirect to={`/${routing.defaultLocale}/faq/`} />;
}
