import { routing } from "@/i18n/routing";
import { LocaleRedirect } from "../_components/LocaleRedirect";

export default function GalereyaRedirect() {
  return <LocaleRedirect to={`/${routing.defaultLocale}/galereya/`} />;
}
