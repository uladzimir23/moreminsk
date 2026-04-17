import { routing } from "@/i18n/routing";
import { LocaleRedirect } from "../_components/LocaleRedirect";

export default function FleetRedirect() {
  return <LocaleRedirect to={`/${routing.defaultLocale}/fleet/`} />;
}
