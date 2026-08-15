import { Info } from "lucide-react";

function DemoNotice({ children = "Demonstration mode — all data is synthetic and simulated. Backend integration pending." }) {
  return (
    <div className="demo-notice" role="note">
      <Info size={15} aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}

export default DemoNotice;
