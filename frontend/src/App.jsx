import "../src/common/style/root.css";
import { LanguageProvider } from "./common/i18n";
import AppRoutes from "./common/routes";
const App = () => {
  return (
    <div>
      <LanguageProvider>
        <AppRoutes />
      </LanguageProvider>
    </div>
  )
}

export default App