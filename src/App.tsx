import TestPage from "@/pages/MainPage";
import Background from "@/components/Background/Background";

function App() {
  return (
    <div className="relative">
      <Background /> {/* 🔥 Mover el Background aquí */}
      <TestPage />
    </div>
  );
}

export default App;
