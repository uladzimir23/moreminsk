import { routing } from "@/i18n/routing";
import { LocaleRedirect } from "../_components/LocaleRedirect";

export default function ContactsRedirect() {
  return <LocaleRedirect to={`/${routing.defaultLocale}/contacts/`} />;
}
